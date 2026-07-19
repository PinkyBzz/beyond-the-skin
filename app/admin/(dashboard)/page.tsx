import type { Metadata } from 'next'
import { getAdminClient } from '@/lib/supabase/admin'
import { AdminStatsCards } from '@/components/admin/admin-stats-cards'
import { AdminRecentStories } from '@/components/admin/admin-recent-stories'
import { AdminRecentComments } from '@/components/admin/admin-recent-comments'

export const metadata: Metadata = { title: 'Overview' }

async function getDashboardStats() {
  const supabase = getAdminClient()

  const [
    { count: pendingStories },
    { count: publishedStories },
    { count: totalArticles },
    { count: pendingComments },
    { count: totalVisitors },
  ] = await Promise.all([
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
  ])

  return {
    pendingStories: pendingStories ?? 0,
    publishedStories: publishedStories ?? 0,
    totalArticles: totalArticles ?? 0,
    pendingComments: pendingComments ?? 0,
    totalVisitors: totalVisitors ?? 0,
  }
}

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#3A3A3A]">Dashboard</h1>
        <p className="text-sm text-[#3A3A3A]/60 mt-1">
          Welcome back. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      <AdminStatsCards stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminRecentStories />
        <AdminRecentComments />
      </div>
    </div>
  )
}
