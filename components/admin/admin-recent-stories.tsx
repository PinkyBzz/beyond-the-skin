import React from 'react'
import Link from 'next/link'
import { getAdminClient } from '@/lib/supabase/admin'
import { getStatusConfig, timeAgo } from '@/lib/utils'
import type { StoryWithCategory } from '@/types'

async function getRecentStories(): Promise<StoryWithCategory[]> {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from('stories')
    .select('*, story_categories(*)')
    .order('submitted_at', { ascending: false })
    .limit(5)
  return (data as StoryWithCategory[]) ?? []
}

export async function AdminRecentStories() {
  const stories = await getRecentStories()

  return (
    <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-[#3A3A3A]">Recent Submissions</h2>
        <Link href="/admin/stories" className="text-xs text-[#E8B4F0] hover:underline font-medium">
          View all
        </Link>
      </div>

      {stories.length === 0 ? (
        <p className="text-sm text-[#3A3A3A]/40 py-4 text-center">No stories yet.</p>
      ) : (
        <ul className="space-y-3" role="list">
          {stories.map((story) => {
            const statusConf = getStatusConfig(story.status)
            return (
              <li key={story.id}>
                <Link
                  href={`/admin/stories/${story.id}`}
                  className="flex items-start gap-3 rounded-xl p-3 hover:bg-[#FFF8E6] transition-colors group"
                >
                  <div
                    className="mt-0.5 h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: story.story_categories.color }}
                    aria-hidden="true"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#3A3A3A] line-clamp-1 group-hover:text-[#E8B4F0] transition-colors">
                      {story.title}
                    </p>
                    <p className="text-xs text-[#3A3A3A]/50 mt-0.5">
                      {story.story_categories.name} · {timeAgo(story.submitted_at)}
                    </p>
                  </div>
                  <span className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConf.bg} ${statusConf.color}`}>
                    {statusConf.label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
