import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { registerWatch } from '@/lib/google-calendar'

export async function GET(req: NextRequest) {
  const secret = process.env.GOOGLE_CALENDAR_CHANNEL_SECRET ?? ''
  const auth = req.headers.get('authorization') ?? ''
  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const cutoff = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString()

  const { data: expiring } = await admin
    .from('gcal_watch_state')
    .select('coach_id')
    .lt('channel_expires_at', cutoff)

  if (!expiring?.length) return NextResponse.json({ ok: true, renewed: 0 })

  const results = await Promise.allSettled(
    expiring.map(({ coach_id }) => registerWatch(coach_id))
  )

  const renewed = results.filter((r) => r.status === 'fulfilled').length
  return NextResponse.json({ ok: true, renewed })
}
