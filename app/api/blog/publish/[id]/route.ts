import { NextRequest, NextResponse } from 'next/server'
import { togglePublish } from '@/lib/blog'
import { requireRole } from '@/lib/api-helpers'
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const { id } = params

  const { error } = await requireRole('admin')
  if (error) return error

  const post = await prisma.blogPost.findUnique({ where: { id } })
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  const updated = await togglePublish(id)
  return NextResponse.json(updated)
}
