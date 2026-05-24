import { NextRequest, NextResponse } from 'next/server'
import { publishScheduledPosts } from '@/lib/blog'

export async function GET(request: NextRequest) {
  const auth = request.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const result = await publishScheduledPosts()
  return NextResponse.json({ published: result.count })
}
