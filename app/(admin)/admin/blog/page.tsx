import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAllPosts } from '@/lib/blog'
import { AdminBlogClient } from './AdminBlogClient'

export default async function AdminBlogPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  let posts: Awaited<ReturnType<typeof getAllPosts>> = []
  try {
    posts = await getAllPosts()
  } catch {
    // DB unavailable — render with empty list
  }

  return <AdminBlogClient posts={posts} />
}
