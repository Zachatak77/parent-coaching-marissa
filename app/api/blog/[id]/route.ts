import { NextRequest, NextResponse } from 'next/server'
import { updatePost, deletePost } from '@/lib/blog'
import { requireAuth, requireRole } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const post = await prisma.blogPost.findUnique({ where: { id }, include: { author: true } })
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  if (post.status !== 'PUBLISHED') {
    const { error } = await requireAuth()
    if (error) return error
  }

  return NextResponse.json(post)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const { error, session } = await requireRole('coach')
  if (error) return error

  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  if (session.user.role === 'coach' && post.authorId !== session.user.id) {
    return NextResponse.json({ error: "Cannot edit another author's post" }, { status: 403 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { title, content, slug, seoTitle, seoDescription, status, scheduledAt, ...rest } = body as Record<string, unknown>

  if (!title || typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!content || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }
  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  const existing = await prisma.blogPost.findFirst({ where: { slug: slug as string, id: { not: id } } })
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
  }

  if (seoTitle !== undefined && seoTitle !== null) {
    if (typeof seoTitle !== 'string' || seoTitle.length > 60) {
      return NextResponse.json({ error: 'SEO title must be 60 characters or less' }, { status: 400 })
    }
  }
  if (seoDescription !== undefined && seoDescription !== null) {
    if (typeof seoDescription !== 'string' || seoDescription.length > 160) {
      return NextResponse.json({ error: 'SEO description must be 160 characters or less' }, { status: 400 })
    }
  }

  const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED']
  if (!status || !validStatuses.includes(status as string)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  let scheduledAtDate: Date | null = null
  if (scheduledAt !== undefined && scheduledAt !== null && scheduledAt !== '') {
    scheduledAtDate = new Date(scheduledAt as string)
    if (isNaN(scheduledAtDate.getTime())) {
      return NextResponse.json({ error: 'Invalid scheduledAt' }, { status: 400 })
    }
  }

  const updated = await updatePost(
    id,
    { title: title as string, content: content as string, slug: slug as string, seoTitle: seoTitle as string | undefined, seoDescription: seoDescription as string | undefined, status: status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED', scheduledAt: scheduledAtDate, ...rest } as Parameters<typeof updatePost>[1]
  )
  return NextResponse.json(updated)
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const { error, session } = await requireRole('coach')
  if (error) return error

  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  if (session.user.role === 'coach') {
    if (post.authorId !== session.user.id) {
      return NextResponse.json({ error: "Cannot delete another author's post" }, { status: 403 })
    }
    if (post.status === 'PUBLISHED') {
      return NextResponse.json({ error: 'Published posts cannot be deleted' }, { status: 403 })
    }
  }

  await deletePost(id)
  return NextResponse.json({ message: 'Post deleted' })
}
