import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware session handler — refreshes session cookies and enforces admin auth.
 * Uses untyped Supabase client to avoid TypeScript inference issues on .select('role').
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refresh session
  const { data: { user } } = await supabase.auth.getUser()

  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  // Protect admin routes (except the login page itself)
  if (isAdminRoute && !isLoginPage) {
    if (!user) {
      const url = request.nextUrl.clone()
      url.pathname = '/admin/login'
      return NextResponse.redirect(url)
    }

    // Verify admin role
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const profile = data as { role: string } | null

    if (!profile || profile.role !== 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // Redirect already-logged-in admins away from login page
  if (isLoginPage && user) {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const profile = data as { role: string } | null

    if (profile?.role === 'admin') {
      const url = request.nextUrl.clone()
      url.pathname = '/admin'
      return NextResponse.redirect(url)
    }
  }

  return supabaseResponse
}
