import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { ArticleEditor } from '@/components/admin/article-editor'
import type { ArticleCategory } from '@/types'

export const metadata: Metadata = { title: 'New Article' }

async function getCategories(): Promise<ArticleCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase.from('article_categories').select('*').order('name')
  return data ?? []
}

export default async function NewArticlePage() {
  const categories = await getCategories()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#3A3A3A]">New Article</h1>
        <p className="text-sm text-[#3A3A3A]/60 mt-1">Write and publish a new article.</p>
      </div>
      <ArticleEditor categories={categories} />
    </div>
  )
}
