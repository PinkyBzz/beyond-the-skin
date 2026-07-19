import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { articleFormSchema } from '@/lib/validations'

interface Params { params: Promise<{ id: string }> }

async function verifyAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  const p = profile as { role: string } | null
  return p?.role === 'admin' ? user : null
}

export async function PUT(request: NextRequest, { params }: Params) {
  const { id } = await params
  const admin = await verifyAdmin()
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  try {
    const body = await request.json()
    const validated = articleFormSchema.parse(body)
    const supabase = getAdminClient()

    const wordCount = validated.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
    const readingTime = Math.max(1, Math.ceil(wordCount / 200))

    const { error } = await supabase
      .from('articles')
      .update({
        title: validated.title,
        slug: validated.slug,
        excerpt: validated.excerpt ?? null,
        content: validated.content,
        author_name: validated.author_name,
        category_id: validated.category_id,
        status: validated.status,
        reading_time: readingTime,
        published_at: validated.status === 'published' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Article update error:', err)
    return NextResponse.json({ success: false, error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const { id } = await params
  const admin = await verifyAdmin()
  if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 })

  const supabase = getAdminClient()
  const { error } = await supabase.from('articles').delete().eq('id', id)
  if (error) return NextResponse.json({ success: false, error: 'Delete failed' }, { status: 500 })
  return NextResponse.json({ success: true })
}
