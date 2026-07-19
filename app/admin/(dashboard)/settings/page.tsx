import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { AdminSettingsForm } from '@/components/admin/admin-settings-form'

export const metadata: Metadata = { title: 'Settings' }

async function getSettings() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('site_settings')
    .select('key, value')
  const map: Record<string, string> = {}
  const rows = (data ?? []) as Array<{ key: string; value: unknown }>
  for (const row of rows) {
    map[row.key] = typeof row.value === 'string' ? row.value : JSON.stringify(row.value)
  }
  return map
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-[#3A3A3A]">Settings</h1>
        <p className="text-sm text-[#3A3A3A]/60 mt-1">Configure site-wide settings.</p>
      </div>
      <AdminSettingsForm settings={settings} />
    </div>
  )
}
