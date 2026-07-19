'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, SlidersHorizontal, Clock, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate, estimateReadingTime } from '@/lib/utils'
import type { StoryCategory, StoryWithCategory, PaginatedResult, SortOrder } from '@/types'

interface StoriesGridProps {
  categories: StoryCategory[]
}

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'popular', label: 'Most Read' },
]

export function StoriesGrid({ categories }: StoriesGridProps) {
  const [stories, setStories] = useState<StoryWithCategory[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sort, setSort] = useState<SortOrder>('newest')
  const [loading, setLoading] = useState(true)

  const fetchStories = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: '9',
      sort,
    })
    if (search) params.set('search', search)
    if (selectedCategory !== 'all') params.set('category', selectedCategory)

    const res = await fetch(`/api/stories?${params}`)
    const data: PaginatedResult<StoryWithCategory> & { success: boolean } = await res.json()

    if (data.success) {
      setStories(data.data)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    }
    setLoading(false)
  }, [page, search, selectedCategory, sort])

  useEffect(() => {
    fetchStories()
  }, [fetchStories])

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [search, selectedCategory, sort])

  return (
    <div>
      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3A3A3A]/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories…"
            aria-label="Search stories"
            className="w-full rounded-2xl border border-[#FFB6D6]/40 bg-white py-3 pl-11 pr-4 text-sm text-[#3A3A3A] shadow-sm focus:border-[#E8B4F0] focus:outline-none focus:ring-2 focus:ring-[#E8B4F0]/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-[#3A3A3A]/40" aria-hidden="true" />
            <div className="flex rounded-xl border border-[#FFB6D6]/30 overflow-hidden">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSort(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    sort === opt.value
                      ? 'bg-[#FFB6D6] text-[#3A3A3A]'
                      : 'bg-white text-[#3A3A3A]/60 hover:bg-[#FFE9F1]'
                  }`}
                  aria-pressed={sort === opt.value}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-[#FFB6D6] text-[#3A3A3A]'
                  : 'bg-white border border-[#FFB6D6]/30 text-[#3A3A3A]/60 hover:bg-[#FFE9F1]'
              }`}
              aria-pressed={selectedCategory === 'all'}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  selectedCategory === cat.slug
                    ? 'text-[#3A3A3A] shadow-sm'
                    : 'bg-white border border-[#FFB6D6]/30 text-[#3A3A3A]/60 hover:bg-[#FFE9F1]'
                }`}
                style={
                  selectedCategory === cat.slug
                    ? { backgroundColor: cat.color + '60' }
                    : {}
                }
                aria-pressed={selectedCategory === cat.slug}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {total > 0 && (
          <p className="text-xs text-[#3A3A3A]/50">
            {total} {total === 1 ? 'story' : 'stories'} found
          </p>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-white overflow-hidden border border-[#FFB6D6]/15">
              <Skeleton className="h-40 rounded-none" />
              <div className="p-5 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-4xl mb-4">📖</div>
          <h3 className="font-bold text-[#3A3A3A]">No stories found</h3>
          <p className="text-sm text-[#3A3A3A]/50 mt-2">
            {search ? `No stories matching "${search}"` : 'No stories in this category yet.'}
          </p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {stories.map((story, i) => (
            <motion.article
              key={story.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl bg-white border border-[#FFB6D6]/15 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 overflow-hidden"
            >
              {/* Only show cover if image exists */}
              {story.cover_image_url && (
                <div className="h-40 w-full overflow-hidden" aria-hidden="true">
                  <img
                    src={story.cover_image_url}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Colored top bar when no image */}
              {!story.cover_image_url && (
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: story.story_categories.color }}
                  aria-hidden="true"
                />
              )}

              <div className="p-5">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge
                    style={{
                      backgroundColor: story.story_categories.color + '40',
                      color: '#3A3A3A',
                    }}
                  >
                    {story.story_categories.name}
                  </Badge>
                  {story.is_spotlight && <Badge variant="spotlight">✨ Spotlight</Badge>}
                </div>

                <h3 className="font-bold text-[#3A3A3A] line-clamp-2 group-hover:text-[#E8B4F0] transition-colors">
                  <Link href={`/stories/${story.id}`} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB6D6] rounded">
                    {story.title}
                  </Link>
                </h3>

                <p className="mt-2 text-sm text-[#3A3A3A]/60 line-clamp-2">
                  {story.content.slice(0, 100)}...
                </p>

                <div className="mt-4 flex items-center justify-between text-xs text-[#3A3A3A]/40">
                  <time dateTime={story.published_at ?? story.submitted_at}>
                    {formatDate(story.published_at ?? story.submitted_at)}
                  </time>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" aria-hidden="true" />
                      {estimateReadingTime(story.content)} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" aria-hidden="true" />
                      {story.view_count}
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2" aria-label="Pagination">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .map((p, idx, arr) => (
              <React.Fragment key={p}>
                {idx > 0 && arr[idx - 1] !== undefined && p - (arr[idx - 1] as number) > 1 && (
                  <span className="px-1 text-[#3A3A3A]/30 text-sm">…</span>
                )}
                <Button
                  variant={page === p ? 'default' : 'ghost'}
                  size="icon-sm"
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={page === p ? 'page' : undefined}
                >
                  {p}
                </Button>
              </React.Fragment>
            ))}

          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}
    </div>
  )
}
