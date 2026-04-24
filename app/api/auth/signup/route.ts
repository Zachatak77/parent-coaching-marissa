import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, password, full_name, role = 'parent' } = await request.json()

    if (!email || !password || !full_name) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name, role } },
    })

    if (error) return NextResponse.json({ error: error.message })
    if (!data.user) return NextResponse.json({ error: 'Sign up failed. Please try again.' })

    // Best-effort profile upsert — trigger on auth.users may have already created the row
    await supabase.from('profiles').upsert({ id: data.user.id, email, full_name, role })

    if (!data.session) {
      return NextResponse.json({ emailConfirmation: true })
    }

    return NextResponse.json({
      redirectTo: role === 'parent' ? '/portal' : '/dashboard',
    })
  } catch (e) {
    console.error('[signup]', e)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }
}
