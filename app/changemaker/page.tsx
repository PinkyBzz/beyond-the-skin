import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Trophy, Star, Heart, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getInitials, getMonthName } from '@/lib/utils'
import type { ChangemakerWinner } from '@/types'

export const metadata: Metadata = {
  title: 'Confidence Changemaker',
  description:
    'Every month, the girl nominated most by her peers for boosting confidence is celebrated here.',
}

async function getWinners(): Promise<ChangemakerWinner[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('changemaker_winners')
    .select('*')
    .eq('is_active', true)
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .limit(12)
  return data ?? []
}

async function getStats() {
  const supabase = await createClient()
  const { count: nominations } = await supabase
    .from('changemaker_nominations')
    .select('*', { count: 'exact', head: true })

  const { count: winners } = await supabase
    .from('changemaker_winners')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  return { nominations: nominations ?? 0, winners: winners ?? 0 }
}

export default async function ChangemakerPage() {
  const [winners, stats] = await Promise.all([getWinners(), getStats()])
  const currentWinner = winners[0]

  return (
    <div className="min-h-screen bg-[#FFF8E6] pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF3B0] px-4 py-2 text-sm font-semibold text-[#3A3A3A] mb-5">
            <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
            Confidence Changemaker
          </div>
          <h1 className="text-3xl font-black text-[#3A3A3A] sm:text-4xl lg:text-5xl">
            Real Girls.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #FFF3B0, #FFB6D6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Real Impact.
            </span>
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-base text-[#3A3A3A]/70">
            Every story submission nominates someone who made a girl feel more confident.
            The most nominated person each month earns this recognition.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {[
            { value: stats.nominations, label: 'Total Nominations', icon: Star, color: '#FFF3B0' },
            { value: stats.winners, label: 'Changemakers Honored', icon: Trophy, color: '#FFB6D6' },
            { value: '∞', label: 'Confidence Spread', icon: Heart, color: '#E8B4F0' },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <div
                key={stat.label}
                className="rounded-2xl p-4 sm:p-6 text-center"
                style={{ backgroundColor: stat.color + '40' }}
              >
                <Icon className="h-6 w-6 mx-auto mb-2" style={{ color: stat.color === '#FFF3B0' ? '#d97706' : '#3A3A3A' }} aria-hidden="true" />
                <div className="text-2xl font-black text-[#3A3A3A] sm:text-3xl">
                  {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                </div>
                <div className="text-xs text-[#3A3A3A]/60 mt-1">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Current winner spotlight */}
        {currentWinner && (
          <div
            className="rounded-3xl p-8 sm:p-12 mb-12 text-center"
            style={{ background: 'linear-gradient(135deg, #FFF3B0 0%, #FFE9F1 50%, #F3EDFF 100%)' }}
          >
            <Badge variant="spotlight" className="mb-6 text-sm px-4 py-1.5">
              <Trophy className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
              {getMonthName(currentWinner.month)} {currentWinner.year} Changemaker
            </Badge>

            {/* Photo */}
            <div className="relative mx-auto w-fit mb-6">
              <div className="h-28 w-28 sm:h-36 sm:w-36 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto">
                {currentWinner.photo_url ? (
                  <img src={currentWinner.photo_url} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#FFB6D6] to-[#E8B4F0] text-white text-4xl font-black">
                    {getInitials(currentWinner.name)}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 shadow-md">
                <Trophy className="h-5 w-5 text-white" aria-hidden="true" />
              </div>
            </div>

            <h2 className="text-2xl font-black text-[#3A3A3A] sm:text-3xl">{currentWinner.name}</h2>
            <p className="text-sm text-[#3A3A3A]/60 mt-1">{currentWinner.school}</p>
            <p className="mt-2 text-sm font-semibold text-[#E8B4F0]">
              Nominated by {currentWinner.nomination_count} girl{currentWinner.nomination_count !== 1 ? 's' : ''}
            </p>

            {/* Reason */}
            <div className="mt-6 max-w-lg mx-auto">
              <p className="text-sm font-bold text-[#3A3A3A] mb-2">Why she was nominated:</p>
              <blockquote className="text-[#3A3A3A]/70 leading-relaxed italic">
                &ldquo;{currentWinner.reason}&rdquo;
              </blockquote>
            </div>

            {/* Impact */}
            {currentWinner.impact && (
              <div className="mt-5 max-w-lg mx-auto rounded-2xl bg-white/60 p-4">
                <p className="text-sm font-bold text-[#3A3A3A] mb-1">Her Impact</p>
                <p className="text-sm text-[#3A3A3A]/70">{currentWinner.impact}</p>
              </div>
            )}

            {/* Biography */}
            {currentWinner.biography && (
              <div className="mt-5 max-w-lg mx-auto">
                <p className="text-sm text-[#3A3A3A]/65 leading-relaxed">{currentWinner.biography}</p>
              </div>
            )}

            {/* Inspirational message */}
            {currentWinner.inspirational_message && (
              <div className="mt-6 max-w-lg mx-auto rounded-2xl bg-white/80 px-6 py-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-[#E8B4F0] mb-2">
                  {currentWinner.name} says:
                </p>
                <p className="text-base font-semibold italic text-[#3A3A3A]">
                  &ldquo;{currentWinner.inspirational_message}&rdquo;
                </p>
              </div>
            )}
          </div>
        )}

        {/* Past winners */}
        {winners.length > 1 && (
          <section aria-labelledby="past-winners-heading">
            <div className="flex items-center gap-2 mb-6">
              <Users className="h-5 w-5 text-[#3A3A3A]/40" aria-hidden="true" />
              <h2 id="past-winners-heading" className="text-xl font-black text-[#3A3A3A]">
                Previous Changemakers
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {winners.slice(1).map((winner) => (
                <div
                  key={winner.id}
                  className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-5 shadow-sm hover:shadow-md transition-all"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[#FFB6D6]/30 shrink-0">
                      {winner.photo_url ? (
                        <img src={winner.photo_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#FFB6D6] to-[#E8B4F0] text-white font-bold text-sm">
                          {getInitials(winner.name)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-bold text-[#3A3A3A]">{winner.name}</p>
                      <p className="text-xs text-[#3A3A3A]/50">{winner.school}</p>
                    </div>
                  </div>
                  <Badge className="bg-[#FFF3B0] text-[#3A3A3A] text-xs">
                    {getMonthName(winner.month)} {winner.year}
                  </Badge>
                  <p className="mt-3 text-xs text-[#3A3A3A]/60 line-clamp-2 italic">
                    &ldquo;{winner.reason}&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-[#E8B4F0] font-semibold">
                    {winner.nomination_count} nominations
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {winners.length === 0 && (
          <div className="text-center py-16">
            <Trophy className="h-12 w-12 mx-auto text-[#FFB6D6]/40 mb-3" aria-hidden="true" />
            <h3 className="font-bold text-[#3A3A3A]">Coming Soon</h3>
            <p className="text-sm text-[#3A3A3A]/50 mt-1">
              The first Changemaker will be announced soon. Share your story to nominate someone!
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-gradient-to-br from-[#FFE9F1] to-[#F3EDFF] p-6 sm:p-8 text-center">
          <h3 className="text-lg font-black text-[#3A3A3A]">Know a Confidence Changemaker?</h3>
          <p className="mt-2 text-sm text-[#3A3A3A]/70">
            When you share your story, you get to nominate the person who made you feel most
            confident. Your nomination could make someone&apos;s month.
          </p>
          <a
            href="/share"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FFB6D6] px-6 py-2.5 text-sm font-semibold text-[#3A3A3A] hover:bg-[#f9a0c8] transition-colors"
          >
            <Heart className="h-4 w-4" fill="currentColor" aria-hidden="true" />
            Share Your Story & Nominate
          </a>
        </div>
      </div>
    </div>
  )
}
