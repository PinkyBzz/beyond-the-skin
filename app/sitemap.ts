import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'
  const supabase = await createClient()

  const [{ data: stories }, { data: articles }] = await Promise.all([
    supabase
      .from('stories')
      .select('id, published_at, updated_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
    supabase
      .from('articles')
      .select('slug, published_at, updated_at, article_categories(slug)')
      .eq('status', 'published')
      .order('published_at', { ascending: false }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${base}/stories`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${base}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/articles/skin-talk`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/articles/girl-talk`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/articles/creators-corner`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/changemaker`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/share`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/search`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
  ]

  const storyRoutes: MetadataRoute.Sitemap = ((stories ?? []) as Array<{id: string; updated_at: string | null; published_at: string | null}>).map((s) => ({
    url: `${base}/stories/${s.id}`,
    lastModified: new Date(s.updated_at ?? s.published_at ?? new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  const articleRoutes: MetadataRoute.Sitemap = ((articles ?? []) as Array<{slug: string; updated_at: string | null; published_at: string | null; article_categories: {slug: string}}> ).map((a) => ({
    url: `${base}/articles/${a.article_categories?.slug}/${a.slug}`,
    lastModified: new Date(a.updated_at ?? a.published_at ?? new Date()),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...storyRoutes, ...articleRoutes]
}
