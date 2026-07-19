import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { AdminStoryActions } from '@/components/admin/admin-story-actions'
import { formatDate, getStatusConfig, estimateReadingTime } from '@/lib/utils'
import { ArrowLeft, Clock, User, School, Phone } from 'lucide-react'
import type { StoryWithCategory } from '@/types'

interface Props { params: Promise<{ id: string }> }

async function getStory(id: string): Promise<StoryWithCategory | null> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('stories')
    .select('*, story_categories(*)')
    .eq('id', id)
    .maybeSingle()
  return data as StoryWithCategory | null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const story = await getStory(id)
  return { title: story ? `Review: ${story.title}` : 'Story Not Found' }
}

export default async function AdminStoryDetailPage({ params }: Props) {
  const { id } = await params
  const story = await getStory(id)
  if (!story) notFound()

  const statusConf = getStatusConfig(story.status)

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/stories"
        className="inline-flex items-center gap-1.5 text-sm text-[#3A3A3A]/60 hover:text-[#3A3A3A] transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" aria-hidden="true" />
        Back to Stories
      </Link>

      {/* Header */}
      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge style={{ backgroundColor: story.story_categories.color + '40', color: '#3A3A3A' }}>
                {story.story_categories.name}
              </Badge>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusConf.bg} ${statusConf.color}`}>
                {statusConf.label}
              </span>
            </div>
            <h1 className="text-xl font-black text-[#3A3A3A]">{story.title}</h1>
          </div>
          <AdminStoryActions story={story} />
        </div>

        {/* Submitter info */}
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-sm">
          {[
            { icon: User, label: 'Name', value: story.full_name },
            { icon: User, label: 'Age', value: `${story.age} years old` },
            { icon: School, label: 'School', value: story.school },
            { icon: Phone, label: 'Phone', value: story.phone_number ?? 'Not provided' },
          ].map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex items-start gap-2">
                <Icon className="h-4 w-4 text-[#3A3A3A]/40 mt-0.5 shrink-0" aria-hidden="true" />
                <div>
                  <p className="text-[10px] text-[#3A3A3A]/50 uppercase tracking-wide">{item.label}</p>
                  <p className="text-sm text-[#3A3A3A] font-medium">{item.value}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-3 flex items-center gap-3 text-xs text-[#3A3A3A]/40">
          <Clock className="h-3 w-3" aria-hidden="true" />
          <span>Submitted: {formatDate(story.submitted_at)}</span>
          <span>·</span>
          <span>{estimateReadingTime(story.content)} min read</span>
        </div>
      </div>

      {/* Story content */}
      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm">
        <h2 className="font-bold text-[#3A3A3A] mb-3">Story</h2>
        <div className="prose-story text-[#3A3A3A]/80">
          {story.content.split('\n').map((para, i) =>
            para.trim() ? (
              <p key={i} className="mb-4 leading-relaxed">{para}</p>
            ) : null
          )}
        </div>
      </div>

      {/* Reflection */}
      <div className="rounded-2xl bg-[#F3EDFF] border border-[#E8B4F0]/20 p-6">
        <h2 className="font-bold text-[#3A3A3A] mb-2">Reflection</h2>
        <p className="text-sm text-[#3A3A3A]/70 italic leading-relaxed">&ldquo;{story.reflection}&rdquo;</p>
      </div>

      {/* Changemaker */}
      <div className="rounded-2xl bg-[#FFF3B0]/50 border border-[#FFF3B0] p-6">
        <h2 className="font-bold text-[#3A3A3A] mb-2">Confidence Changemaker Nomination</h2>
        <p className="text-sm font-semibold text-[#3A3A3A]">{story.changemaker_name}</p>
        <p className="text-sm text-[#3A3A3A]/70 mt-1 leading-relaxed">{story.changemaker_reason}</p>
      </div>

      {/* Rejection reason if any */}
      {story.rejection_reason && (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
          <p className="text-sm font-bold text-red-700 mb-1">Rejection Reason</p>
          <p className="text-sm text-red-600">{story.rejection_reason}</p>
        </div>
      )}
    </div>
  )
}
