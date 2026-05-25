import { NextRequest, NextResponse } from 'next/server'
import { getAllPublishedPosts, getPostsByAuthor, getAllPosts, createPost } from '@/lib/blog'
import { requireAuth, requireRole } from '@/lib/api-helpers'
import { validatePostBody } from '@/lib/blog-validation'
import { sanitizeHtml } from '@/lib/sanitize'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { session } = await requireAuth()

  if (!session) {
    const posts = await getAllPublishedPosts()
    return NextResponse.json(posts)
  }

  if (session.user.role === 'admin') {
    const { searchParams } = new URL(request.url)
    const statusParam = searchParams.get('status')
    const authorId = searchParams.get('authorId') ?? undefined
    const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED']
    const status = statusParam && validStatuses.includes(statusParam)
      ? (statusParam as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')
      : undefined
    const posts = await getAllPosts({ status, authorId })
    return NextResponse.json(posts)
  }

  if (session.user.role === 'coach') {
    const posts = await getPostsByAuthor(session.user.id)
    return NextResponse.json(posts)
  }

  const posts = await getAllPublishedPosts()
  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  const { error, session } = await requireRole('coach')
  if (error) return error

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

  const existing = await prisma.blogPost.findUnique({ where: { slug: data.slug } })
  if (existing) {
    return NextResponse.json({ error: 'Slug already exists' }, { status: 400 })
  }

  const post = await createPost(
    { ...data, content: sanitizeHtml(data.content) },
    session.user.id,
  )
  return NextResponse.json(post, { status: 201 })
}
