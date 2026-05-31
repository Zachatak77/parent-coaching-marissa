import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { EditPostClient } from '@/components/blog/EditPostClient'

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

  // Serialize Date fields so they cross the RSC boundary as strings
  const serialized = {
    ...post,
    publishedAt: post.publishedAt?.toISOString() ?? null,
    scheduledAt: post.scheduledAt?.toISOString() ?? null,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
  }

  return (
    <EditPostClient
      post={serialized}
      role={profile.role as 'coach' | 'admin'}
      redirectPath="/coach/blog"
    />
  )
}
