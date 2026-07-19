import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { articleFormSchema } from '@/lib/validations'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const p = profile as { role: string } | null
  return p?.role === 'admin' ? user : null
}

/** Raw Supabase client using service role — bypasses RLS and type narrowing issues */
function getRawAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin()
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  try {
    const body = await request.json()
    const validated = articleFormSchema.parse(body)
    const supabase = getRawAdminClient()

    const wordCount = validated.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    const { data, error } = await supabase
      .from('articles')
      .insert({
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt ?? null,
        content: validated.content,
        author_id: admin.id,
        author_name: validated.author_name,
        category_id: validated.category_id,
        status: validated.status,
        reading_time: readingTime,
        published_at: validated.status === 'published' ? new Date().toISOString() : null,
      })
      .select('id')
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (err) {
    console.error('Article create error:', err)
    return NextResponse.json({ success: false, error: 'Failed to create article' }, { status: 500 })
  }
}
