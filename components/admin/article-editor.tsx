'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Loader2, Save, Globe } from 'lucide-react'
import { articleFormSchema, type ArticleFormSchema } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { slugify } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import type { Article, ArticleCategory } from '@/types'

interface ArticleEditorProps {
  categories: ArticleCategory[]
  article?: Article
}

export function ArticleEditor({ categories, article }: ArticleEditorProps) {
  const [saving, setSaving] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<ArticleFormSchema>({
    resolver: zodResolver(articleFormSchema),
    defaultValues: {
      title: article?.title ?? '',
      slug: article?.slug ?? '',
      excerpt: article?.excerpt ?? '',
      content: article?.content ?? '',
      author_name: article?.author_name ?? 'Beyond The Skin Team',
      category_id: article?.category_id ?? '',
      status: article?.status ?? 'draft',
    },
  })

  const watchTitle = watch('title')
  const watchCategory = watch('category_id')
  const watchStatus = watch('status')

  const handleTitleBlur = () => {
    if (!article) {
      setValue('slug', slugify(watchTitle), { shouldValidate: true })
    }
  }

  const onSubmit = async (data: ArticleFormSchema, status: 'draft' | 'published') => {
    const isSave = status === 'draft'
    if (isSave) setSaving(true)
    else setPublishing(true)

    try {
      const method = article ? 'PUT' : 'POST'
      const url = article ? `/api/admin/articles/${article.id}` : '/api/admin/articles'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status }),
      })
      const result = await res.json()
      if (!res.ok || !result.success) throw new Error(result.error)

      toast({ variant: 'success', title: status === 'published' ? 'Published!' : 'Saved!', description: 'Article saved successfully.' })
      router.push('/admin/articles')
      router.refresh()
    } catch (err) {
      toast({ variant: 'error', title: 'Error', description: err instanceof Error ? err.message : 'Failed to save.' })
    } finally {
      setSaving(false)
      setPublishing(false)
    }
  }

  return (
    <form className="space-y-6" noValidate>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm space-y-4">
            <Input
              label="Title"
              required
              placeholder="Article title"
              {...register('title')}
              onBlur={handleTitleBlur}
              error={errors.title?.message}
            />
            <Input
              label="Slug"
              required
              placeholder="article-url-slug"
              hint="URL-friendly identifier"
              {...register('slug')}
              error={errors.slug?.message}
            />
            <Textarea
              label="Excerpt"
              rows={2}
              placeholder="Brief summary shown in article cards (optional)"
              {...register('excerpt')}
              error={errors.excerpt?.message}
            />
          </div>

          <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-6 shadow-sm">
            <Textarea
              label="Content"
              required
              rows={20}
              placeholder="Write your article content here. HTML is supported for formatting."
              hint="You can use HTML tags for formatting: <h2>, <p>, <strong>, <em>, <ul>, <li>, <blockquote>"
              {...register('content')}
              error={errors.content?.message}
              className="font-mono text-sm"
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-[#3A3A3A]">Article Details</h3>

            <div className="space-y-1">
              <label className="text-sm font-medium text-[#3A3A3A]">
                Category <span className="text-[#FFB6D6]">*</span>
              </label>
              <Select value={watchCategory} onValueChange={(v) => setValue('category_id', v, { shouldValidate: true })}>
                <SelectTrigger error={errors.category_id?.message}>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Input
              label="Author Name"
              required
              {...register('author_name')}
              error={errors.author_name?.message}
            />
          </div>

          {/* Actions */}
          <div className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-5 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#3A3A3A]">Publish</h3>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              disabled={saving || publishing}
              onClick={handleSubmit((data) => onSubmit(data, 'draft'))}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving…' : 'Save Draft'}
            </Button>
            <Button
              type="button"
              variant="default"
              className="w-full gap-2"
              disabled={saving || publishing}
              onClick={handleSubmit((data) => onSubmit(data, 'published'))}
            >
              {publishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
              {publishing ? 'Publishing…' : 'Publish Now'}
            </Button>
          </div>
        </div>
      </div>
    </form>
  )
}
