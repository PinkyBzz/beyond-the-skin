import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

interface Params { params: Promise<{ id: string }> }

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const p = profile as { role: string } | null
  return p?.role === 'admin' ? user : null
}

const schema = z.object({ action: z.enum(['approve', 'reject']) })

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params
  const admin = await verifyAdmin()
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  const body = await request.json()
  const { action } = schema.parse(body)
  const supabase = getAdminClient()

  const { error } = await supabase
    .from('comments')
    .update({ status: action === 'approve' ? 'approved' : 'rejected', updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params
  const admin = await verifyAdmin()
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  const supabase = getAdminClient()
  const { error } = await supabase.from('comments').delete().eq('id', id)
  if (error) return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 })
  return NextResponse.json({ success: true })
}
