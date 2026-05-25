'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PostEditor, type PostFormData } from '@/components/blog/PostEditor'

export interface SerializedBlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  authorId: string
  coverImage: string | null
  coverImageAlt: string | null
  seoTitle: string | null
  seoDescription: string | null
  seoKeywords: string[]
  canonicalUrl: string | null
  ogImage: string | null
  noIndex: boolean
  tags: string[]
  publishedAt: string | null
  scheduledAt: string | null
  createdAt: string
  updatedAt: string
}

interface EditPostClientProps {
  post: SerializedBlogPost
  role: 'coach' | 'admin'
  redirectPath: string
}

export function EditPostClient({ post, role, redirectPath }: EditPostClientProps) {
  const router = useRouter()
  const [saveError, setSaveError] = useState<string | null>(null)

  async function handleSave(data: PostFormData, action: 'draft' | 'publish') {
    setSaveError(null)
    const status = action === 'publish' ? 'PUBLISHED' : data.status
    const scheduledAt = action === 'publish'
      ? null
      : (data.scheduledAt ? new Date(data.scheduledAt).toISOString() : null)
    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status, scheduledAt }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error ?? 'Failed to update post')
      }
      toast.success('Post saved')
      router.push(redirectPath)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred'
      setSaveError(message)
      throw err // re-throw so PostEditor can catch slug errors
    }
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', color: '#1F1D1A', marginBottom: '2rem' }}>
        Edit Post
      </h1>
      {saveError && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {saveError}
        </div>
      )}
      <PostEditor post={post} role={role} onSave={handleSave} onCancel={() => router.push(redirectPath)} />
    </div>
  )
}
