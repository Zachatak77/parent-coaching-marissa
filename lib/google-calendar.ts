import { google } from 'googleapis'
import { createAdminClient } from '@/lib/supabase/admin'

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')
const CHANNEL_SECRET = process.env.GOOGLE_CALENDAR_CHANNEL_SECRET ?? ''

function oauthClient() {
  return new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    `${SITE_URL}/api/auth/google-calendar/callback`
  )
}

export function getAuthUrl(state: string): string {
  return oauthClient().generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
    state,
  })
}

export async function exchangeCode(code: string) {
  const { tokens } = await oauthClient().getToken(code)
  return tokens
}

/** Returns a valid access token for the given coach, refreshing if needed. */
export async function getAccessToken(coachId: string): Promise<string> {
  const admin = createAdminClient()
  const { data: profile } = await admin
    .from('profiles')
    .select('google_access_token, google_refresh_token, google_token_expires_at')
    .eq('id', coachId)
    .single()

  if (!profile?.google_refresh_token) throw new Error('Coach has no Google Calendar connected')

  const expiresAt = profile.google_token_expires_at ? new Date(profile.google_token_expires_at) : new Date(0)
  if (profile.google_access_token && expiresAt > new Date(Date.now() + 60_000)) {
    return profile.google_access_token
  }

  // Refresh
  const client = oauthClient()
  client.setCredentials({ refresh_token: profile.google_refresh_token })
  const { credentials } = await client.refreshAccessToken()

  await admin.from('profiles').update({
    google_access_token: credentials.access_token,
    google_token_expires_at: credentials.expiry_date
      ? new Date(credentials.expiry_date).toISOString()
      : null,
  }).eq('id', coachId)

  return credentials.access_token!
}

/** Registers a new watch channel for a coach's primary calendar. */
export async function registerWatch(coachId: string): Promise<void> {
  const admin = createAdminClient()
  const accessToken = await getAccessToken(coachId)

  const client = oauthClient()
  client.setCredentials({ access_token: accessToken })
  const calendar = google.calendar({ version: 'v3', auth: client })

  // Stop existing channel if present
  const { data: existing } = await admin
    .from('gcal_watch_state')
    .select('channel_id, resource_id')
    .eq('coach_id', coachId)
    .maybeSingle()

  if (existing?.channel_id && existing?.resource_id) {
    await calendar.channels.stop({
      requestBody: { id: existing.channel_id, resourceId: existing.resource_id },
    }).catch(() => null)
  }

  // Get initial sync token
  const listRes = await calendar.events.list({
    calendarId: 'primary',
    maxResults: 1,
    showDeleted: false,
  })
  const syncToken = listRes.data.nextSyncToken ?? undefined

  // Register new watch
  const channelId = crypto.randomUUID()
  const watchRes = await calendar.events.watch({
    calendarId: 'primary',
    requestBody: {
      id: channelId,
      type: 'web_hook',
      address: `${SITE_URL}/api/webhooks/google-calendar`,
      token: CHANNEL_SECRET,
    },
  })

  const expiresMs = Number(watchRes.data.expiration ?? 0)

  await admin.from('gcal_watch_state').upsert({
    coach_id: coachId,
    channel_id: channelId,
    resource_id: watchRes.data.resourceId,
    sync_token: syncToken ?? null,
    channel_expires_at: expiresMs ? new Date(expiresMs).toISOString() : null,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'coach_id' })
}

/** Extracts main_concern from the Google Appointment Scheduling description format. */
export function extractMainConcern(description: string | null | undefined): string | null {
  if (!description) return null
  const marker = 'Please share anything that will help prepare for our meeting.:'
  const stopMarker = 'Need to make changes to this event?'
  const start = description.indexOf(marker)
  if (start === -1) return null
  const textStart = start + marker.length
  const stop = description.indexOf(stopMarker, textStart)
  const raw = stop === -1
    ? description.slice(textStart)
    : description.slice(textStart, stop)
  return raw.trim() || null
}

/** Extracts a phone number from the event description. */
export function extractPhone(description: string | null | undefined): string | null {
  if (!description) return null
  const match = description.match(/Phone:\s*([\d\s\(\)\-\+]+)/)
  return match ? match[1].trim() : null
}
