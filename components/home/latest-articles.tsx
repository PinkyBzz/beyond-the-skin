import React from 'react'
import Link from 'next/link'
import { ArrowRight, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, getSectionLabel } from '@/lib/utils'
import type { ArticleWithCategory } from '@/types'

async function getLatestArticles(): Promise<ArticleWithCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*, article_categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(3)

  return (data as ArticleWithCategory[]) ?? []
}

const sectionColors: Record<string, string> = {
  skin_talk: '#FFB6D6',
  girl_talk: '#E8B4F0',
  creators_corner: '#BDE1FF',
}

export async function LatestArticles() {
  const articles = await getLatestArticles()

  if (articles.length === 0) return null

  return (
    <section
      aria-labelledby="latest-articles-heading"
      className="py-20 lg:py-28 overflow-hidden relative"
      style={{ background: 'linear-gradient(180deg, #F3EDFF 0%, #E9FBF5 100%)' }}
    >
      {/* Top Wave Divider */}
      <div className="absolute top-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-28 lg:h-36">
          <path 
            d="M0,60 C300,0 300,120 600,60 C900,0 900,120 1200,60 L1200,0 L0,0 Z" 
            fill="white"
          />
        </svg>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2
              id="latest-articles-heading"
              className="text-3xl font-black text-[#3A3A3A] sm:text-4xl"
            >
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
            </h2>
            <p className="mt-2 text-sm text-[#3A3A3A]/60">
              Expert tips, real talk, and creative inspiration.
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/articles">
              All Articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => {
            const sectionColor =
              sectionColors[article.article_categories.section] ?? '#FFB6D6'
            return (
              <article
                key={article.id}
                className="group rounded-2xl bg-white border border-[#FFB6D6]/15 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 overflow-hidden"
              >
                {/* Cover */}
                <div
                  className="h-44 w-full"
                  style={{
                    background: `linear-gradient(135deg, ${sectionColor}50, ${sectionColor}20)`,
                  }}
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
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      style={{
                        backgroundColor: sectionColor + '40',
                        color: '#3A3A3A',
                      }}
                    >
                      {getSectionLabel(article.article_categories.section)}
                    </Badge>
                  </div>

                  <h3 className="font-bold text-[#3A3A3A] line-clamp-2 group-hover:text-[#E8B4F0] transition-colors">
                    <Link
                      href={`/articles/${article.article_categories.slug}/${article.slug}`}
                      className="focus-visible:outline-none"
                    >
                      {article.title}
                    </Link>
                  </h3>

                  {article.excerpt && (
                    <p className="mt-2 text-sm text-[#3A3A3A]/60 line-clamp-2">
                      {article.excerpt}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between text-xs text-[#3A3A3A]/40">
                    <span className="font-medium">{article.author_name}</span>
                    <div className="flex items-center gap-3">
                      <time dateTime={article.published_at ?? ''}>
                        {article.published_at ? formatDate(article.published_at) : ''}
                      </time>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" aria-hidden="true" />
                        {article.reading_time} min
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/articles">
              View all articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
