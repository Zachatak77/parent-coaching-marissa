import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { google } from 'googleapis'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createAdminClient()

  // Stop the active watch channel if any
  const { data: watchState } = await admin
    .from('gcal_watch_state')
    .select('channel_id, resource_id')
    .eq('coach_id', user.id)
    .maybeSingle()

  if (watchState?.channel_id && watchState?.resource_id) {
    const { data: profile } = await admin
      .from('profiles')
      .select('google_access_token')
      .eq('id', user.id)
      .single()

    if (profile?.google_access_token) {
      const authClient = new google.auth.OAuth2()
      authClient.setCredentials({ access_token: profile.google_access_token })
      await google.calendar({ version: 'v3', auth: authClient }).channels.stop({
        requestBody: { id: watchState.channel_id, resourceId: watchState.resource_id },
      }).catch(() => null)
    }

    await admin.from('gcal_watch_state').delete().eq('coach_id', user.id)
  }

  // Clear OAuth tokens from profile
  await admin.from('profiles').update({
    google_refresh_token: null,
    google_access_token: null,
    google_token_expires_at: null,
    google_calendar_email: null,
  }).eq('id', user.id)

  return NextResponse.redirect(`${SITE_URL}/dashboard/settings`)
}
