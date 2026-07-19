import React from 'react'
import Link from 'next/link'
import { Trophy, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { getInitials, getMonthName } from '@/lib/utils'
import type { ChangemakerWinner } from '@/types'

async function getCurrentChangemaker(): Promise<ChangemakerWinner | null> {
  const supabase = await createClient()
  const now = new Date()
  const { data } = await supabase
    .from('changemaker_winners')
    .select('*')
    .eq('is_active', true)
    .eq('month', now.getMonth() + 1)
    .eq('year', now.getFullYear())
    .maybeSingle()

  // Fallback: get the most recent winner
  if (!data) {
    const { data: latest } = await supabase
      .from('changemaker_winners')
      .select('*')
      .eq('is_active', true)
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(1)
      .maybeSingle()
    return latest
  }

  return data
}

export async function ChangemakerPreview() {
  const winner = await getCurrentChangemaker()

  if (!winner) return null

  const initials = getInitials(winner.name)

  return (
    <section
      aria-labelledby="changemaker-heading"
      className="bg-white py-20 lg:py-28 overflow-hidden relative"
    >
      {/* Top Wave Divider */}
      <div className="absolute top-[-1px] left-0 w-full overflow-hidden leading-[0]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20 md:h-28 lg:h-36">
          <path 
            d="M0,60 C300,0 300,120 600,60 C900,0 900,120 1200,60 L1200,0 L0,0 Z" 
            fill="#F3EDFF"
          />
        </svg>
      </div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF3B0] px-4 py-2 text-sm font-semibold text-[#3A3A3A] mb-4">
              <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Confidence Changemaker of the Month
            </div>
            <h2
              id="changemaker-heading"
              className="text-3xl font-black text-[#3A3A3A] sm:text-4xl"
            >
              {getMonthName(winner.month)} {winner.year}
            </h2>
          </div>

          <div
            className="rounded-3xl p-8 sm:p-12 text-center"
            style={{
              background:
                'linear-gradient(135deg, #FFF3B0 0%, #FFE9F1 50%, #F3EDFF 100%)',
            }}
          >
            {/* Avatar */}
            <div className="mx-auto mb-6 relative w-fit">
              <div
                className="h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden shadow-lg border-4 border-white"
                aria-hidden="true"
              >
                {winner.photo_url ? (
                  <img
                    src={winner.photo_url}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#FFB6D6] to-[#E8B4F0] text-white text-3xl font-black">
                    {initials}
                  </div>
                )}
              </div>
              <div
                className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 shadow-md"
                aria-hidden="true"
              >
                <Trophy className="h-4 w-4 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-black text-[#3A3A3A]">{winner.name}</h3>
            <p className="text-sm text-[#3A3A3A]/60 mt-1">{winner.school}</p>

            {winner.nomination_count > 0 && (
              <p className="mt-3 text-sm font-semibold text-[#E8B4F0]">
                Nominated by {winner.nomination_count} person{winner.nomination_count !== 1 ? 's' : ''}
              </p>
            )}

            <blockquote className="mt-5 max-w-lg mx-auto">
              <p className="text-[#3A3A3A]/70 leading-relaxed italic">
                &ldquo;{winner.reason}&rdquo;
              </p>
            </blockquote>

            {winner.inspirational_message && (
              <div className="mt-6 rounded-2xl bg-white/60 px-6 py-4 max-w-md mx-auto">
                <p className="text-sm font-semibold text-[#E8B4F0] mb-1">
                  {winner.name} says:
                </p>
                <p className="text-sm text-[#3A3A3A]/70 italic">
                  &ldquo;{winner.inspirational_message}&rdquo;
                </p>
              </div>
            )}

            <div className="mt-8">
              <Button asChild variant="default">
                <Link href="/changemaker">
                  See Full Profile
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
