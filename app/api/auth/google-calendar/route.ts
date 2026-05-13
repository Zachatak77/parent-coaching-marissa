import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAuthUrl } from '@/lib/google-calendar'
import { cookies } from 'next/headers'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_SITE_URL!))

  // Store user ID in a short-lived cookie for CSRF validation in the callback
  const state = crypto.randomUUID()
  const cookieStore = await cookies()
  cookieStore.set('gcal_oauth_state', `${state}:${user.id}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    path: '/',
  })

  return NextResponse.redirect(getAuthUrl(state))
}
