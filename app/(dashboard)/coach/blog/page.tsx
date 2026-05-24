import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPostsByAuthor } from '@/lib/blog'
import { CoachBlogClient } from './CoachBlogClient'

export default async function CoachBlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'parent') redirect('/portal')
  if (!profile?.role || (profile.role !== 'coach' && profile.role !== 'admin')) redirect('/login')

  const posts = await getPostsByAuthor(user.id)

  return <CoachBlogClient posts={posts} role={profile.role as 'coach' | 'admin'} />
}
