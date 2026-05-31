import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), session: null }
  }
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('id', user.id)
    .single()
  return { error: null, session: { user: { id: user.id, email: user.email!, role: profile?.role ?? 'parent', fullName: profile?.full_name ?? null } } }
}

export async function requireRole(role: 'coach' | 'admin') {
  const { session, error } = await requireAuth()
  if (error) return { error, session: null }
  if (role === 'admin' && session!.user.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), session: null }
  }
  if (role === 'coach' && session!.user.role !== 'coach' && session!.user.role !== 'admin') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), session: null }
  }
  return { error: null, session: session! }
}

export function checkApiKey(request: Request): boolean {
  const key = process.env.BLOG_API_KEY
  if (!key) return false
  return request.headers.get('authorization') === `Bearer ${key}`
}
