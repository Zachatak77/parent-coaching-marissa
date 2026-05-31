import { NextRequest, NextResponse } from 'next/server'
import { updatePost, deletePost } from '@/lib/blog'
import { requireAuth, requireRole } from '@/lib/api-helpers'
import { validatePostBody } from '@/lib/blog-validation'
import { sanitizeHtml } from '@/lib/sanitize'
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

  const { data, error: validationError } = validatePostBody(body)
  if (validationError || !data) {
    return NextResponse.json({ error: validationError }, { status: 400 })
  }

  const slugConflict = await prisma.blogPost.findFirst({ where: { slug: data.slug, id: { not: id } } })
  if (slugConflict) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
  }

  const updated = await updatePost(id, { ...data, content: sanitizeHtml(data.content) })
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
