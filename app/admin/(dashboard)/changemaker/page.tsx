import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminChangemakerManager } from '@/components/admin/admin-changemaker-manager'
import type { ChangemakerNomination, ChangemakerWinner } from '@/types'

export const metadata: Metadata = { title: 'Changemaker' }

async function getData() {
  const supabase = await createClient()
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()

  const [{ data: nominations }, { data: winners }] = await Promise.all([
    supabase
      .from('changemaker_nominations')
      .select('*')
      .eq('month', month)
      .eq('year', year)
      .order('created_at', { ascending: false }),
    supabase
      .from('changemaker_winners')
      .select('*')
      .order('year', { ascending: false })
      .order('month', { ascending: false })
      .limit(12),
  ])

  return {
    nominations: nominations ?? [],
    winners: winners ?? [],
    currentMonth: month,
    currentYear: year,
  }
}

export default async function AdminChangemakerPage() {
  const { nominations, winners, currentMonth, currentYear } = await getData()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#3A3A3A]">Confidence Changemaker</h1>
        <p className="text-sm text-[#3A3A3A]/60 mt-1">Review nominations and select the monthly winner.</p>
      </div>
      <AdminChangemakerManager
        nominations={nominations}
        winners={winners}
        currentMonth={currentMonth}
        currentYear={currentYear}
      />
    </div>
  )
}
