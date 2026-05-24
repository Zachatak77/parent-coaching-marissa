'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { Pencil, Eye, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import { StatusBadge } from './StatusBadge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface PostTableProps {
  posts: Array<{
    id: string
    title: string
    slug: string
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    authorId: string
    createdAt: Date
    publishedAt: Date | null
    scheduledAt: Date | string | null
    author: { id: string; fullName: string | null }
  }>
  role: 'coach' | 'admin'
  onDelete: (id: string) => void
  onTogglePublish?: (id: string) => void
}

export function PostTable({ posts, role, onDelete, onTogglePublish }: PostTableProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const editBasePath = role === 'admin' ? '/admin' : '/coach'

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-[640px] w-full text-sm">
          <thead className="border-b border-[#D9CFB9] bg-[#F7F7F5]">
            <tr>
              <th className="px-4 py-3 text-left font-[Inter] font-semibold text-xs uppercase tracking-wide text-[#6E6A60]">
                Title
              </th>
              {role === 'admin' && (
                <th className="px-4 py-3 text-left font-[Inter] font-semibold text-xs uppercase tracking-wide text-[#6E6A60]">
                  Author
                </th>
              )}
              <th className="px-4 py-3 text-left font-[Inter] font-semibold text-xs uppercase tracking-wide text-[#6E6A60]">
                Status
              </th>
              <th className="px-4 py-3 text-left font-[Inter] font-semibold text-xs uppercase tracking-wide text-[#6E6A60]">
                Date
              </th>
              <th className="px-4 py-3 text-left font-[Inter] font-semibold text-xs uppercase tracking-wide text-[#6E6A60]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9CFB9]">
            {posts.map((post) => (
              <tr key={post.id} className="transition-colors hover:bg-[#F7F7F5]">
                <td className="px-4 py-3">
                  <Link
                    href={`${editBasePath}/blog/${post.id}/edit`}
                    className="font-medium text-[#1F1D1A] underline-offset-2 hover:text-[#5F728D] hover:underline"
                  >
                    {post.title}
                  </Link>
                </td>
                {role === 'admin' && (
                  <td className="px-4 py-3 text-[#3A372F]">
                    {post.author.fullName || '—'}
                  </td>
                )}
                <td className="px-4 py-3">
                  <StatusBadge status={post.status} scheduledAt={post.scheduledAt} />
                  {post.scheduledAt && post.status === 'DRAFT' && new Date(post.scheduledAt) > new Date() && (
                    <p className="text-xs text-[#5F728D] mt-0.5">
                      {new Date(post.scheduledAt).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3 text-[#6E6A60]">
                  {format(post.publishedAt || post.createdAt, 'MMM d, yyyy')}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {/* Edit */}
                    <Link
                      href={`${editBasePath}/blog/${post.id}/edit`}
                      className="rounded p-1.5 transition-colors hover:bg-[#F2EBDA]"
                    >
                      <Pencil className="h-4 w-4 text-[#6E6A60]" />
                    </Link>

                    {/* Preview (published only) */}
                    {post.status === 'PUBLISHED' && (
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded p-1.5 transition-colors hover:bg-[#F2EBDA]"
                      >
                        <Eye className="h-4 w-4 text-[#6E6A60]" />
                      </a>
                    )}

                    {/* Toggle publish (admin only) */}
                    {role === 'admin' && onTogglePublish && (
                      <button
                        type="button"
                        onClick={() => onTogglePublish(post.id)}
                        className="rounded p-1.5 transition-colors hover:bg-[#F2EBDA]"
                      >
                        {post.status === 'PUBLISHED' ? (
                          <ToggleRight className="h-4 w-4 text-[#9BB39B]" />
                        ) : (
                          <ToggleLeft className="h-4 w-4 text-[#D9CFB9]" />
                        )}
                      </button>
                    )}

                    {/* Delete */}
                    {role === 'coach' && post.status === 'PUBLISHED' ? (
                      <button
                        type="button"
                        disabled
                        title="Published posts cannot be deleted"
                        className="cursor-not-allowed rounded p-1.5 opacity-30"
                      >
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(post.id)}
                        className="rounded p-1.5 transition-colors hover:bg-[#F2EBDA]"
                      >
                        <Trash2 className="h-4 w-4 text-red-400 hover:text-red-600" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteConfirmId !== null} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this post? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (deleteConfirmId) {
                  onDelete(deleteConfirmId)
                  setDeleteConfirmId(null)
                }
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
