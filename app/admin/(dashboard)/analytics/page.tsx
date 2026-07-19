import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { BarChart3, BookOpen, FileText, MessageCircle, Eye, TrendingUp } from 'lucide-react'
import { formatNumber, getMonthName } from '@/lib/utils'

export const metadata: Metadata = { title: 'Analytics' }

async function getAnalytics() {
  const supabase = await createClient()
  const now = new Date()

  const [
    { count: totalStories },
    { count: publishedStories },
    { count: pendingStories },
    { count: totalComments },
    { count: approvedComments },
    { count: totalArticles },
    { count: totalViews },
    { data: categoryCounts },
  ] = await Promise.all([
    supabase.from('stories').select('*', { count: 'exact', head: true }),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('comments').select('*', { count: 'exact', head: true }),
    supabase.from('comments').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('articles').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('story_categories').select('id, name, stories(count)').limit(10),
  ])

  // Fetch monthly stories separately for type safety
  const { data: rawMonthly } = await supabase
    .from('stories')
    .select('submitted_at')
    .gte('submitted_at', new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString())
    .order('submitted_at')
  const monthlyStories = (rawMonthly ?? []) as Array<{ submitted_at: string }>

  // Build monthly breakdown
  const monthMap: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`
    monthMap[key] = 0
  }
  for (const story of monthlyStories ?? []) {
    const d = new Date(story.submitted_at)
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`
    if (key in monthMap) monthMap[key]!++
  }

  return {
    totalStories: totalStories ?? 0,
    publishedStories: publishedStories ?? 0,
    pendingStories: pendingStories ?? 0,
    totalComments: totalComments ?? 0,
    approvedComments: approvedComments ?? 0,
    totalArticles: totalArticles ?? 0,
    totalViews: totalViews ?? 0,
    categoryCounts: categoryCounts ?? [],
    monthlyStories: monthMap,
  }
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics()

  const statCards = [
    { label: 'Total Stories', value: analytics.totalStories, icon: BookOpen, color: '#FFB6D6', bg: '#FFE9F1' },
    { label: 'Published', value: analytics.publishedStories, icon: TrendingUp, color: '#C6F4E9', bg: '#E9FBF5' },
    { label: 'Pending Review', value: analytics.pendingStories, icon: BookOpen, color: '#FFF3B0', bg: '#FFFDE6' },
    { label: 'Total Comments', value: analytics.totalComments, icon: MessageCircle, color: '#E8B4F0', bg: '#F3EDFF' },
    { label: 'Published Articles', value: analytics.totalArticles, icon: FileText, color: '#BDE1FF', bg: '#E6F3FF' },
    { label: 'Page Views', value: analytics.totalViews, icon: Eye, color: '#FFB6D6', bg: '#FFE9F1' },
  ]

  const maxMonthlyCount = Math.max(...Object.values(analytics.monthlyStories), 1)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black text-[#3A3A3A]">Analytics</h1>
        <p className="text-sm text-[#3A3A3A]/60 mt-1">Platform performance overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: card.bg }}>
                  <Icon className="h-5 w-5" style={{ color: card.color === '#FFF3B0' ? '#d97706' : card.color }} aria-hidden="true" />
                </div>
              </div>
              <div className="text-3xl font-black text-[#3A3A3A]">{formatNumber(card.value)}</div>
              <div className="text-sm text-[#3A3A3A]/55 mt-1">{card.label}</div>
            </div>
          )
        })}
      </div>

      {/* Monthly submissions chart */}
      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <BarChart3 className="h-5 w-5 text-[#3A3A3A]/40" aria-hidden="true" />
          <h2 className="font-bold text-[#3A3A3A]">Story Submissions — Last 6 Months</h2>
        </div>
        <div className="flex items-end gap-3 h-40" role="img" aria-label="Bar chart showing monthly story submissions">
          {Object.entries(analytics.monthlyStories).map(([key, count]) => {
            const [year, month] = key.split('-').map(Number)
            const heightPct = maxMonthlyCount > 0 ? (count / maxMonthlyCount) * 100 : 0
            return (
              <div key={key} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-bold text-[#3A3A3A]">{count}</span>
                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${Math.max(heightPct, 4)}%`,
                    background: 'linear-gradient(180deg, #FFB6D6, #E8B4F0)',
                    minHeight: '4px',
                  }}
                  aria-label={`${getMonthName(month!)}: ${count} submissions`}
                />
                <span className="text-[10px] text-[#3A3A3A]/50">
                  {getMonthName(month!).slice(0, 3)}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm">
        <h2 className="font-bold text-[#3A3A3A] mb-4">Stories by Category</h2>
        <div className="space-y-3">
          {analytics.categoryCounts.map((cat: { id: string; name: string; stories: { count: number }[] }) => {
            const count = cat.stories?.[0]?.count ?? 0
            const maxCount = Math.max(
              ...analytics.categoryCounts.map((c: { stories: { count: number }[] }) => c.stories?.[0]?.count ?? 0),
              1
            )
            const pct = (count / maxCount) * 100
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <div className="w-32 text-sm text-[#3A3A3A]/70 shrink-0 truncate">{cat.name}</div>
                <div className="flex-1 bg-[#FFE9F1] rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#FFB6D6] to-[#E8B4F0]"
                    style={{ width: `${pct}%` }}
                    aria-label={`${count} stories`}
                  />
                </div>
                <span className="text-sm font-bold text-[#3A3A3A] w-8 text-right">{count}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
