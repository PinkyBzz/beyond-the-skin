'use client'

import React, { useState } from 'react'
import { Check, X, Trash2, Loader2, Search } from 'lucide-react'
import { timeAgo } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import type { Comment, CommentStatus } from '@/types'

interface Props { comments: Comment[] }

export function AdminCommentsTable({ comments: initial }: Props) {
  const [comments, setComments] = useState(initial)
  const [loading, setLoading] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<CommentStatus | 'all'>('all')
  const { toast } = useToast()

  const filtered = comments.filter((c) => {
    const matchSearch = c.author_name.toLowerCase().includes(search.toLowerCase()) ||
      c.content.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || c.status === filter
    return matchSearch && matchFilter
  })

  const handleAction = async (id: string, action: 'approve' | 'reject' | 'delete') => {
    setLoading(`${id}-${action}`)
    try {
      const res = await fetch(`/api/admin/comments/${id}`, {
        method: action === 'delete' ? 'DELETE' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: action !== 'delete' ? JSON.stringify({ action }) : undefined,
      })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error(data.error)

      if (action === 'delete') {
        setComments((prev) => prev.filter((c) => c.id !== id))
      } else {
        setComments((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, status: action === 'approve' ? 'approved' : 'rejected' } : c
          )
        )
      }
      toast({ variant: 'success', title: 'Done', description: `Comment ${action}d.` })
    } catch {
      toast({ variant: 'error', title: 'Error', description: 'Action failed.' })
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#3A3A3A]/40" aria-hidden="true" />
          <input
            type="search" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search comments…" aria-label="Search comments"
            className="w-full rounded-xl border border-[#FFB6D6]/40 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8B4F0]/30"
          />
        </div>
        {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === s ? 'bg-[#FFB6D6] text-[#3A3A3A]' : 'bg-white border border-[#FFB6D6]/30 text-[#3A3A3A]/60 hover:bg-[#FFE9F1]'}`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 shadow-sm overflow-hidden">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-[#FFB6D6]/15 bg-[#FFF8E6]/50">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-[#3A3A3A]/60">Author</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-[#3A3A3A]/60">Message</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-[#3A3A3A]/60 hidden md:table-cell">Time</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-[#3A3A3A]/60">Status</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-[#3A3A3A]/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-[#3A3A3A]/40">No comments found.</td></tr>
            ) : filtered.map((comment) => (
              <tr key={comment.id} className="border-b border-[#FFB6D6]/10 hover:bg-[#FFF8E6]/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ background: 'linear-gradient(135deg, #FFB6D6, #E8B4F0)' }} aria-hidden="true">
                      {comment.author_name[0]?.toUpperCase()}
                    </div>
                    <span className="font-medium text-[#3A3A3A] text-xs">{comment.author_name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 max-w-xs">
                  <p className="text-xs text-[#3A3A3A]/70 line-clamp-2">{comment.content}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs text-[#3A3A3A]/50">{timeAgo(comment.created_at)}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    comment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    comment.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>{comment.status}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {comment.status === 'pending' && (
                      <>
                        <button onClick={() => handleAction(comment.id, 'approve')}
                          disabled={loading === `${comment.id}-approve`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                          aria-label="Approve comment">
                          {loading === `${comment.id}-approve` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" aria-hidden="true" />}
                        </button>
                        <button onClick={() => handleAction(comment.id, 'reject')}
                          disabled={loading === `${comment.id}-reject`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          aria-label="Reject comment">
                          {loading === `${comment.id}-reject` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" aria-hidden="true" />}
                        </button>
                      </>
                    )}
                    <button onClick={() => handleAction(comment.id, 'delete')}
                      disabled={loading === `${comment.id}-delete`}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition-colors"
                      aria-label="Delete comment">
                      {loading === `${comment.id}-delete` ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
