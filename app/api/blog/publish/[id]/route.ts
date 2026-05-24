import { NextRequest, NextResponse } from 'next/server'
import { togglePublish } from '@/lib/blog'
import { requireRole } from '@/lib/api-helpers'
import { prisma } from '@/lib/prisma'

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
