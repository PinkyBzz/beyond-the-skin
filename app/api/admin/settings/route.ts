import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'

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

  const body = await request.json()
  const supabase = getAdminClient()

  const entries = Object.entries(body as Record<string, string>)
  for (const [key, value] of entries) {
    await supabase
      .from('site_settings')
      .upsert({ key, value: value, updated_at: new Date().toISOString() }, { onConflict: 'key' })
  }

  return NextResponse.json({ success: true })
}
