import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { formatDate, getSectionLabel } from '@/lib/utils'
import { ArrowLeft, Clock, Eye } from 'lucide-react'
import type { ArticleWithCategory } from '@/types'

interface ArticlePageProps {
  params: Promise<{ section: string; slug: string }>
}

async function getArticle(slug: string): Promise<ArticleWithCategory | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*, article_categories(*), article_tag_relations(article_tags(*))')
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
  return data as ArticleWithCategory | null
}

async function getRelatedArticles(articleId: string, categoryId: string): Promise<ArticleWithCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*, article_categories(*)')
    .eq('status', 'published')
    .eq('category_id', categoryId)
    .neq('id', articleId)
    .limit(3)
  return (data as ArticleWithCategory[]) ?? []
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Article Not Found' }
  return {
    title: article.title,
    description: article.excerpt ?? article.content.slice(0, 155) + '…',
    openGraph: {
      title: article.title,
      type: 'article',
      publishedTime: article.published_at ?? undefined,
      authors: [article.author_name],
      ...(article.cover_image_url && { images: [article.cover_image_url] }),
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug, section } = await params
  const article = await getArticle(slug)

  if (!article) notFound()
  if (article.article_categories.slug !== section) notFound()

  const related = await getRelatedArticles(article.id, article.category_id)

  // Increment view count (fire-and-forget, use raw client to avoid type issues)
  const { getAdminClient } = await import('@/lib/supabase/admin')
  const adminDb = getAdminClient()
  adminDb.from('articles').update({ view_count: (article.view_count ?? 0) + 1 }).eq('id', article.id).then(() => {})

  const sectionLabel = getSectionLabel(article.article_categories.section)
  const sectionColors: Record<string, string> = {
    skin_talk: '#FFB6D6',
    girl_talk: '#E8B4F0',
    creators_corner: '#BDE1FF',
  }
  const color = sectionColors[article.article_categories.section] ?? '#FFB6D6'

  return (
    <div className="min-h-screen bg-[#FFF8E6] pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Back */}
        <Link
          href={`/articles/${section}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#3A3A3A]/60 hover:text-[#3A3A3A] mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          Back to {sectionLabel}
        </Link>

        {/* Cover */}
        {article.cover_image_url && (
          <div className="mb-8 rounded-3xl overflow-hidden">
            <img
              src={article.cover_image_url}
              alt=""
              aria-hidden="true"
              className="w-full h-64 sm:h-80 object-cover"
            />
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-5">
          <Badge style={{ backgroundColor: color + '40', color: '#3A3A3A' }}>
            {sectionLabel}
          </Badge>
          <Badge style={{ backgroundColor: color + '25', color: '#3A3A3A' }}>
            {article.article_categories.name}
          </Badge>
          {article.article_tag_relations?.map((rel) => (
            <Badge key={rel.article_tags?.id} variant="outline">
              #{rel.article_tags?.name}
            </Badge>
          ))}
        </div>

        <h1 className="text-2xl font-black text-[#3A3A3A] leading-tight sm:text-3xl lg:text-4xl">
          {article.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-[#3A3A3A]/40">
          <span className="font-medium">{article.author_name}</span>
          {article.published_at && (
            <time dateTime={article.published_at}>{formatDate(article.published_at)}</time>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {article.reading_time} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {article.view_count} reads
          </span>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-[#FFB6D6]/50 to-transparent" />

        {/* Content */}
        <div
          className="rich-text prose-story text-[#3A3A3A]/85"
          dangerouslySetInnerHTML={{ __html: article.content }}
          aria-label="Article content"
        />

        {/* Related Articles */}
        {related.length > 0 && (
          <aside aria-labelledby="related-heading" className="mt-14">
            <h2 id="related-heading" className="text-lg font-black text-[#3A3A3A] mb-5">
              Related Articles
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((rel) => (
                <article key={rel.id} className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-4 hover:shadow-sm transition-all">
                  <h3 className="font-bold text-sm text-[#3A3A3A] line-clamp-2 hover:text-[#E8B4F0] transition-colors">
                    <Link href={`/articles/${rel.article_categories.slug}/${rel.slug}`}>
                      {rel.title}
                    </Link>
                  </h3>
                  <div className="mt-2 flex items-center gap-1 text-xs text-[#3A3A3A]/40">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {rel.reading_time} min
                  </div>
                </article>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}
