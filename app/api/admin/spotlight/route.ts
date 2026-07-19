import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { spotlightSchema } from '@/lib/validations'

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
    const validated = spotlightSchema.parse(body)
    const supabase = getAdminClient()

    await supabase.from('weekly_spotlights').update({ is_active: false }).eq('is_active', true)
    await supabase.from('stories').update({ is_spotlight: true }).eq('id', validated.story_id)

    const { error } = await supabase.from('weekly_spotlights').insert({
      story_id: validated.story_id,
      week_start: validated.week_start,
      week_end: validated.week_end,
      message: validated.message ?? null,
      is_active: true,
    })

    if (error) throw error
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (err) {
    console.error('Spotlight error:', err)
    return NextResponse.json({ success: false, error: 'Failed to set spotlight' }, { status: 500 })
  }
}
