import { NextRequest, NextResponse } from 'next/server'
import { getAllPublishedPosts, getPostsByAuthor, getAllPosts, createPost } from '@/lib/blog'
import { requireAuth, requireRole } from '@/lib/api-helpers'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function GET(request: NextRequest) {
  const { session } = await requireAuth()

  if (!session) {
    const posts = await getAllPublishedPosts()
    return NextResponse.json(posts)
  }

  if (session.user.role === 'admin') {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') ?? undefined
    const authorId = searchParams.get('authorId') ?? undefined
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

  const { title, content, slug, seoTitle, seoDescription, status, ...rest } = body as Record<string, unknown>

  if (!title || typeof title !== 'string' || !title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 })
  }
  if (!content || typeof content !== 'string' || !content.trim()) {
    return NextResponse.json({ error: 'Content is required' }, { status: 400 })
  }
  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
  }

  const existing = await prisma.blogPost.findUnique({ where: { slug: slug as string } })
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

  const post = await createPost(
    { title: title as string, content: content as string, slug: slug as string, seoTitle: seoTitle as string | undefined, seoDescription: seoDescription as string | undefined, status: status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED', ...rest } as Parameters<typeof createPost>[0],
    session.user.id
  )
  return NextResponse.json(post, { status: 201 })
}
