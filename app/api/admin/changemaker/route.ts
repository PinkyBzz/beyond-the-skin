import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { changemakerwWinnerSchema } from '@/lib/validations'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const p = profile as { role: string } | null
  return p?.role === 'admin' ? user : null
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin()
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  try {
    const body = await request.json()
    const validated = changemakerwWinnerSchema.parse(body)
    const supabase = getAdminClient()

    await supabase
      .from('changemaker_winners')
      .update({ is_active: false })
      .eq('month', validated.month)
      .eq('year', validated.year)

    const { error } = await supabase.from('changemaker_winners').insert({
      name: validated.name,
      school: validated.school,
      biography: validated.biography ?? null,
      reason: validated.reason,
      impact: validated.impact ?? null,
      inspirational_message: validated.inspirational_message ?? null,
      month: validated.month,
      year: validated.year,
      nomination_count: validated.nomination_count ?? 0,
      is_active: true,
    })

    if (error) throw error
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Changemaker error:', err)
    return NextResponse.json({ success: false, error: 'Failed to save winner' }, { status: 500 })
  }
}
