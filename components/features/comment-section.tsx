'use client'

import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Send, Loader2, Heart } from 'lucide-react'
import { commentFormSchema, type CommentFormSchema } from '@/lib/validations'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { timeAgo } from '@/lib/utils'
import type { Comment } from '@/types'

interface CommentSectionProps {
  storyId: string
}

async function fetchComments(storyId: string): Promise<Comment[]> {
  const res = await fetch(`/api/comments?story_id=${storyId}`)
  const data = await res.json()
  return data.success ? data.data : []
}

export function CommentSection({ storyId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormSchema>({
    resolver: zodResolver(commentFormSchema),
  })

  useEffect(() => {
    fetchComments(storyId).then((data) => {
      setComments(data)
      setLoading(false)
    })
  }, [storyId])

  const onSubmit = async (data: CommentFormSchema) => {
    setSubmitting(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, story_id: storyId }),
      })
      const result = await res.json()
      if (result.success) {
        setSubmitted(true)
        reset()
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section aria-labelledby="comments-heading" className="mt-10">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="h-5 w-5 text-[#FFB6D6]" aria-hidden="true" />
        <h2 id="comments-heading" className="text-lg font-bold text-[#3A3A3A]">
          Community Messages
          {comments.length > 0 && (
            <span className="ml-2 text-sm font-normal text-[#3A3A3A]/40">
              ({comments.length})
            </span>
          )}
        </h2>
      </div>

      {/* Comment form */}
      <div className="rounded-2xl bg-white border border-[#FFB6D6]/20 p-6 mb-8">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-4"
          >
            <div className="text-3xl mb-2">💌</div>
            <h3 className="font-bold text-[#3A3A3A]">Message received!</h3>
            <p className="text-sm text-[#3A3A3A]/60 mt-1">
              Your message will appear once reviewed by our team.
            </p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-3"
              onClick={() => setSubmitted(false)}
            >
              Write another message
            </Button>
          </motion.div>
        ) : (
          <>
            <h3 className="text-sm font-bold text-[#3A3A3A] mb-4">
              Leave a supportive message 💕
            </h3>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
              <Input
                label="Your Name"
                required
                placeholder="Your first name or nickname"
                {...register('author_name')}
                error={errors.author_name?.message}
              />
              <Textarea
                label="Your Message"
                required
                rows={3}
                placeholder="Share a kind word, encouragement, or your own experience…"
                hint="Max 500 characters. Your message will be reviewed before publishing."
                {...register('content')}
                error={errors.content?.message}
              />
              <Button type="submit" variant="default" disabled={submitting} className="gap-2">
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
                {submitting ? 'Sending…' : 'Send Message'}
              </Button>
            </form>
          </>
        )}
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl bg-white border border-[#FFB6D6]/10 p-5 animate-pulse">
              <div className="h-4 bg-[#FFE9F1] rounded w-24 mb-2" />
              <div className="h-3 bg-[#FFE9F1] rounded w-full mb-1" />
              <div className="h-3 bg-[#FFE9F1] rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-[#3A3A3A]/40">
          <div className="text-3xl mb-2">💭</div>
          <p className="text-sm">Be the first to leave a message.</p>
        </div>
      ) : (
        <AnimatePresence>
          <div className="space-y-4">
            {comments.map((comment, i) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="rounded-2xl bg-white border border-[#FFB6D6]/15 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                      style={{
                        background: 'linear-gradient(135deg, #FFB6D6, #E8B4F0)',
                      }}
                      aria-hidden="true"
                    >
                      {comment.author_name[0]?.toUpperCase()}
                    </div>
                    <span className="font-semibold text-sm text-[#3A3A3A]">
                      {comment.author_name}
                    </span>
                  </div>
                  <time
                    dateTime={comment.created_at}
                    className="text-xs text-[#3A3A3A]/40 shrink-0"
                  >
                    {timeAgo(comment.created_at)}
                  </time>
                </div>
                <p className="mt-3 text-sm text-[#3A3A3A]/75 leading-relaxed">
                  {comment.content}
                </p>
                <button
                  className="mt-2 flex items-center gap-1 text-xs text-[#3A3A3A]/30 hover:text-[#FFB6D6] transition-colors"
                  aria-label="Like this comment"
                >
                  <Heart className="h-3 w-3" aria-hidden="true" />
                  <span>Helpful</span>
                </button>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      )}
    </section>
  )
}
