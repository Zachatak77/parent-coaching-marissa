'use client'

import { useRouter } from 'next/navigation'
import { PostEditor, type PostFormData } from '@/components/blog/PostEditor'

export function NewPostClient({ role }: { role: 'coach' | 'admin' }) {
  const router = useRouter()

  async function handleSave(data: PostFormData, action: 'draft' | 'publish') {
    const status = action === 'publish' ? 'PUBLISHED' : 'DRAFT'
    const scheduledAt = action === 'publish'
      ? null
      : (data.scheduledAt ? new Date(data.scheduledAt).toISOString() : null)
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, status, scheduledAt }),
    })
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.error ?? 'Failed to save post')
    }
    router.push('/coach/blog')
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '2rem', color: '#1F1D1A', marginBottom: '2rem' }}>
        New Post
      </h1>
      <PostEditor role={role} onSave={handleSave} onCancel={() => router.push('/coach/blog')} />
    </div>
  )
}
