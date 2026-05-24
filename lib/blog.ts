import { PostStatus } from '@prisma/client'
import { prisma } from '@/lib/prisma'

export type { PostStatus }

export type CreatePostInput = {
  title: string
  slug: string
  content: string
  excerpt?: string
  status: PostStatus
  tags?: string[]
  coverImage?: string
  coverImageAlt?: string
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
  canonicalUrl?: string
  ogImage?: string
  noIndex?: boolean
  scheduledAt?: Date | null
}

// ── Author shape included in list/detail queries ───────────────────────────
const authorSelect = { id: true, fullName: true } as const

// ── Public queries ─────────────────────────────────────────────────────────

export async function getAllPublishedPosts() {
  return prisma.blogPost.findMany({
    where: { status: 'PUBLISHED' },
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      coverImage: true,
      coverImageAlt: true,
      tags: true,
      publishedAt: true,
      author: { select: authorSelect },
    },
  })
}

export async function getPostBySlug(slug: string) {
  return prisma.blogPost.findFirst({
    where: { slug, status: 'PUBLISHED' },
    include: { author: { select: authorSelect } },
  }) ?? null
}

// ── Author queries ─────────────────────────────────────────────────────────

export async function getPostsByAuthor(authorId: string) {
  return prisma.blogPost.findMany({
    where: { authorId },
    include: { author: { select: authorSelect } },
    orderBy: { createdAt: 'desc' },
  })
}

// ── Admin queries ──────────────────────────────────────────────────────────

export async function getAllPosts(filters?: {
  status?: PostStatus
  authorId?: string
}) {
  return prisma.blogPost.findMany({
    where: {
      ...(filters?.status ? { status: filters.status } : {}),
      ...(filters?.authorId ? { authorId: filters.authorId } : {}),
    },
    include: { author: { select: authorSelect } },
    orderBy: { createdAt: 'desc' },
  })
}

// ── Mutations ──────────────────────────────────────────────────────────────

export async function createPost(data: CreatePostInput, authorId: string) {
  return prisma.blogPost.create({
    data: {
      ...data,
      authorId,
      scheduledAt: data.scheduledAt ?? null,
      publishedAt: data.status === 'PUBLISHED' ? new Date() : null,
    },
  })
}

export async function updatePost(id: string, data: Partial<CreatePostInput>) {
  const existing = await prisma.blogPost.findUniqueOrThrow({ where: { id } })

  const publishedAt =
    data.status === 'PUBLISHED' && existing.publishedAt === null
      ? new Date()
      : undefined

  return prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      ...(publishedAt !== undefined ? { publishedAt } : {}),
    },
  })
}

export async function publishScheduledPosts() {
  const now = new Date()
  return prisma.blogPost.updateMany({
    where: { status: 'DRAFT', scheduledAt: { lte: now } },
    data: { status: 'PUBLISHED', publishedAt: now, scheduledAt: null },
  })
}

export async function deletePost(id: string) {
  return prisma.blogPost.delete({ where: { id } })
}

export async function togglePublish(id: string) {
  const post = await prisma.blogPost.findUniqueOrThrow({ where: { id } })

  if (post.status === 'PUBLISHED') {
    return prisma.blogPost.update({
      where: { id },
      data: { status: 'DRAFT', publishedAt: null },
    })
  }

  return prisma.blogPost.update({
    where: { id },
    data: { status: 'PUBLISHED', publishedAt: new Date() },
  })
}
