import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/auth/signin — health check, visit in browser to verify route is reachable
export async function GET() {
  const configured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return NextResponse.json({ ok: true, configured })
}

export async function POST(request: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Server is missing Supabase configuration. Check Vercel environment variables.' })
    }

    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' })
    }

    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return NextResponse.json({ error: error.message })

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Authentication failed.' })

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const redirectTo =
      profile?.role === 'parent' ? '/portal'
      : profile?.role === 'admin' ? '/admin'
      : '/dashboard'
    return NextResponse.json({ redirectTo })
  } catch (e) {
    console.error('[signin]', e)
    return NextResponse.json({ error: String(e) })
  }
}
