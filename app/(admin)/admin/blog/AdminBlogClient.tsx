'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { PostTable } from '@/components/blog/PostTable'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface Post {
  id: string
  title: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  authorId: string
  createdAt: Date
  publishedAt: Date | null
  author: { id: string; fullName: string | null }
}

interface Props {
  posts: Post[]
}

export function AdminBlogClient({ posts: initialPosts }: Props) {
  const [localPosts, setLocalPosts] = useState(initialPosts)
  const [statusFilter, setStatusFilter] = useState<'' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'>('')
  const [search, setSearch] = useState('')

  const filteredPosts = useMemo(() => {
    let result = localPosts
    if (statusFilter) {
      result = result.filter(p => p.status === statusFilter)
    }
    if (search) {
      const lower = search.toLowerCase()
      result = result.filter(p => p.title.toLowerCase().includes(lower))
    }
    return result
  }, [localPosts, statusFilter, search])

  async function handleDelete(id: string) {
    const res = await fetch(`/api/blog/${id}`, { method: 'DELETE' })
    if (res.ok) {
      setLocalPosts(prev => prev.filter(p => p.id !== id))
    }
  }

  async function handleTogglePublish(id: string) {
    const res = await fetch(`/api/blog/publish/${id}`, { method: 'PUT' })
    if (res.ok) {
      const updated = await res.json()
      setLocalPosts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p))
    }
  }

  const buttonStyle = 'bg-[#5F728D] text-white rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide'

  const statCards = [
    { label: 'Total', count: localPosts.length },
    { label: 'Published', count: localPosts.filter(p => p.status === 'PUBLISHED').length },
    { label: 'Drafts', count: localPosts.filter(p => p.status === 'DRAFT').length },
    { label: 'Archived', count: localPosts.filter(p => p.status === 'ARCHIVED').length },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.875rem', color: '#1F1D1A' }}>
          All Posts
        </h1>
        <Link href="/coach/blog/new" className={buttonStyle} style={{ fontFamily: 'Inter' }}>
          + New Post
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {statCards.map(card => (
          <div key={card.label} className="bg-white border border-[#D9CFB9] rounded-[20px] p-5 text-center">
            <div style={{ fontSize: '1.875rem', fontFamily: 'var(--font-display)', fontWeight: 700, color: '#1F1D1A' }}>
              {card.count}
            </div>
            <div style={{ fontSize: '0.75rem', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6E6A60' }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 mb-6 flex-wrap">
        <Input
          placeholder="Search posts..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={val => setStatusFilter(val as '' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED')}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="PUBLISHED">Published</SelectItem>
            <SelectItem value="ARCHIVED">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <PostTable
        posts={filteredPosts}
        role="admin"
        onDelete={handleDelete}
        onTogglePublish={handleTogglePublish}
      />
    </div>
  )
}
