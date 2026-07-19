import type { Metadata } from 'next'
import { getAdminClient } from '@/lib/supabase/admin'
import { AdminSpotlightManager } from '@/components/admin/admin-spotlight-manager'
import type { SpotlightWithStory, StoryWithCategory } from '@/types'

export const metadata: Metadata = { title: 'Weekly Spotlight' }

async function getData() {
  // Use admin client so RLS doesn't block reading approved/published stories
  const supabase = getAdminClient()

  const [{ data: spotlights }, { data: publishedStories }] = await Promise.all([
    supabase
      .from('weekly_spotlights')
      .select('*, stories(*, story_categories(*))')
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('stories')
      .select('*, story_categories(*)')
      // Include both approved and published stories so admin can spotlight either
      .in('status', ['approved', 'published'])
      .order('submitted_at', { ascending: false })
      .limit(100),
  ])

  return {
    spotlights: (spotlights as SpotlightWithStory[]) ?? [],
    stories: (publishedStories as StoryWithCategory[]) ?? [],
  }
}

export default async function AdminSpotlightPage() {
  const { spotlights, stories } = await getData()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#3A3A3A]">Weekly Spotlight</h1>
        <p className="text-sm text-[#3A3A3A]/60 mt-1">
          Choose the featured story each week. Shows approved and published stories.
        </p>
      </div>
      <AdminSpotlightManager spotlights={spotlights} stories={stories} />
    </div>
  )
}
