import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArticleEditor } from '@/components/admin/article-editor'
import type { Article, ArticleCategory } from '@/types'

export const metadata: Metadata = { title: 'Edit Article' }

interface Props { params: Promise<{ id: string }> }

async function getData(id: string) {
  const supabase = await createClient()
  const [{ data: article }, { data: categories }] = await Promise.all([
    supabase.from('articles').select('*').eq('id', id).maybeSingle(),
    supabase.from('article_categories').select('*').order('name'),
  ])
  return { article: article as Article | null, categories: (categories as ArticleCategory[]) ?? [] }
}

export default async function EditArticlePage({ params }: Props) {
  const { id } = await params
  const { article, categories } = await getData(id)
  if (!article) notFound()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-[#3A3A3A]">Edit Article</h1>
        <p className="text-sm text-[#3A3A3A]/60 mt-1">{article.title}</p>
      </div>
      <ArticleEditor categories={categories} article={article} />
    </div>
  )
}
