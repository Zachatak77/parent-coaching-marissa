import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/auth/signup — health check, visit in browser to verify route is reachable
export async function GET() {
  const configured = !!(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  return NextResponse.json({ ok: true, configured })
}

export async function POST(request: Request) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      return NextResponse.json({ error: 'Server is missing Supabase configuration. Check Vercel environment variables.' })
    }

    const { email, password, full_name, role = 'parent' } = await request.json()

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'All fields are required.' })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role } },
    })

    if (error) return NextResponse.json({ error: error.message })
    if (!data.user) return NextResponse.json({ error: 'Sign up failed. Please try again.' })

    await supabase.from('profiles').upsert({ id: data.user.id, email, full_name, role })

    if (!data.session) {
      return NextResponse.json({ emailConfirmation: true })
    }

    return NextResponse.json({
      redirectTo: role === 'parent' ? '/portal' : '/dashboard',
    })
  } catch (e) {
    console.error('[signup]', e)
    return NextResponse.json({ error: String(e) })
  }
}
