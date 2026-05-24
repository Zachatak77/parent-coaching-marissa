import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { EditPostClient } from './EditPostClient'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role === 'parent') redirect('/portal')
  if (!profile?.role || (profile.role !== 'coach' && profile.role !== 'admin')) redirect('/login')

  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) notFound()

  // Coach can only edit own posts
  if (profile.role === 'coach' && post.authorId !== user.id) redirect('/unauthorized')

  return <EditPostClient post={post} role={profile.role as 'coach' | 'admin'} />
}
