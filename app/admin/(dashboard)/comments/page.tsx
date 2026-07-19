import type { Metadata } from 'next'
import { getAdminClient } from '@/lib/supabase/admin'
import { AdminCommentsTable } from '@/components/admin/admin-comments-table'
import type { Comment } from '@/types'

export const metadata: Metadata = { title: 'Comments' }

async function getComments(): Promise<Comment[]> {
  const supabase = getAdminClient()
  const { data } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)
  return data ?? []
}

export default async function AdminCommentsPage() {
  const comments = await getComments()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#3A3A3A]">Comments</h1>
        <p className="text-sm text-[#3A3A3A]/60 mt-1">Moderate community messages.</p>
      </div>
      <AdminCommentsTable comments={comments} />
    </div>
  )
}
