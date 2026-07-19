'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, Globe, Trash2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import type { Story } from '@/types'

interface AdminStoryActionsProps {
  story: Story
}

export function AdminStoryActions({ story }: AdminStoryActionsProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [rejectDialog, setRejectDialog] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const router = useRouter()
  const { toast } = useToast()

  const handleAction = async (action: 'approve' | 'reject' | 'publish' | 'delete') => {
    setLoading(action)
    try {
      const method = action === 'delete' ? 'DELETE' : 'PATCH'
      const res = await fetch(`/api/admin/stories/${story.id}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: action !== 'delete' ? JSON.stringify({ action, rejection_reason: rejectionReason || undefined }) : undefined,
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error ?? 'Action failed')

      toast({ variant: 'success', title: 'Success', description: `Story ${action}d successfully.` })
      if (action === 'delete') {
        router.push('/admin/stories')
      } else {
        router.refresh()
      }
      setRejectDialog(false)
    } catch (err) {
      toast({ variant: 'error', title: 'Error', description: err instanceof Error ? err.message : 'Action failed.' })
    } finally {
      setLoading(null)
    }
  }

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {story.status === 'pending' && (
          <>
            <Button
              variant="soft"
              size="sm"
              onClick={() => handleAction('approve')}
              disabled={!!loading}
              className="gap-1.5 text-green-700 bg-green-100 hover:bg-green-200"
            >
              {loading === 'approve' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
              Approve & Publish
            </Button>
            <Button
              variant="soft"
              size="sm"
              onClick={() => setRejectDialog(true)}
              disabled={!!loading}
              className="gap-1.5 text-red-600 bg-red-50 hover:bg-red-100"
            >
              <X className="h-3.5 w-3.5" />
              Reject
            </Button>
          </>
        )}
        {story.status === 'approved' && (
          <Button
            variant="soft"
            size="sm"
            onClick={() => handleAction('publish')}
            disabled={!!loading}
            className="gap-1.5 text-blue-700 bg-blue-50 hover:bg-blue-100"
          >
            {loading === 'publish' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Globe className="h-3.5 w-3.5" />}
            Publish
          </Button>
        )}
        <Button
          variant="soft"
          size="sm"
          onClick={() => handleAction('delete')}
          disabled={!!loading}
          className="gap-1.5 text-red-500 bg-red-50 hover:bg-red-100"
        >
          {loading === 'delete' ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
          Delete
        </Button>
      </div>

      <Dialog open={rejectDialog} onOpenChange={setRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Story</DialogTitle>
          </DialogHeader>
          <Textarea
            label="Reason (optional)"
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={3}
            placeholder="Internal note about why this was rejected…"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRejectDialog(false)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => handleAction('reject')}
              disabled={!!loading}
            >
              {loading === 'reject' ? 'Rejecting…' : 'Reject Story'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
