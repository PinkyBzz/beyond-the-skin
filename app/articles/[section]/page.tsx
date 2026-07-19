import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { formatDate, getSectionLabel } from '@/lib/utils'
import { Clock, ArrowLeft } from 'lucide-react'
import type { ArticleWithCategory, ArticleSection } from '@/types'

interface Props { params: Promise<{ section: string }> }

const SECTION_SLUGS: Record<string, ArticleSection> = {
  'skin-talk': 'skin_talk',
  'girl-talk': 'girl_talk',
  'creators-corner': 'creators_corner',
}

const SECTION_META: Record<ArticleSection, { title: string; description: string; color: string; emoji: string }> = {
  skin_talk: {
    title: 'Skin Talk',
    description: 'Teen skincare, healthy habits, and dermatologist-backed tips to help your skin glow.',
    color: '#FFB6D6',
    emoji: '✨',
  },
  girl_talk: {
    title: 'Girl Talk',
    description: 'Honest conversations about self confidence, body image, friendship, and mental wellbeing.',
    color: '#E8B4F0',
    emoji: '💜',
  },
  creators_corner: {
    title: "Creator's Corner",
    description: 'Build your voice — public speaking, photography, content creation, and personal branding.',
    color: '#BDE1FF',
    emoji: '📸',
  },
}

async function getArticles(section: ArticleSection): Promise<ArticleWithCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*, article_categories(*)')
    .eq('status', 'published')
    .eq('article_categories.section', section)
    .order('published_at', { ascending: false })
  return (data as ArticleWithCategory[])?.filter((a) => a.article_categories.section === section) ?? []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { section } = await params
  const sectionKey = SECTION_SLUGS[section]
  if (!sectionKey) return { title: 'Not Found' }
  const meta = SECTION_META[sectionKey]
  return { title: meta.title, description: meta.description }
}

export default async function ArticleSectionPage({ params }: Props) {
  const { section } = await params
  const sectionKey = SECTION_SLUGS[section]
  if (!sectionKey) notFound()

  const articles = await getArticles(sectionKey)
  const meta = SECTION_META[sectionKey]

  return (
    <div className="min-h-screen bg-[#FFF8E6] pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-sm text-[#3A3A3A]/60 hover:text-[#3A3A3A] mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          Beauty & Beyond
        </Link>

        {/* Header */}
        <div
          className="rounded-3xl p-8 mb-10 text-center"
          style={{ background: `linear-gradient(135deg, ${meta.color}30, ${meta.color}10)` }}
        >
          <div className="text-5xl mb-3" aria-hidden="true">{meta.emoji}</div>
          <h1 className="text-3xl font-black text-[#3A3A3A] sm:text-4xl">{meta.title}</h1>
          <p className="mt-3 max-w-xl mx-auto text-[#3A3A3A]/65 leading-relaxed">{meta.description}</p>
        </div>

        {/* Articles grid */}
        {articles.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3" aria-hidden="true">{meta.emoji}</div>
            <h2 className="font-bold text-[#3A3A3A]">Articles coming soon</h2>
            <p className="text-sm text-[#3A3A3A]/50 mt-1">We're working on this section. Check back soon!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article.id}
                className="group rounded-2xl bg-white border border-[#FFB6D6]/15 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 overflow-hidden"
              >
                {article.cover_image_url ? (
                  <div className="h-44 w-full overflow-hidden" aria-hidden="true">
                    <img src={article.cover_image_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                  </div>
                ) : (
                  <div className="h-1.5 w-full" style={{ backgroundColor: meta.color }} aria-hidden="true" />
                )}
                <div className="p-5">
                  <Badge style={{ backgroundColor: meta.color + '40', color: '#3A3A3A', fontSize: '11px' }}>
                    {article.article_categories.name}
                  </Badge>
                  <h2 className="mt-2 font-bold text-[#3A3A3A] line-clamp-2 group-hover:text-[#E8B4F0] transition-colors">
                    <Link href={`/articles/${section}/${article.slug}`} className="focus-visible:outline-none">
                      {article.title}
                    </Link>
                  </h2>
                  {article.excerpt && (
                    <p className="mt-1.5 text-sm text-[#3A3A3A]/60 line-clamp-2">{article.excerpt}</p>
                  )}
                  <div className="mt-3 flex items-center justify-between text-xs text-[#3A3A3A]/40">
                    <span>{article.author_name}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {article.reading_time} min
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
