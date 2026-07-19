import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { storyModerationSchema } from '@/lib/validations'

interface Params { params: Promise<{ id: string }> }

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const p = profile as { role: string } | null
  if (p?.role !== 'admin') return null
  return user
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const admin = await verifyAdmin()
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  try {
    const body = await request.json()
    const validated = storyModerationSchema.parse(body)
    const supabase = getAdminClient()

    const statusMap: Record<string, string> = {
      approve: 'published',   // approve = immediately published
      reject: 'rejected',
      publish: 'published',
    }

    const updateData: Record<string, unknown> = {
      status: statusMap[validated.action],
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    if (validated.action === 'reject' && validated.rejection_reason) {
      updateData.rejection_reason = validated.rejection_reason
    }
    // Set published_at when approving or publishing
    if (validated.action === 'approve' || validated.action === 'publish') {
      updateData.published_at = new Date().toISOString()
    }
    if (validated.admin_notes) {
      updateData.admin_notes = validated.admin_notes
    }

    const { error } = await supabase.from('stories').update(updateData).eq('id', id)
    if (error) throw error

    await supabase.from('audit_logs').insert({
      admin_id: admin.id,
      action: validated.action,
      entity_type: 'story',
      entity_id: id,
      new_data: updateData,
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Story moderation error:', err)
    return NextResponse.json({ success: false, error: 'Moderation failed' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params
  const admin = await verifyAdmin()
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  const supabase = getAdminClient()
  const { error } = await supabase.from('stories').delete().eq('id', id)
  if (error) return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 })

  await supabase.from('audit_logs').insert({
    admin_id: admin.id,
    action: 'delete',
    entity_type: 'story',
    entity_id: id,
    new_data: null,
  })

  return NextResponse.json({ success: true })
}
