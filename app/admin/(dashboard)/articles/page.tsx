import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate, getSectionLabel } from '@/lib/utils'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import type { ArticleWithCategory } from '@/types'

export const metadata: Metadata = { title: 'Articles' }

async function getArticles(): Promise<ArticleWithCategory[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('articles')
    .select('*, article_categories(*)')
    .order('created_at', { ascending: false })
    .limit(50)
  return (data as ArticleWithCategory[]) ?? []
}

export default async function AdminArticlesPage() {
  const articles = await getArticles()

  const sectionColors: Record<string, string> = {
    skin_talk: '#FFB6D6',
    girl_talk: '#E8B4F0',
    creators_corner: '#BDE1FF',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#3A3A3A]">Articles</h1>
          <p className="text-sm text-[#3A3A3A]/60 mt-1">Manage Beauty & Beyond content.</p>
        </div>
        <Button asChild variant="default">
          <Link href="/admin/articles/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New Article
          </Link>
        </Button>
      </div>

      <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 shadow-sm overflow-hidden">
        <table className="w-full text-sm" role="table">
          <thead>
            <tr className="border-b border-[#FFB6D6]/15 bg-[#FFF8E6]/50">
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-[#3A3A3A]/60">Title</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-[#3A3A3A]/60 hidden sm:table-cell">Section</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-[#3A3A3A]/60 hidden md:table-cell">Author</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-[#3A3A3A]/60">Status</th>
              <th scope="col" className="px-4 py-3 text-right text-xs font-semibold text-[#3A3A3A]/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[#3A3A3A]/40">
                  No articles yet. Create your first one!
                </td>
              </tr>
            ) : (
              articles.map((article) => {
                const color = sectionColors[article.article_categories.section] ?? '#FFB6D6'
                return (
                  <tr key={article.id} className="border-b border-[#FFB6D6]/10 hover:bg-[#FFF8E6]/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#3A3A3A] line-clamp-1">{article.title}</p>
                      <p className="text-xs text-[#3A3A3A]/50 mt-0.5">
                        {article.published_at ? formatDate(article.published_at) : 'Not published'}
                      </p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge style={{ backgroundColor: color + '40', color: '#3A3A3A', fontSize: '10px' }}>
                        {getSectionLabel(article.article_categories.section)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs text-[#3A3A3A]/60">{article.author_name}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/articles/${article.article_categories.slug}/${article.slug}`}
                          target="_blank"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#3A3A3A]/50 hover:bg-[#FFE9F1] transition-colors"
                          aria-label={`Preview ${article.title}`}
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                        <Link
                          href={`/admin/articles/${article.id}/edit`}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#3A3A3A]/50 hover:bg-[#FFE9F1] transition-colors"
                          aria-label={`Edit ${article.title}`}
                        >
                          <Edit className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
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
  )
}
