import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import { Badge } from '@/components/ui/badge'
import { CommentSection } from '@/components/features/comment-section'
import { formatDate, estimateReadingTime } from '@/lib/utils'
import { ArrowLeft, Clock, Eye, Sparkles } from 'lucide-react'
import type { StoryWithCategory } from '@/types'

interface StoryPageProps {
  params: Promise<{ id: string }>
}

async function getStory(id: string): Promise<StoryWithCategory | null> {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from('stories')
    .select('*, story_categories(*)')
    .eq('id', id)
    .eq('status', 'published')
    .maybeSingle()
  return data as StoryWithCategory | null
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { id } = await params
  const story = await getStory(id)
  if (!story) return { title: 'Story Not Found' }

  return {
    title: story.title,
    description: story.content.slice(0, 155) + '…',
    openGraph: {
      title: story.title,
      description: story.content.slice(0, 155) + '…',
      type: 'article',
      ...(story.cover_image_url && { images: [story.cover_image_url] }),
    },
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { id } = await params
  const story = await getStory(id)

  if (!story) notFound()

  // Increment view count (fire-and-forget)
  const { getAdminClient } = await import('@/lib/supabase/admin')
  const adminDb = getAdminClient()
  adminDb.from('stories').update({ view_count: (story.view_count ?? 0) + 1 }).eq('id', id).then(() => {})

  const readingTime = estimateReadingTime(story.content)

  return (
    <div className="min-h-screen bg-[#FFF8E6] pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/stories"
          className="inline-flex items-center gap-1.5 text-sm text-[#3A3A3A]/60 hover:text-[#3A3A3A] mb-8 transition-colors group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
          Back to Stories
        </Link>

        {/* Cover image */}
        {story.cover_image_url && (
          <div className="mb-8 overflow-hidden rounded-3xl">
            <img
              src={story.cover_image_url}
              alt=""
              aria-hidden="true"
              className="h-64 w-full object-cover sm:h-80"
            />
          </div>
        )}

        {/* Category & badges */}
        <div className="flex flex-wrap items-center gap-2 mb-5">
          <Badge
            style={{
              backgroundColor: story.story_categories.color + '40',
              color: '#3A3A3A',
            }}
          >
            {story.story_categories.name}
          </Badge>
          {story.is_spotlight && (
            <Badge variant="spotlight">
              <Sparkles className="h-3 w-3 mr-1" aria-hidden="true" />
              Weekly Spotlight
            </Badge>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-black text-[#3A3A3A] leading-tight sm:text-3xl lg:text-4xl">
          {story.title}
        </h1>

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4 text-xs text-[#3A3A3A]/40">
          <time dateTime={story.published_at ?? story.submitted_at}>
            {formatDate(story.published_at ?? story.submitted_at)}
          </time>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" aria-hidden="true" />
            {readingTime} min read
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" aria-hidden="true" />
            {story.view_count} reads
          </span>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-[#FFB6D6]/50 to-transparent" />

        {/* Story content */}
        <article className="prose-story" aria-label="Story content">
          {story.content.split('\n').map((para, i) =>
            para.trim() ? (
              <p key={i} className="mb-5 text-[#3A3A3A]/85 leading-relaxed text-lg">
                {para}
              </p>
            ) : (
              <div key={i} className="mb-3" />
            )
          )}
        </article>

        {/* Reflection */}
        <div className="my-10 rounded-2xl bg-gradient-to-br from-[#F3EDFF] to-[#FFE9F1] p-6 sm:p-8">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-1 w-6 rounded-full bg-[#E8B4F0]" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-wide text-[#E8B4F0]">
              Reflection
            </span>
          </div>
          <p className="text-base font-semibold text-[#3A3A3A]/80 italic leading-relaxed">
            &ldquo;What is the biggest lesson you learned from this experience?&rdquo;
          </p>
          <p className="mt-3 text-[#3A3A3A]/70 leading-relaxed">{story.reflection}</p>
        </div>

        {/* Comment section */}
        <CommentSection storyId={story.id} />
      </div>
    </div>
  )
}
