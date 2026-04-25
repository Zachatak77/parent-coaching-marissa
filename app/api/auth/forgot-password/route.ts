import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()
    if (!email) return NextResponse.json({ error: 'Email is required.' })

    const supabase = await createClient()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/callback?next=/reset-password`,
    })

    if (error) return NextResponse.json({ error: error.message })
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: String(e) })
  }
}
