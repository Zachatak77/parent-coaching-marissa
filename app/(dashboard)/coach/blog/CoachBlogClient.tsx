'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { PostTable } from '@/components/blog/PostTable'
import { AIGenerateDialog, type GeneratedPost } from '@/components/blog/AIGenerateDialog'
import { Sparkles } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  authorId: string
  createdAt: Date
  publishedAt: Date | null
  scheduledAt: Date | string | null
  author: { id: string; fullName: string | null }
}

interface Props {
  posts: Post[]
  role: 'coach' | 'admin'
}

export function CoachBlogClient({ posts: initialPosts, role }: Props) {
  const router = useRouter()
  const [posts, setPosts] = useState(initialPosts)
  const [showAIDialog, setShowAIDialog] = useState(false)

  async function handleDelete(id: string) {
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPosts(prev => prev.filter(p => p.id !== id))
      toast.success('Post deleted')
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err.error ?? 'Failed to delete post. Please try again.')
    }
  }

  async function handleTogglePublish(id: string) {
    const res = await fetch(`/api/blog/publish/${id}`, { method: 'PUT' })
    if (res.ok) {
      const updated = await res.json()
      setPosts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p))
      toast.success('Status updated')
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err.error ?? 'Failed to update status. Please try again.')
    }
  }

  async function handleGenerate(generated: GeneratedPost) {
    const res = await fetch('/api/blog', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: generated.title,
        slug: generated.slug,
        excerpt: generated.excerpt,
        content: generated.content,
        tags: generated.tags,
        status: 'DRAFT',
      }),
    })
    if (!res.ok) {
      const err = await res.json().catch(() => ({}))
      toast.error((err as { error?: string }).error ?? 'Failed to create draft')
      return
    }
    const post = await res.json()
    toast.success('Draft created')
    router.push(`/coach/blog/${post.id}/edit`)
  }

  const buttonStyle = 'bg-[#5F728D] text-white rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide'

  return (
    <div>
      <AIGenerateDialog open={showAIDialog} onOpenChange={setShowAIDialog} onGenerate={handleGenerate} />

      <div className="flex justify-between items-center mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.875rem', color: '#1F1D1A' }}>
          My Posts
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIDialog(true)}
            className="flex items-center gap-1.5 rounded-full border border-[#5F728D] px-5 py-2 text-sm font-semibold uppercase tracking-wide text-[#5F728D] transition-colors hover:bg-[#5F728D] hover:text-white"
            style={{ fontFamily: 'Inter' }}
          >
            <Sparkles className="h-4 w-4" />
            Generate with AI
          </button>
          <Link href="/coach/blog/new" className={buttonStyle} style={{ fontFamily: 'Inter' }}>
            + New Post
          </Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-col items-center py-20">
          <p style={{ fontFamily: 'var(--font-serif-4)', fontSize: '1.125rem', color: '#6E6A60', marginBottom: '0.5rem' }}>
            You haven't written any posts yet.
          </p>
          <p style={{ fontSize: '0.875rem', color: '#6E6A60' }}>
            Start sharing your expertise with parents.
          </p>
          <Link href="/coach/blog/new" className={buttonStyle} style={{ fontFamily: 'Inter', marginTop: '1.5rem' }}>
            Write your first post
          </Link>
        </div>
      ) : (
        <PostTable
          posts={posts}
          role={role}
          onDelete={handleDelete}
          onTogglePublish={handleTogglePublish}
        />
      )}
    </div>
  )
}
