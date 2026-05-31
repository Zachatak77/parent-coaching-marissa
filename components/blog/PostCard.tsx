'use client'

import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    coverImage: string | null
    coverImageAlt: string | null
    tags: string[]
    publishedAt: Date | null
    author: { id: string; fullName: string | null }
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block no-underline">
      <div className="overflow-hidden rounded-[20px] border border-[#D9CFB9] bg-white transition-shadow hover:shadow-md">
        {post.coverImage && (
          <div className="relative aspect-video w-full">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        )}
        <div className="space-y-3 p-6">
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-[#F2EBDA] px-2 py-0.5 font-[Inter] text-xs font-semibold uppercase tracking-wide text-[#6E6A60]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h2
            className="line-clamp-2 font-bold text-xl leading-snug text-[#1F1D1A]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {post.title}
          </h2>

          {post.excerpt && (
            <p
              className="line-clamp-2 text-[0.98rem] leading-relaxed text-[#3A372F]"
              style={{ fontFamily: 'var(--font-serif-4)' }}
            >
              {post.excerpt}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between border-t border-[#D9CFB9] pt-4">
            <span className="font-[Inter] text-xs text-[#6E6A60]">
              {post.author.fullName || 'Marissa'}
            </span>
            {post.publishedAt && (
              <span className="font-[Inter] text-xs text-[#6E6A60]">
                {format(post.publishedAt, 'MMM d, yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
