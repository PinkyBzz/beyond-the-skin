'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, BookOpen, FileText, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { SearchResult } from '@/types'

export function SearchResults() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([])
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setResults(data.success ? data.data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const q = searchParams.get('q') ?? ''
    setQuery(q)
    search(q)
  }, [searchParams, search])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
    }
  }

  const stories = results.filter((r) => r.type === 'story')
  const articles = results.filter((r) => r.type === 'article')

  return (
    <div>
      {/* Search input */}
      <form onSubmit={handleSearch} role="search">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#3A3A3A]/40"
            aria-hidden="true"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stories, articles…"
            aria-label="Search"
            className="w-full rounded-2xl border border-[#FFB6D6]/40 bg-white py-4 pl-12 pr-4 text-sm text-[#3A3A3A] shadow-sm focus:border-[#E8B4F0] focus:outline-none focus:ring-2 focus:ring-[#E8B4F0]/30"
          />
          {loading && (
            <Loader2
              className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3A3A3A]/40 animate-spin"
              aria-hidden="true"
            />
          )}
        </div>
      </form>

      {/* Results */}
      {query && !loading && (
        <div className="mt-8 space-y-8">
          <p className="text-sm text-[#3A3A3A]/50">
            {results.length === 0
              ? `No results for "${query}"`
              : `${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`}
          </p>

          {/* Stories */}
          {stories.length > 0 && (
            <section aria-labelledby="story-results-heading">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-4 w-4 text-[#FFB6D6]" aria-hidden="true" />
                <h2 id="story-results-heading" className="font-bold text-[#3A3A3A]">
                  Stories ({stories.length})
                </h2>
              </div>
              <div className="space-y-3">
                {stories.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    className="flex gap-4 rounded-2xl bg-white border border-[#FFB6D6]/15 p-4 hover:shadow-sm transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB6D6]"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#FFE9F1] flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-[#FFB6D6]" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#3A3A3A] group-hover:text-[#E8B4F0] transition-colors line-clamp-1">
                        {result.title}
                      </h3>
                      <p className="text-xs text-[#3A3A3A]/55 mt-0.5 line-clamp-1">
                        {result.excerpt}
                      </p>
                      <Badge className="mt-2 bg-[#FFE9F1] text-[#3A3A3A] text-[10px]">
                        {result.category}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Articles */}
          {articles.length > 0 && (
            <section aria-labelledby="article-results-heading">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-[#E8B4F0]" aria-hidden="true" />
                <h2 id="article-results-heading" className="font-bold text-[#3A3A3A]">
                  Articles ({articles.length})
                </h2>
              </div>
              <div className="space-y-3">
                {articles.map((result) => (
                  <Link
                    key={result.id}
                    href={result.url}
                    className="flex gap-4 rounded-2xl bg-white border border-[#FFB6D6]/15 p-4 hover:shadow-sm transition-all group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFB6D6]"
                  >
                    <div className="h-10 w-10 shrink-0 rounded-xl bg-[#F3EDFF] flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#E8B4F0]" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[#3A3A3A] group-hover:text-[#E8B4F0] transition-colors line-clamp-1">
                        {result.title}
                      </h3>
                      <p className="text-xs text-[#3A3A3A]/55 mt-0.5 line-clamp-1">
                        {result.excerpt}
                      </p>
                      <Badge className="mt-2 bg-[#F3EDFF] text-[#3A3A3A] text-[10px]">
                        {result.category}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-10 w-10 mx-auto text-[#FFB6D6]/40 mb-3" aria-hidden="true" />
              <p className="font-medium text-[#3A3A3A]">Nothing found</p>
              <p className="text-sm text-[#3A3A3A]/50 mt-1">
                Try different keywords or browse our categories.
              </p>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="mt-12 text-center text-[#3A3A3A]/40">
          <Search className="h-10 w-10 mx-auto mb-3 opacity-50" aria-hidden="true" />
          <p className="text-sm">Start typing to search stories and articles.</p>
        </div>
      )}
    </div>
  )
}
