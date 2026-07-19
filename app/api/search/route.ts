import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { SearchResult } from '@/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()

  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, data: [] })
  }

  const supabase = await createClient()

  const [storiesRes, articlesRes] = await Promise.all([
    supabase
      .from('stories')
      .select('id, title, content, story_categories(name)')
      .eq('status', 'published')
      .ilike('title', `%${q}%`)
      .limit(5),

    supabase
      .from('articles')
      .select('id, title, slug, excerpt, article_categories(name, slug, section)')
      .eq('status', 'published')
      .ilike('title', `%${q}%`)
      .limit(5),
  ])

  const results: SearchResult[] = []

  for (const story of storiesRes.data ?? []) {
    const s = story as {
      id: string
      title: string
      content: string
      story_categories: { name: string }
    }
    results.push({
      type: 'story',
      id: s.id,
      title: s.title,
      excerpt: s.content.slice(0, 100) + '…',
      category: s.story_categories?.name ?? '',
      url: `/stories/${s.id}`,
    })
  }

  for (const article of articlesRes.data ?? []) {
    const a = article as {
      id: string
      title: string
      slug: string
      excerpt: string | null
      article_categories: { name: string; slug: string; section: string }
    }
    results.push({
      type: 'article',
      id: a.id,
      title: a.title,
      excerpt: a.excerpt ?? '',
      slug: a.slug,
      category: a.article_categories?.name ?? '',
      url: `/articles/${a.article_categories?.slug ?? ''}/${a.slug}`,
    })
  }

  return NextResponse.json({ success: true, data: results })
}
