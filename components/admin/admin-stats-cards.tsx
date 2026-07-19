import React from 'react'
import { BookOpen, FileText, MessageCircle, Eye, Clock } from 'lucide-react'
import type { DashboardStats } from '@/types'
import { formatNumber } from '@/lib/utils'

interface AdminStatsCardsProps {
  stats: Omit<DashboardStats, 'storiesThisMonth'>
}

const statCards = (stats: AdminStatsCardsProps['stats']) => [
  {
    label: 'Pending Stories',
    value: stats.pendingStories,
    icon: Clock,
    color: '#FFB6D6',
    bg: '#FFE9F1',
    urgent: stats.pendingStories > 0,
  },
  {
    label: 'Published Stories',
    value: stats.publishedStories,
    icon: BookOpen,
    color: '#C6F4E9',
    bg: '#E9FBF5',
    urgent: false,
  },
  {
    label: 'Articles',
    value: stats.totalArticles,
    icon: FileText,
    color: '#BDE1FF',
    bg: '#E6F3FF',
    urgent: false,
  },
  {
    label: 'Pending Comments',
    value: stats.pendingComments,
    icon: MessageCircle,
    color: '#E8B4F0',
    bg: '#F3EDFF',
    urgent: stats.pendingComments > 0,
  },
  {
    label: 'Page Views',
    value: stats.totalVisitors,
    icon: Eye,
    color: '#FFF3B0',
    bg: '#FFFDE6',
    urgent: false,
  },
]

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const cards = statCards(stats)

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <div
            key={card.label}
            className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-5 shadow-sm relative overflow-hidden"
          >
            {card.urgent && (
              <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-red-400 animate-pulse" aria-label="Needs attention" />
            )}
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl mb-3"
              style={{ backgroundColor: card.bg }}
            >
              <Icon className="h-5 w-5" style={{ color: card.color === '#FFF3B0' ? '#d97706' : card.color }} aria-hidden="true" />
            </div>
            <div className="text-2xl font-black text-[#3A3A3A]">
              {formatNumber(card.value)}
            </div>
            <div className="text-xs text-[#3A3A3A]/55 mt-0.5 font-medium">{card.label}</div>
          </div>
        )
      })}
    </div>
  )
}
