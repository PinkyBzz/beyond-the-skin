import React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { timeAgo } from '@/lib/utils'
import type { Comment } from '@/types'

async function getRecentComments(): Promise<Comment[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)
  return data ?? []
}

export async function AdminRecentComments() {
  const comments = await getRecentComments()

  return (
    <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-[#3A3A3A]">Recent Comments</h2>
        <Link
          href="/admin/comments"
          className="text-xs text-[#E8B4F0] hover:underline font-medium"
        >
          View all
        </Link>
      </div>

      {comments.length === 0 ? (
        <p className="text-sm text-[#3A3A3A]/40 py-4 text-center">No comments yet.</p>
      ) : (
        <ul className="space-y-3" role="list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <div className="flex items-start gap-3 rounded-xl p-3 hover:bg-[#FFF8E6] transition-colors">
                <div
                  className="h-7 w-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #FFB6D6, #E8B4F0)' }}
                  aria-hidden="true"
                >
                  {comment.author_name[0]?.toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-[#3A3A3A]">
                      {comment.author_name}
                    </span>
                    <span
                      className={`shrink-0 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        comment.status === 'pending'
                          ? 'bg-amber-100 text-amber-700'
                          : comment.status === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {comment.status}
                    </span>
                  </div>
                  <p className="text-xs text-[#3A3A3A]/60 mt-0.5 line-clamp-1">{comment.content}</p>
                  <p className="text-[10px] text-[#3A3A3A]/40 mt-0.5">{timeAgo(comment.created_at)}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
