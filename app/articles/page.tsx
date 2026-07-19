import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { formatDate, getSectionLabel } from '@/lib/utils'
import { Clock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ArticleWithCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Beauty & Beyond',
  description:
    'Expert tips, real talk, and creative inspiration. Skin Talk, Girl Talk, and Creator\'s Corner.',
}

const SECTIONS = [
  {
    key: 'skin_talk',
    label: 'Skin Talk',
    description: 'Teen skincare, healthy habits, and dermatologist-backed information.',
    color: '#FFB6D6',
    bg: '#FFE9F1',
    emoji: '✨',
    href: '/articles/skin-talk',
  },
  {
    key: 'girl_talk',
    label: 'Girl Talk',
    description: 'Self confidence, body image, friendship, school pressure, and mental wellbeing.',
    color: '#E8B4F0',
    bg: '#F3EDFF',
    emoji: '💜',
    href: '/articles/girl-talk',
  },
  {
    key: 'creators_corner',
    label: "Creator's Corner",
    description: 'Public speaking, photography, content creation, and personal branding.',
    color: '#BDE1FF',
    bg: '#E6F3FF',
    emoji: '📸',
    href: '/articles/creators-corner',
  },
]

async function getLatestBySection() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*, article_categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(9)
  return (data as ArticleWithCategory[]) ?? []
}

export default async function ArticlesPage() {
  const articles = await getLatestBySection()

  const bySection = SECTIONS.reduce(
    (acc, s) => {
      acc[s.key] = articles.filter((a) => a.article_categories.section === s.key)
      return acc
    },
    {} as Record<string, ArticleWithCategory[]>
  )

  return (
    <div className="min-h-screen bg-[#FFF8E6] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-[#3A3A3A] sm:text-4xl lg:text-5xl">
            Beauty &{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #BDE1FF, #E8B4F0)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Beyond
            </span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base text-[#3A3A3A]/70">
            Everything you need to glow — inside and out. From skincare to confidence,
            creativity to connection.
          </p>
        </div>

        {/* Section cards */}
        <div className="grid gap-6 sm:grid-cols-3 mb-16">
          {SECTIONS.map((section) => (
            <Link
              key={section.key}
              href={section.href}
              className="group rounded-3xl p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB6D6]"
              style={{ backgroundColor: section.bg }}
            >
              <div className="text-4xl mb-4">{section.emoji}</div>
              <h2
                className="text-lg font-black text-[#3A3A3A]"
                style={{ color: section.color === '#FFB6D6' ? '#d9668a' : section.color === '#E8B4F0' ? '#a855f7' : '#3b82f6' }}
              >
                {section.label}
              </h2>
              <p className="mt-2 text-sm text-[#3A3A3A]/65 leading-relaxed">
                {section.description}
              </p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold" style={{ color: section.color }}>
                Explore <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>

        {/* Articles by section */}
        {SECTIONS.map((section) => {
          const sectionArticles = bySection[section.key] ?? []
          if (sectionArticles.length === 0) return null
          return (
            <section key={section.key} aria-labelledby={`${section.key}-heading`} className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{section.emoji}</span>
                  <h2 id={`${section.key}-heading`} className="text-xl font-black text-[#3A3A3A]">
                    {section.label}
                  </h2>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={section.href}>
                    View all <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {sectionArticles.map((article) => (
                  <article
                    key={article.id}
                    className="group rounded-2xl bg-white border border-[#FFB6D6]/15 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 overflow-hidden"
                  >
                    <div
                      className="h-40 w-full"
                      style={{ background: `linear-gradient(135deg, ${section.color}50, ${section.color}20)` }}
                      aria-hidden="true"
                    >
                      {article.cover_image_url && (
                        <img
                          src={article.cover_image_url}
                          alt=""
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                    <div className="p-5">
                      <Badge style={{ backgroundColor: section.color + '40', color: '#3A3A3A' }}>
                        {article.article_categories.name}
                      </Badge>
                      <h3 className="mt-2 font-bold text-[#3A3A3A] line-clamp-2 group-hover:text-[#E8B4F0] transition-colors">
                        <Link
                          href={`/articles/${article.article_categories.slug}/${article.slug}`}
                          className="focus-visible:outline-none"
                        >
                          {article.title}
                        </Link>
                      </h3>
                      {article.excerpt && (
                        <p className="mt-1.5 text-sm text-[#3A3A3A]/60 line-clamp-2">{article.excerpt}</p>
                      )}
                      <div className="mt-3 flex items-center justify-between text-xs text-[#3A3A3A]/40">
                        <span>{article.author_name}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" aria-hidden="true" />
                          {article.reading_time} min
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
