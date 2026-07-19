import React from 'react'
import Link from 'next/link'
import { ArrowRight, Clock, Eye } from 'lucide-react'
import { getAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate, estimateReadingTime } from '@/lib/utils'
import type { StoryWithCategory } from '@/types'

async function getLatestStories(): Promise<StoryWithCategory[]> {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from('stories')
    .select('*, story_categories(*)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(6)

  return (data as StoryWithCategory[]) ?? []
}

function StoryCard({ story }: { story: StoryWithCategory }) {
  const readingTime = estimateReadingTime(story.content)

  return (
    <article className="group rounded-2xl bg-white border border-[#FFB6D6]/15 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 overflow-hidden">
      {/* Show cover image only if it exists */}
      {story.cover_image_url ? (
        <div className="h-40 w-full overflow-hidden" aria-hidden="true">
          <img
            src={story.cover_image_url}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="h-1.5 w-full"
          style={{ backgroundColor: story.story_categories.color }}
          aria-hidden="true"
        />
      )}

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge
            style={{
              backgroundColor: story.story_categories.color + '40',
              color: '#3A3A3A',
            }}
          >
            {story.story_categories.name}
          </Badge>
          {story.is_spotlight && (
            <Badge variant="spotlight">✨ Spotlight</Badge>
          )}
        </div>

        <h3 className="font-bold text-[#3A3A3A] line-clamp-2 group-hover:text-[#E8B4F0] transition-colors">
          <Link href={`/stories/${story.id}`} className="focus-visible:outline-none">
            {story.title}
          </Link>
        </h3>

        <p className="mt-2 text-sm text-[#3A3A3A]/60 line-clamp-2">
          {story.content.slice(0, 120)}...
        </p>

        <div className="mt-4 flex items-center justify-between text-xs text-[#3A3A3A]/40">
          <time dateTime={story.published_at ?? story.submitted_at}>
            {formatDate(story.published_at ?? story.submitted_at)}
          </time>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {readingTime} min read
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" aria-hidden="true" />
              {story.view_count}
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export async function LatestStories() {
  const stories = await getLatestStories()

  return (
    <section aria-labelledby="latest-stories-heading" className="bg-white py-20 lg:py-28 overflow-hidden relative">
      {/* Top Wave Divider */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-28 lg:h-36">
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="#FFE9F1"
          />
        </svg>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2
              id="latest-stories-heading"
              className="text-3xl font-black text-[#3A3A3A] sm:text-4xl"
            >
              Latest{' '}
              <span
                style={{
                  background: 'linear-gradient(135deg, #E8B4F0, #FFB6D6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Stories
              </span>
            </h2>
            <p className="mt-2 text-sm text-[#3A3A3A]/60">
              Real experiences from real girls — curated with care.
            </p>
          </div>
          <Button asChild variant="outline" className="hidden sm:inline-flex">
            <Link href="/stories">
              View all <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>

        {stories.length === 0 ? (
          <div className="text-center py-16 text-[#3A3A3A]/40">
            <div className="text-4xl mb-3">📖</div>
            <p className="font-medium">Stories are coming soon.</p>
            <p className="text-sm mt-1">Be the first to share yours!</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center sm:hidden">
          <Button asChild variant="outline">
            <Link href="/stories">
              View all stories <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
