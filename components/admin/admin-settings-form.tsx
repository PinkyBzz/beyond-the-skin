'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'

interface AdminSettingsFormProps {
  settings: Record<string, string>
}

export function AdminSettingsForm({ settings }: AdminSettingsFormProps) {
  const [form, setForm] = useState({
    site_name: settings['site_name'] ?? 'Beyond The Skin Project',
    site_tagline: settings['site_tagline'] ?? 'Every girl deserves to be seen beyond her skin.',
    contact_email: settings['contact_email'] ?? '',
    instagram_url: settings['instagram_url'] ?? '',
    submission_enabled: settings['submission_enabled'] ?? 'true',
    maintenance_message: settings['maintenance_message'] ?? '',
  })
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSave = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error)
      toast({ variant: 'success', title: 'Saved', description: 'Settings updated successfully.' })
      router.refresh()
    } catch {
      toast({ variant: 'error', title: 'Error', description: 'Failed to save settings.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-[#3A3A3A] text-sm uppercase tracking-wide">Site Information</h2>
        <Input
          label="Site Name"
          value={form.site_name}
          onChange={(e) => setForm((p) => ({ ...p, site_name: e.target.value }))}
        />
        <Input
          label="Tagline"
          value={form.site_tagline}
          onChange={(e) => setForm((p) => ({ ...p, site_tagline: e.target.value }))}
        />
        <Input
          label="Contact Email"
          type="email"
          value={form.contact_email}
          onChange={(e) => setForm((p) => ({ ...p, contact_email: e.target.value }))}
        />
        <Input
          label="Instagram URL"
          value={form.instagram_url}
          onChange={(e) => setForm((p) => ({ ...p, instagram_url: e.target.value }))}
        />
      </div>

      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm space-y-4">
        <h2 className="font-bold text-[#3A3A3A] text-sm uppercase tracking-wide">Submissions</h2>
        <div className="flex items-center gap-3">
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={form.submission_enabled === 'true'}
              onChange={(e) => setForm((p) => ({ ...p, submission_enabled: e.target.checked ? 'true' : 'false' }))}
            />
            <div className="h-6 w-11 rounded-full bg-gray-200 peer-checked:bg-[#FFB6D6] transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all peer-checked:after:translate-x-full" />
          </label>
          <span className="text-sm font-medium text-[#3A3A3A]">Story submissions enabled</span>
        </div>
        <Textarea
          label="Maintenance Message (shown when submissions disabled)"
          value={form.maintenance_message}
          onChange={(e) => setForm((p) => ({ ...p, maintenance_message: e.target.value }))}
          rows={2}
          placeholder="We are temporarily pausing story submissions. Check back soon!"
        />
      </div>

      <Button onClick={handleSave} disabled={loading} variant="default" className="gap-2">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        {loading ? 'Saving…' : 'Save Settings'}
      </Button>
    </div>
  )
}
