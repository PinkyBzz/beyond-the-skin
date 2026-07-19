import React from 'react'
import Link from 'next/link'
import { Sparkles, ArrowRight, Clock } from 'lucide-react'
import { getAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, estimateReadingTime } from '@/lib/utils'
import type { SpotlightWithStory } from '@/types'

async function getWeeklySpotlight(): Promise<SpotlightWithStory | null> {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from('weekly_spotlights')
    .select('*, stories(*, story_categories(*))')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  return data as SpotlightWithStory | null
}

export async function WeeklySpotlight() {
  const spotlight = await getWeeklySpotlight()

  if (!spotlight || !spotlight.stories) return null

  const story = spotlight.stories
  const readingTime = estimateReadingTime(story.content)

  return (
    <section
      aria-labelledby="spotlight-heading"
      className="py-20 lg:py-28 overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #FFF3B0 0%, #FFE9F1 50%, #F3EDFF 100%)' }}
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
      
      {/* Bottom Wave Divider */}
      <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-28 lg:h-36">
          <path 
            d="M0,60 C300,120 300,0 600,60 C900,120 900,0 1200,60 L1200,120 L0,120 Z" 
            fill="#F3EDFF"
          />
        </svg>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#3A3A3A]/70 shadow-sm mb-4">
              <Sparkles className="h-4 w-4 text-[#FFF3B0] fill-[#FFF3B0]" aria-hidden="true" />
              Weekly Story Spotlight
            </div>
            <h2
              id="spotlight-heading"
              className="text-3xl font-black text-[#3A3A3A] sm:text-4xl"
            >
              This Week&apos;s{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #FFF3B0, #FFB6D6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Featured Story
              </span>
            </h2>
          </div>

          {/* Spotlight card */}
          <div className="rounded-3xl bg-white shadow-xl border border-[#FFB6D6]/20 overflow-hidden">
            {/* Cover */}
            <div
              className="h-48 sm:h-64"
              style={{
                background: `linear-gradient(135deg, ${story.story_categories.color}60, ${story.story_categories.color}30)`,
              }}
              aria-hidden="true"
            >
              {story.cover_image_url && (
                <img
                  src={story.cover_image_url}
                  alt=""
                  className="h-full w-full object-cover"
                />
              )}
            </div>

            <div className="p-8 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <Badge variant="spotlight">
                  <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
                  Featured
                </Badge>
                <Badge
                  style={{
                    backgroundColor: story.story_categories.color + '40',
                    color: '#3A3A3A',
                  }}
                >
                  {story.story_categories.name}
                </Badge>
              </div>

              <h3 className="text-2xl font-black text-[#3A3A3A] sm:text-3xl">
                {story.title}
              </h3>

              {spotlight.message && (
                <p className="mt-3 text-sm font-medium italic text-[#E8B4F0]">
                  &ldquo;{spotlight.message}&rdquo;
                </p>
              )}

              <p className="mt-4 text-[#3A3A3A]/70 leading-relaxed line-clamp-3">
                {story.content.slice(0, 200)}...
              </p>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 text-xs text-[#3A3A3A]/40">
                  <time dateTime={story.published_at ?? story.submitted_at}>
                    {formatDate(story.published_at ?? story.submitted_at)}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {readingTime} min read
                  </span>
                </div>
                <Button asChild variant="default">
                  <Link href={`/stories/${story.id}`}>
                    Read Full Story
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
