import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { registerWatch, getAccessToken } from '@/lib/google-calendar'

const CHANNEL_SECRET = process.env.GOOGLE_CALENDAR_CHANNEL_SECRET ?? ''

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (!auth || auth !== `Bearer ${CHANNEL_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Get the coach with a refresh token
  const { data: profiles, error: profileErr } = await admin
    .from('profiles')
    .select('id, email, google_refresh_token, google_access_token, google_token_expires_at, google_calendar_email')
    .not('google_refresh_token', 'is', null)

  if (profileErr) {
    return NextResponse.json({ error: 'DB error', detail: profileErr.message }, { status: 500 })
  }

  if (!profiles || profiles.length === 0) {
    return NextResponse.json({ error: 'No coach with Google token found' }, { status: 404 })
  }

  const results: Record<string, unknown>[] = []

  for (const profile of profiles) {
    try {
      // Test token refresh first
      const accessToken = await getAccessToken(profile.id)
      results.push({ coachId: profile.id, email: profile.email, tokenOk: true, accessToken: accessToken.slice(0, 20) + '...' })

      // Try registerWatch and capture error
      await registerWatch(profile.id)
      results.push({ coachId: profile.id, step: 'registerWatch', ok: true })
    } catch (err: unknown) {
      const e = err as { message?: string; status?: number; errors?: unknown; code?: string; response?: { data?: unknown } }
      results.push({
        coachId: profile.id,
        step: 'registerWatch',
        ok: false,
        error: e?.message,
        status: e?.status,
        code: e?.code,
        errors: e?.errors,
        responseData: e?.response?.data,
      })
    }
  }

  // Also show current gcal_watch_state
  const { data: watchState } = await admin.from('gcal_watch_state').select('*')

  return NextResponse.json({ results, watchState })
}
