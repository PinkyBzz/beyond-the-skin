'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trophy, Loader2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { getMonthName, getInitials } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import type { ChangemakerNomination, ChangemakerWinner } from '@/types'

interface Props {
  nominations: ChangemakerNomination[]
  winners: ChangemakerWinner[]
  currentMonth: number
  currentYear: number
}

export function AdminChangemakerManager({ nominations, winners, currentMonth, currentYear }: Props) {
  const [loading, setLoading] = useState(false)
  const [winnerForm, setWinnerForm] = useState({
    name: '',
    school: '',
    biography: '',
    reason: '',
    impact: '',
    inspirational_message: '',
    nomination_count: nominations.length,
  })
  const router = useRouter()
  const { toast } = useToast()

  // Count nominations per person
  const nominationCounts = nominations.reduce<Record<string, { name: string; school: string; reason: string; count: number }>>(
    (acc, n) => {
      const key = n.nominee_name.toLowerCase().trim()
      if (!acc[key]) {
        acc[key] = { name: n.nominee_name, school: n.nominee_school, reason: n.reason, count: 0 }
      }
      acc[key]!.count += 1
      return acc
    },
    {}
  )
  const ranked = Object.values(nominationCounts).sort((a, b) => b.count - a.count)

  const handleSelectTopNominee = () => {
    const top = ranked[0]
    if (!top) return
    setWinnerForm((prev) => ({
      ...prev,
      name: top.name,
      school: top.school,
      reason: top.reason,
      nomination_count: top.count,
    }))
  }

  const handleSaveWinner = async () => {
    if (!winnerForm.name || !winnerForm.school || !winnerForm.reason) {
      toast({ variant: 'error', title: 'Missing fields', description: 'Name, school, and reason are required.' })
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/api/admin/changemaker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...winnerForm, month: currentMonth, year: currentYear }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error)
      toast({ variant: 'success', title: 'Winner saved!', description: 'Changemaker of the month has been set.' })
      router.refresh()
    } catch {
      toast({ variant: 'error', title: 'Error', description: 'Failed to save winner.' })
    } finally {
      setLoading(false)
    }
  }

  const currentWinner = winners.find((w) => w.month === currentMonth && w.year === currentYear)

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Nominations leaderboard */}
      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-[#3A3A3A]/40" aria-hidden="true" />
            <h2 className="font-bold text-[#3A3A3A]">
              {getMonthName(currentMonth)} {currentYear} Nominations
            </h2>
          </div>
          <Badge className="bg-[#FFF3B0] text-[#3A3A3A]">{nominations.length} total</Badge>
        </div>

        {ranked.length === 0 ? (
          <div className="text-center py-8 text-[#3A3A3A]/40">
            <Trophy className="h-8 w-8 mx-auto mb-2 opacity-30" aria-hidden="true" />
            <p className="text-sm">No nominations yet this month.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {ranked.map((nominee, i) => (
              <button
                key={nominee.name}
                onClick={() => setWinnerForm((prev) => ({ ...prev, name: nominee.name, school: nominee.school, reason: nominee.reason, nomination_count: nominee.count }))}
                className="w-full flex items-center gap-3 rounded-xl p-3 hover:bg-[#FFF8E6] transition-colors text-left"
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-gray-400' : 'bg-orange-300'}`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-[#3A3A3A]">{nominee.name}</p>
                  <p className="text-xs text-[#3A3A3A]/50 truncate">{nominee.school}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-black text-[#E8B4F0]">{nominee.count}</p>
                  <p className="text-[10px] text-[#3A3A3A]/40">nominations</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {ranked.length > 0 && (
          <Button variant="soft" size="sm" className="mt-4 w-full" onClick={handleSelectTopNominee}>
            Auto-fill Top Nominee
          </Button>
        )}
      </div>

      {/* Set winner form */}
      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-400" aria-hidden="true" />
          <h2 className="font-bold text-[#3A3A3A]">
            {currentWinner ? 'Current Winner' : `Set ${getMonthName(currentMonth)} Winner`}
          </h2>
        </div>

        {currentWinner ? (
          <div className="text-center py-4 space-y-2">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#FFB6D6] to-[#E8B4F0] flex items-center justify-center text-white text-xl font-black mx-auto">
              {getInitials(currentWinner.name)}
            </div>
            <p className="font-black text-lg text-[#3A3A3A]">{currentWinner.name}</p>
            <p className="text-sm text-[#3A3A3A]/60">{currentWinner.school}</p>
            <Badge className="bg-amber-100 text-amber-700">{currentWinner.nomination_count} nominations</Badge>
          </div>
        ) : (
          <>
            <Input label="Name" required value={winnerForm.name} onChange={(e) => setWinnerForm((p) => ({ ...p, name: e.target.value }))} placeholder="Winner's full name" />
            <Input label="School" required value={winnerForm.school} onChange={(e) => setWinnerForm((p) => ({ ...p, school: e.target.value }))} placeholder="Winner's school" />
            <Textarea label="Why nominated" required rows={2} value={winnerForm.reason} onChange={(e) => setWinnerForm((p) => ({ ...p, reason: e.target.value }))} placeholder="Why were they nominated?" />
            <Textarea label="Impact" rows={2} value={winnerForm.impact} onChange={(e) => setWinnerForm((p) => ({ ...p, impact: e.target.value }))} placeholder="What impact did they have?" />
            <Textarea label="Biography" rows={2} value={winnerForm.biography} onChange={(e) => setWinnerForm((p) => ({ ...p, biography: e.target.value }))} placeholder="Brief biography" />
            <Input label="Inspirational Message" value={winnerForm.inspirational_message} onChange={(e) => setWinnerForm((p) => ({ ...p, inspirational_message: e.target.value }))} placeholder="A message from the winner (optional)" />
            <Button onClick={handleSaveWinner} disabled={loading} variant="default" className="w-full gap-2">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trophy className="h-4 w-4" />}
              {loading ? 'Saving…' : 'Save as Winner'}
            </Button>
          </>
        )}
      </div>

      {/* Past winners */}
      {winners.length > 0 && (
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm">
          <h2 className="font-bold text-[#3A3A3A] mb-4">Past Winners</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {winners.map((w) => (
              <div key={w.id} className="rounded-xl bg-[#FFF8E6] p-4 text-center">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#FFB6D6] to-[#E8B4F0] flex items-center justify-center text-white font-bold text-sm mx-auto mb-2">
                  {getInitials(w.name)}
                </div>
                <p className="font-bold text-sm text-[#3A3A3A]">{w.name}</p>
                <p className="text-[10px] text-[#3A3A3A]/50 mt-0.5">{getMonthName(w.month)} {w.year}</p>
                <p className="text-xs text-[#E8B4F0] font-semibold mt-1">{w.nomination_count} nominations</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
