import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/api-helpers'

export async function POST(request: NextRequest) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: 'Image uploads not configured. Add BLOB_READ_WRITE_TOKEN to environment variables.' },
      { status: 503 }
    )
  }

  const { error, session } = await requireAuth()
  if (error) return error

  const form = await request.formData()
  const file = form.get('file') as File | null

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json({ error: 'Invalid file type. Use JPEG, PNG, WebP, or GIF.' }, { status: 400 })
  }

  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 })
  }

  const { put } = await import('@vercel/blob')
  const blob = await put(`blog/${session!.user.id}/${Date.now()}-${file.name}`, file, { access: 'public' })

  return NextResponse.json({ url: blob.url })
}
