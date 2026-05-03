import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // If Supabase env vars are missing, let the request through — pages will handle auth
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  let supabaseResponse: NextResponse
  let supabase: Awaited<ReturnType<typeof updateSession>>['supabase']
  let user: Awaited<ReturnType<typeof updateSession>>['user']

  try {
    ;({ supabaseResponse, supabase, user } = await updateSession(request))
  } catch {
    return NextResponse.next()
  }

  const { pathname } = request.nextUrl

  // Server actions POST to the page URL with this header — skip redirect logic
  // so the action receives JSON, not an HTML redirect page
  if (request.headers.has('next-action')) {
    return supabaseResponse
  }

  // ── Portal routes: require any authenticated session ──────────────────────
  if (pathname.startsWith('/portal')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // ── Dashboard routes: require coach role ─────────────────────────────────
  if (pathname.startsWith('/dashboard')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'parent') {
      return NextResponse.redirect(new URL('/portal', request.url))
    }
    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  // ── Admin routes: require admin role ─────────────────────────────────────
  if (pathname.startsWith('/admin')) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(
        new URL(profile?.role === 'parent' ? '/portal' : '/dashboard', request.url)
      )
    }
  }

  // ── Login: redirect authenticated users to their home area ────────────────
  if (pathname === '/login' && user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'parent') {
      return NextResponse.redirect(new URL('/portal', request.url))
    }
    if (profile?.role === 'admin') {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
