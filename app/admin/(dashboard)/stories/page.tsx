import type { Metadata } from 'next'
import { getAdminClient } from '@/lib/supabase/admin'
import { AdminStoriesTable } from '@/components/admin/admin-stories-table'
import type { StoryWithCategory } from '@/types'

export const metadata: Metadata = { title: 'Stories' }

async function getStories(): Promise<StoryWithCategory[]> {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from('stories')
    .select('*, story_categories(*)')
    .order('submitted_at', { ascending: false })
    .limit(100)
  return (data as StoryWithCategory[]) ?? []
}

export default async function AdminStoriesPage() {
  const stories = await getStories()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#3A3A3A]">Stories</h1>
        <p className="text-sm text-[#3A3A3A]/60 mt-1">
          Review, approve, or reject submitted stories.
        </p>
      </div>
      <AdminStoriesTable stories={stories} />
    </div>
  )
}
