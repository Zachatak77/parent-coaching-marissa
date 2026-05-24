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

  const posts = await getAllPosts()
  return <AdminBlogClient posts={posts} />
}
