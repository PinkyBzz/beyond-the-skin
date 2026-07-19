import type { Metadata } from 'next'
import { SearchResults } from '@/components/features/search-results'

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search stories, articles, and categories.',
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#FFF8E6] pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-[#3A3A3A] sm:text-4xl">
            Search
          </h1>
          <p className="mt-3 text-sm text-[#3A3A3A]/60">
            Find stories, articles, and topics that resonate with you.
          </p>
        </div>
        <SearchResults />
      </div>
    </div>
  )
}
