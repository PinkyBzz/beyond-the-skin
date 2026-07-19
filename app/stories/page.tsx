import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { StoriesGrid } from '@/components/features/stories-grid'
import type { StoryCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Behind Every Smile',
  description:
    'Real stories from real people. Every story is curated and reviewed before publishing.',
}

async function getCategories(): Promise<StoryCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('story_categories').select('*').order('name')
  return data ?? []
}

export default async function StoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-[#FFF8E6] pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-[#3A3A3A] sm:text-4xl lg:text-5xl">
            Behind Every{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #E8B4F0, #FFB6D6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Smile
            </span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base text-[#3A3A3A]/70">
            Everyone who has submitted a story here was brave enough to be honest. These
            words are real, curated, and published with love.
          </p>
        </div>

        <StoriesGrid categories={categories} />
      </div>
    </div>
  )
}
