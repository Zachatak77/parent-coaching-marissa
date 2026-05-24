'use client'

import { useState } from 'react'
import Link from 'next/link'
import { PostTable } from '@/components/blog/PostTable'

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
  const [posts, setPosts] = useState(initialPosts)

  async function handleDelete(id: string) {
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setPosts(prev => prev.filter(p => p.id !== id))
    }
  }

  const buttonStyle = 'bg-[#5F728D] text-white rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide'

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.875rem', color: '#1F1D1A' }}>
          My Posts
        </h1>
        <Link href="/coach/blog/new" className={buttonStyle} style={{ fontFamily: 'Inter' }}>
          + New Post
        </Link>
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
        />
      )}
    </div>
  )
}
