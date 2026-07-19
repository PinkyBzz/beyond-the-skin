import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const { page } = await request.json()
    if (!page || typeof page !== 'string') {
      return NextResponse.json({ success: false }, { status: 400 })
    }

    const supabase = getAdminClient()
    await supabase.from('page_views').insert({
      page: page.slice(0, 500),
      referrer: request.headers.get('referer')?.slice(0, 500) ?? null,
      user_agent: request.headers.get('user-agent')?.slice(0, 300) ?? null,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
