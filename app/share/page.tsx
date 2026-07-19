import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { StoryForm } from '@/components/features/story-form'
import { Shield, Lock, Heart } from 'lucide-react'
import type { StoryCategory } from '@/types'

export const metadata: Metadata = {
  title: 'Share Your Story',
  description:
    'Share your personal story in a safe, confidential space. Your story will be reviewed before publishing and your personal information stays private.',
}

async function getCategories(): Promise<StoryCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('story_categories')
    .select('*')
    .order('name')
  return data ?? []
}

const safetyPoints = [
  {
    icon: Shield,
    title: 'Stories are confidential',
    description: 'Your submission is private until reviewed and approved by our team.',
  },
  {
    icon: Lock,
    title: 'Personal info never displayed',
    description: 'Your name, age, school, and phone number are never shown publicly.',
  },
  {
    icon: Heart,
    title: 'Published only after review',
    description: 'Every story is carefully read by our team before it goes live.',
  },
]

export default async function ShareStoryPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-[#FFF8E6] pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFE9F1] px-4 py-2 text-sm font-semibold text-[#3A3A3A]/70 mb-5">
            <Heart className="h-3.5 w-3.5 text-[#FFB6D6]" fill="#FFB6D6" aria-hidden="true" />
            Share Your Story
          </div>
          <h1 className="text-3xl font-black text-[#3A3A3A] sm:text-4xl">
            Your Voice{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #E8B4F0, #FFB6D6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Matters
            </span>
          </h1>
          <p className="mt-4 max-w-lg mx-auto text-base text-[#3A3A3A]/70 leading-relaxed">
            Every story shared here is a gift to someone else who might need to hear exactly
            what you have been through. You are not alone.
          </p>
        </div>

        {/* Safety notice */}
        <div className="mb-10 rounded-2xl bg-white border border-[#FFB6D6]/20 p-6 shadow-sm">
          <h2 className="text-sm font-bold text-[#3A3A3A] mb-4 uppercase tracking-wide">
            Before You Begin
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {safetyPoints.map((point) => {
              const Icon = point.icon
              return (
                <div key={point.title} className="flex gap-3">
                  <div className="shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FFE9F1]">
                      <Icon className="h-4 w-4 text-[#FFB6D6]" aria-hidden="true" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#3A3A3A]">{point.title}</p>
                    <p className="text-xs text-[#3A3A3A]/60 mt-0.5 leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Form */}
        <StoryForm categories={categories} />
      </div>
    </div>
  )
}
