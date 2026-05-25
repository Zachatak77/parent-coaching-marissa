import { NextRequest, NextResponse } from 'next/server'
import { togglePublish } from '@/lib/blog'
import { requireRole } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const { error, session } = await requireRole('coach')
  if (error) return error

  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  // Coaches can only toggle their own posts; admins can toggle any
  if (session.user.role === 'coach' && post.authorId !== session.user.id) {
    return NextResponse.json({ error: "Cannot publish another author's post" }, { status: 403 })
  }

  const updated = await togglePublish(id)
  return NextResponse.json(updated)
}
