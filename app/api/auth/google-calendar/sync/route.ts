import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getAccessToken, extractMainConcern, extractPhone, extractNameFromTitle } from '@/lib/google-calendar'
import { google } from 'googleapis'
import { getResend, FROM, COACH_EMAIL } from '@/lib/email/resend'
import { render } from '@react-email/render'
import { DiscoveryCallAlert } from '@/lib/email/templates/discovery-call-alert'

const CONSULT_MARKER = 'parent coach consult session'

export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const coachId = user.id
  const admin = createAdminClient()

  let accessToken: string
  try {
    accessToken = await getAccessToken(coachId)
  } catch {
    return NextResponse.json({ error: 'Google Calendar not connected' }, { status: 400 })
  }

  const authClient = new google.auth.OAuth2()
  authClient.setCredentials({ access_token: accessToken })
  const calendar = google.calendar({ version: 'v3', auth: authClient })

  // Fetch events from last 60 days to next 30 days
  const timeMin = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

  let listRes
  try {
    listRes = await calendar.events.list({
      calendarId: 'primary',
      timeMin,
      timeMax,
      showDeleted: false,
      singleEvents: true,
      maxResults: 250,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[gcal-sync] events.list failed:', message)
    return NextResponse.json({ error: `Calendar API error: ${message}` }, { status: 502 })
  }

  const events = listRes.data.items ?? []
  let created = 0
  let skipped = 0

  for (const event of events) {
    if (event.status === 'cancelled') continue

    const description = event.description ?? ''
    if (!description.toLowerCase().includes(CONSULT_MARKER)) continue

    const attendee = (event.attendees ?? []).find((a) => !a.organizer && a.email)
    if (!attendee?.email) continue

    const name = extractNameFromTitle(event.summary) ?? attendee.displayName ?? attendee.email.split('@')[0]
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

    if (error?.code === '23505') {
      await admin.from('discovery_calls').update({ name }).eq('gcal_event_id', event.id!)
      skipped++
      continue
    }
    if (error) continue

    created++

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

  return NextResponse.json({ created, skipped })
}
