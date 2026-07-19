import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { commentFormSchema } from '@/lib/validations'
import { z } from 'zod'

const createCommentSchema = commentFormSchema.extend({
  story_id: z.string().uuid(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const storyId = searchParams.get('story_id')

  if (!storyId) {
    return NextResponse.json({ success: false, error: 'story_id is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('story_id', storyId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = createCommentSchema.parse(body)

    // Verify the story exists and is published (use anon client for reads)
    const supabase = await createClient()
    const { data: story } = await supabase
      .from('stories')
      .select('id')
      .eq('id', validated.story_id)
      .eq('status', 'published')
      .maybeSingle()

    if (!story) {
      return NextResponse.json({ success: false, error: 'Story not found' }, { status: 404 })
    }

    // Use raw admin client for insert to avoid strict type inference issues
    const adminClient = getAdminClient()
    const { error } = await adminClient.from('comments').insert({
      story_id: validated.story_id,
      author_name: validated.author_name,
      content: validated.content,
      status: 'pending',
    })

    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to submit comment' }, { status: 500 })
    }

    return NextResponse.json(
      { success: true, message: 'Comment submitted for review' },
      { status: 201 }
    )
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ success: false, error: 'Validation failed' }, { status: 400 })
    }
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
