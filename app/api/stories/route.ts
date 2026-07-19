import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { storyFormSchema } from '@/lib/validations'
import { ZodError } from 'zod'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validated = storyFormSchema.parse(body)

    // Use raw client for insert (avoids strict-type inference issues)
    const supabase = getAdminClient()

    const { data, error } = await supabase
      .from('stories')
      .insert({
        full_name: validated.full_name,
        age: validated.age,
        school: validated.school,
        phone_number: validated.phone_number ?? null,
        category_id: validated.category_id,
        title: validated.title,
        content: validated.content,
        reflection: validated.reflection,
        changemaker_name: validated.changemaker_name,
        changemaker_reason: validated.changemaker_reason,
        publish_consent: validated.publish_consent,
        privacy_agreement: validated.privacy_agreement,
        status: 'pending',
        submitted_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.error('Story insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to submit story. Please try again.' },
        { status: 500 }
      )
    }

    if (validated.changemaker_name && data?.id) {
      const now = new Date()
      await supabase.from('changemaker_nominations').insert({
        story_id: data.id,
        nominee_name: validated.changemaker_name,
        nominee_school: validated.school,
        reason: validated.changemaker_reason,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
      })
    }

    return NextResponse.json({ success: true, data: { id: data?.id } }, { status: 201 })
  } catch (err) {
    if (err instanceof ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: err.flatten() },
        { status: 400 }
      )
    }
    console.error('Story submission error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') ?? '1')
    const pageSize = parseInt(searchParams.get('pageSize') ?? '12')
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') ?? 'newest'
    const search = searchParams.get('search')

    // Use admin client to bypass RLS - we manually filter to published only
    const supabase = getAdminClient()
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    let query = supabase
      .from('stories')
      .select('*, story_categories(*)', { count: 'exact' })
      .eq('status', 'published')

    if (search) query = query.ilike('title', `%${search}%`)
    if (sort === 'popular') query = query.order('view_count', { ascending: false })
    else if (sort === 'oldest') query = query.order('published_at', { ascending: true })
    else query = query.order('published_at', { ascending: false })

    query = query.range(from, to)

    const { data, error, count } = await query

    if (error) {
      console.error('Stories fetch error:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch stories' }, { status: 500 })
    }

    // Filter by category slug after fetch if needed
    const filtered = category
      ? (data ?? []).filter((s: { story_categories?: { slug?: string } }) => s.story_categories?.slug === category)
      : data

    return NextResponse.json({
      success: true,
      data: filtered,
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.ceil((count ?? 0) / pageSize),
    })
  } catch (err) {
    console.error('Stories fetch error:', err)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
