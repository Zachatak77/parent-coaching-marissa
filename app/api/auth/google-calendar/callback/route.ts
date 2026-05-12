import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { exchangeCode, registerWatch } from '@/lib/google-calendar'
import { google } from 'googleapis'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  const cookieStore = await cookies()
  const stored = cookieStore.get('gcal_oauth_state')?.value
  cookieStore.delete('gcal_oauth_state')

  if (!code || !state || !stored) {
    return NextResponse.redirect(`${SITE_URL}/dashboard/settings?error=gcal_auth_failed`)
  }

  const [storedState, coachId] = stored.split(':')
  if (state !== storedState || !coachId) {
    return NextResponse.redirect(`${SITE_URL}/dashboard/settings?error=gcal_auth_failed`)
  }

  const tokens = await exchangeCode(code).catch(() => null)
  if (!tokens?.refresh_token) {
    return NextResponse.redirect(`${SITE_URL}/dashboard/settings?error=gcal_no_refresh_token`)
  }

  // Fetch the email of the connected Google account
  const authClient = new google.auth.OAuth2()
  authClient.setCredentials({ access_token: tokens.access_token })
  const calRes = await google.calendar({ version: 'v3', auth: authClient })
    .calendars.get({ calendarId: 'primary' })
    .catch(() => null)
  const calendarEmail = calRes?.data.id ?? null

  const admin = createAdminClient()
  await admin.from('profiles').update({
    google_refresh_token: tokens.refresh_token,
    google_access_token: tokens.access_token ?? null,
    google_token_expires_at: tokens.expiry_date
      ? new Date(tokens.expiry_date).toISOString()
      : null,
    google_calendar_email: calendarEmail,
  }).eq('id', coachId)

  // Register the calendar watch channel
  await registerWatch(coachId).catch(() => null)

  return NextResponse.redirect(`${SITE_URL}/dashboard/settings?connected=true`)
}
