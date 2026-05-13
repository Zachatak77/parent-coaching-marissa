import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAccessToken, extractMainConcern, extractPhone } from '@/lib/google-calendar'
import { getResend, FROM, COACH_EMAIL } from '@/lib/email/resend'
import { render } from '@react-email/render'
import { DiscoveryCallAlert } from '@/lib/email/templates/discovery-call-alert'

const CHANNEL_SECRET = process.env.GOOGLE_CALENDAR_CHANNEL_SECRET ?? ''
const CONSULT_MARKER = 'parent coach consult session'

export async function POST(req: NextRequest) {
  const token = req.headers.get('x-goog-channel-token')
  if (!token || token !== CHANNEL_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Initial sync handshake — no events to process
  if (req.headers.get('x-goog-resource-state') === 'sync') {
    return NextResponse.json({ ok: true })
  }

  const channelId = req.headers.get('x-goog-channel-id')
  if (!channelId) return NextResponse.json({ ok: true })

  const admin = createAdminClient()

  const { data: watchState } = await admin
    .from('gcal_watch_state')
    .select('coach_id, sync_token')
    .eq('channel_id', channelId)
    .maybeSingle()

  if (!watchState?.coach_id) return NextResponse.json({ ok: true })

  const { coach_id: coachId, sync_token: syncToken } = watchState

  let accessToken: string
  try {
    accessToken = await getAccessToken(coachId)
  } catch {
    return NextResponse.json({ ok: true })
  }

  const authClient = new google.auth.OAuth2()
  authClient.setCredentials({ access_token: accessToken })
  const calendar = google.calendar({ version: 'v3', auth: authClient })

  const listRes = await calendar.events.list({
    calendarId: 'primary',
    syncToken: syncToken ?? undefined,
    showDeleted: false,
    singleEvents: true,
  }).catch(() => null)

  if (!listRes) return NextResponse.json({ ok: true })

  // Store the new sync token
  if (listRes.data.nextSyncToken) {
    await admin.from('gcal_watch_state').update({
      sync_token: listRes.data.nextSyncToken,
      updated_at: new Date().toISOString(),
    }).eq('coach_id', coachId)
  }

  const events = listRes.data.items ?? []

  for (const event of events) {
    if (event.status === 'cancelled') continue

    const description = event.description ?? ''
    if (!description.toLowerCase().includes(CONSULT_MARKER)) continue

    // Find the non-organizer attendee (the lead)
    const attendee = (event.attendees ?? []).find(
      (a) => !a.organizer && a.email
    )
    if (!attendee?.email) continue

    const name = attendee.displayName ?? attendee.email.split('@')[0]
    const email = attendee.email
    const phone = extractPhone(description)
    const mainConcern = extractMainConcern(description)
    const scheduledAt = event.start?.dateTime ?? event.start?.date ?? null

    const { error } = await admin.from('discovery_calls').insert({
      name,
      email,
      phone: phone ?? null,
      main_concern: mainConcern ?? null,
      scheduled_at: scheduledAt,
      gcal_event_id: event.id,
      source: 'google_calendar',
      status: 'booked',
      coach_id: coachId,
    })

    // error.code 23505 = unique violation (duplicate event) — skip silently
    if (error && !error.code?.includes('23505')) continue
    if (error) continue

    // Fire coach alert email (fire-and-forget)
    try {
      const html = await render(DiscoveryCallAlert({
        name,
        email,
        phone: phone ?? undefined,
        childAges: '—',
        mainConcern: mainConcern ?? '—',
        howTheyHeard: 'Google Calendar',
      }))
      getResend().emails.send({
        from: FROM,
        to: COACH_EMAIL,
        subject: `New consult booked: ${name}`,
        html,
      })
    } catch {
      // Email failure is non-fatal
    }
  }

  return NextResponse.json({ ok: true })
}
