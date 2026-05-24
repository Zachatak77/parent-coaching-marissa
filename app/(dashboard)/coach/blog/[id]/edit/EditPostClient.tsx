'use client'

import { useRouter } from 'next/navigation'
import { PostEditor, type PostFormData } from '@/components/blog/PostEditor'
import type { Prisma } from '@prisma/client'

type BlogPost = Prisma.BlogPostGetPayload<{}>

export function EditPostClient({ post, role }: { post: BlogPost; role: 'coach' | 'admin' }) {
  const router = useRouter()

  async function handleSave(data: PostFormData, action: 'draft' | 'publish') {
    const status = action === 'publish' ? 'PUBLISHED' : data.status
    const res = await fetch(`/api/blog/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, status }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? 'Failed to update post')
    }
    router.push('/coach/blog')
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', color: '#1F1D1A', marginBottom: '2rem' }}>
        Edit Post
      </h1>
      <PostEditor post={post as any} role={role} onSave={handleSave} onCancel={() => router.push('/coach/blog')} />
    </div>
  )
}
