'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { PostTable } from '@/components/blog/PostTable'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Reveal } from '@/components/public/reveal'
import { PageHeader } from '@/components/dashboard/ui/page-header'
import { LiftCard } from '@/components/dashboard/ui/lift-card'

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
      setLocalPosts(prev => prev.map(p => p.id === id ? { ...p, ...updated } : p))
      toast.success('Status updated')
    } else {
      const err = await res.json().catch(() => ({}))
      toast.error(err.error ?? 'Failed to update status. Please try again.')
    }
  }

  const buttonStyle = 'bg-[#5F728D] text-white rounded-full px-5 py-2 text-sm font-semibold uppercase tracking-wide'

  const statCards = [
    { label: 'Total', count: localPosts.length, accent: 'var(--navy)' },
    { label: 'Published', count: localPosts.filter(p => p.status === 'PUBLISHED').length, accent: 'var(--sage)' },
    { label: 'Drafts', count: localPosts.filter(p => p.status === 'DRAFT').length, accent: 'var(--straw)' },
    { label: 'Archived', count: localPosts.filter(p => p.status === 'ARCHIVED').length, accent: 'var(--peach)' },
  ]

  return (
    <div>
      <Reveal>
        <PageHeader
          eyebrow="Writing"
          title="All Posts"
          actions={
            <Link href="/coach/blog/new" className={buttonStyle} style={{ fontFamily: 'Inter' }}>
              + New Post
            </Link>
          }
        />
      </Reveal>

      <Reveal delay={80}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map(card => (
            <LiftCard key={card.label} accent={card.accent}>
              <div className="p-5 text-center">
                <div className="font-cormorant text-3xl font-semibold text-[#1F1D1A]">
                  {card.count}
                </div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#6E6A60' }}>
                  {card.label}
                </div>
              </div>
            </LiftCard>
          ))}
        </div>
      </Reveal>

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
