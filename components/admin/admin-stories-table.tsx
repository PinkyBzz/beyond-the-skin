'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Check, X, Eye, Edit, Trash2, SlidersHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { getStatusConfig, formatDate } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import type { StoryWithCategory, StoryStatus } from '@/types'

interface AdminStoriesTableProps {
  stories: StoryWithCategory[]
}

type FilterStatus = 'all' | StoryStatus

export function AdminStoriesTable({ stories: initialStories }: AdminStoriesTableProps) {
  const [stories, setStories] = useState(initialStories)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    type: 'approve' | 'reject' | 'delete' | null
    storyId: string
    storyTitle: string
  }>({ open: false, type: null, storyId: '', storyTitle: '' })
  const [rejectionReason, setRejectionReason] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const filtered = stories.filter((s) => {
    const matchSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.full_name.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || s.status === filterStatus
    return matchSearch && matchStatus
  })

  const handleAction = async () => {
    if (!actionDialog.type || !actionDialog.storyId) return
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/stories/${actionDialog.storyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionDialog.type,
          rejection_reason: actionDialog.type === 'reject' ? rejectionReason : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error)

      if (actionDialog.type === 'delete') {
        setStories((prev) => prev.filter((s) => s.id !== actionDialog.storyId))
      } else {
        const newStatus: Record<string, StoryStatus> = {
          approve: 'approved',
          reject: 'rejected',
        }
        setStories((prev) =>
          prev.map((s) =>
            s.id === actionDialog.storyId
              ? { ...s, status: newStatus[actionDialog.type!] ?? s.status }
              : s
          )
        )
      }

      toast({ variant: 'success', title: 'Done', description: `Story ${actionDialog.type}d.` })
      setActionDialog({ open: false, type: null, storyId: '', storyTitle: '' })
      setRejectionReason('')
    } catch {
      toast({ variant: 'error', title: 'Error', description: 'Action failed. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const statusOptions: FilterStatus[] = ['all', 'pending', 'approved', 'rejected', 'published']

  return (
    <>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center mb-4">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3A3A3A]/40" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stories…"
            aria-label="Search stories"
            className="w-full rounded-xl border border-[#FFB6D6]/40 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4F0]/30"
          />
        </div>
        <div className="flex items-center gap-1">
          <SlidersHorizontal className="h-4 w-4 text-[#3A3A3A]/40" aria-hidden="true" />
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterStatus === s
                  ? 'bg-[#FFB6D6] text-[#3A3A3A]'
                  : 'bg-white border border-[#FFB6D6]/30 text-[#3A3A3A]/60 hover:bg-[#FFE9F1]'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" role="table">
            <thead>
              <tr className="border-b border-[#FFB6D6]/15 bg-[#FFF8E6]/50">
                <th scope="col" className="px-4 py-3 text-left font-semibold text-[#3A3A3A]/60 text-xs">
                  Story
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-[#3A3A3A]/60 text-xs hidden sm:table-cell">
                  Category
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-[#3A3A3A]/60 text-xs hidden md:table-cell">
                  Submitted
                </th>
                <th scope="col" className="px-4 py-3 text-left font-semibold text-[#3A3A3A]/60 text-xs">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold text-[#3A3A3A]/60 text-xs">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#3A3A3A]/40">
                    No stories found.
                  </td>
                </tr>
              ) : (
                filtered.map((story) => {
                  const statusConf = getStatusConfig(story.status)
                  return (
                    <tr key={story.id} className="border-b border-[#FFB6D6]/10 hover:bg-[#FFF8E6]/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-[#3A3A3A] line-clamp-1">{story.title}</p>
                          <p className="text-xs text-[#3A3A3A]/50 mt-0.5">{story.full_name}, {story.age}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="text-xs text-[#3A3A3A]/60">{story.story_categories.name}</span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-xs text-[#3A3A3A]/50">{formatDate(story.submitted_at)}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusConf.bg} ${statusConf.color}`}>
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/stories/${story.id}`}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-[#3A3A3A]/50 hover:bg-[#FFE9F1] hover:text-[#3A3A3A] transition-colors"
                            aria-label={`View ${story.title}`}
                          >
                            <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          </Link>
                          {story.status === 'pending' && (
                            <>
                              <button
                                onClick={() => setActionDialog({ open: true, type: 'approve', storyId: story.id, storyTitle: story.title })}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                                aria-label={`Approve & publish ${story.title}`}
                                title="Approve & Publish"
                              >
                                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                              <button
                                onClick={() => setActionDialog({ open: true, type: 'reject', storyId: story.id, storyTitle: story.title })}
                                className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                aria-label={`Reject ${story.title}`}
                                title="Reject"
                              >
                                <X className="h-3.5 w-3.5" aria-hidden="true" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => setActionDialog({ open: true, type: 'delete', storyId: story.id, storyTitle: story.title })}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                            aria-label={`Delete ${story.title}`}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={actionDialog.open}
        onOpenChange={(open) => !loading && setActionDialog((p) => ({ ...p, open }))}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'approve' && 'Approve & Publish Story'}
              {actionDialog.type === 'reject' && 'Reject Story'}
              {actionDialog.type === 'delete' && 'Delete Story'}
            </DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <p className="text-sm text-[#3A3A3A]/70">
              Are you sure you want to{' '}
              <strong>{actionDialog.type}</strong> &ldquo;{actionDialog.storyTitle}&rdquo;?
            </p>
            {actionDialog.type === 'reject' && (
              <div className="mt-4">
                <Textarea
                  label="Reason for rejection (optional)"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={3}
                  placeholder="Let the team know why this story was rejected…"
                />
              </div>
            )}
            {actionDialog.type === 'delete' && (
              <p className="mt-2 text-xs text-red-500 font-medium">
                This action cannot be undone.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setActionDialog((p) => ({ ...p, open: false }))}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.type === 'delete' ? 'destructive' : 'default'}
              onClick={handleAction}
              disabled={loading}
            >
              {loading ? 'Processing…' : `Yes, ${actionDialog.type}`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
