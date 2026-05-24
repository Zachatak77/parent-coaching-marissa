import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewPostClient } from './NewPostClient'

export default async function NewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role === 'parent') redirect('/portal')
  if (!profile?.role || (profile.role !== 'coach' && profile.role !== 'admin')) redirect('/login')
  return <NewPostClient role={profile.role as 'coach' | 'admin'} />
}
