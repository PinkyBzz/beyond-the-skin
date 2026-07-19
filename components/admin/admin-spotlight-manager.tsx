'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sparkles, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import type { SpotlightWithStory, StoryWithCategory } from '@/types'

interface Props {
  spotlights: SpotlightWithStory[]
  stories: StoryWithCategory[]
}

export function AdminSpotlightManager({ spotlights, stories }: Props) {
  const [selectedStoryId, setSelectedStoryId] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const activeSpotlight = spotlights.find((s) => s.is_active)

  const handleSetSpotlight = async () => {
    if (!selectedStoryId) return
    setLoading(true)
    try {
      const now = new Date()
      const weekStart = new Date(now)
      weekStart.setDate(now.getDate() - now.getDay())
      const weekEnd = new Date(weekStart)
      weekEnd.setDate(weekStart.getDate() + 6)

      const res = await fetch('/api/admin/spotlight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          story_id: selectedStoryId,
          week_start: weekStart.toISOString().split('T')[0],
          week_end: weekEnd.toISOString().split('T')[0],
          message: message || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error)

      toast({ variant: 'success', title: 'Spotlight set!', description: 'The weekly spotlight has been updated.' })
      setSelectedStoryId('')
      setMessage('')
      router.refresh()
    } catch {
      toast({ variant: 'error', title: 'Error', description: 'Failed to set spotlight.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Set spotlight */}
      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-[#FFF3B0]" fill="#FFF3B0" aria-hidden="true" />
          <h2 className="font-bold text-[#3A3A3A]">Set This Week&apos;s Spotlight</h2>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-medium text-[#3A3A3A]">Select Story</label>
          {stories.length === 0 ? (
            <div className="flex h-11 items-center rounded-xl border border-[#FFB6D6]/40 bg-[#FFF8E6] px-4 text-sm text-[#3A3A3A]/50">
              No approved or published stories yet.
            </div>
          ) : (
            <Select value={selectedStoryId} onValueChange={setSelectedStoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a story" />
              </SelectTrigger>
              <SelectContent>
                {stories.map((story) => (
                  <SelectItem key={story.id} value={story.id}>
                    <span className="flex items-center gap-2">
                      <span className={`inline-block h-2 w-2 rounded-full shrink-0 ${story.status === 'published' ? 'bg-green-400' : 'bg-amber-400'}`} />
                      {story.title}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Textarea
          label="Editor's Message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Add a personal note about why this story was chosen…"
        />

        <Button
          onClick={handleSetSpotlight}
          disabled={!selectedStoryId || loading}
          variant="default"
          className="w-full gap-2"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? 'Saving…' : 'Set as Spotlight'}
        </Button>
      </div>

      {/* Current spotlight */}
      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm">
        <h2 className="font-bold text-[#3A3A3A] mb-4">Current Spotlight</h2>
        {activeSpotlight && activeSpotlight.stories ? (
          <div className="space-y-3">
            <Badge variant="spotlight">
              <Sparkles className="h-3 w-3 mr-1" />
              Active
            </Badge>
            <h3 className="font-bold text-[#3A3A3A]">{activeSpotlight.stories.title}</h3>
            <p className="text-xs text-[#3A3A3A]/60">
              {formatDate(activeSpotlight.week_start)} — {formatDate(activeSpotlight.week_end)}
            </p>
            {activeSpotlight.message && (
              <p className="text-sm text-[#3A3A3A]/70 italic">&ldquo;{activeSpotlight.message}&rdquo;</p>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-[#3A3A3A]/40">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p className="text-sm">No active spotlight set.</p>
          </div>
        )}
      </div>

      {/* History */}
      {spotlights.length > 0 && (
        <div className="lg:col-span-2 rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm">
          <h2 className="font-bold text-[#3A3A3A] mb-4">Spotlight History</h2>
          <div className="space-y-2">
            {spotlights.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl p-3 bg-[#FFF8E6]/50">
                {s.is_active && <Check className="h-4 w-4 text-green-500 shrink-0" aria-label="Active" />}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3A3A3A] line-clamp-1">
                    {s.stories?.title ?? 'Story unavailable'}
                  </p>
                  <p className="text-xs text-[#3A3A3A]/50">
                    {formatDate(s.week_start)} — {formatDate(s.week_end)}
                  </p>
                </div>
                {s.is_active && <Badge variant="spotlight" className="text-xs">Active</Badge>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
