import { getPostBySlug, getAllPublishedPosts } from '@/lib/blog'
import { generatePostMetadata } from '@/lib/metadata'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { HeartRule } from '@/components/public/heart-rule'
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reimagineparenting.co'

export async function generateStaticParams() {
  const posts = await getAllPublishedPosts()
  return posts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return generatePostMetadata(post as any, SITE_URL)
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seoDescription || post.excerpt || '',
    image: post.ogImage || post.coverImage || `${SITE_URL}/og-default.png`,
    url: post.canonicalUrl || `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt?.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.fullName || 'Marissa',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Reimagine Parenting',
      url: SITE_URL,
    },
    keywords: post.seoKeywords?.join(', '),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="text-sm text-[#6E6A60] hover:text-[#1F1D1A] flex items-center gap-1 mb-8 no-underline"
          style={{ fontFamily: 'Inter' }}
        >
          ← Back to Blog
        </Link>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-[#F2EBDA] px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-[#6E6A60]"
                style={{ fontFamily: 'Inter' }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1
          className="font-bold text-[#1F1D1A] leading-[1.05] -tracking-[.015em] mt-4 mb-6"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
          }}
        >
          {post.title}
        </h1>

        {/* Author + date */}
        <div
          className="flex items-center gap-3 text-sm text-[#6E6A60]"
          style={{ fontFamily: 'Inter' }}
        >
          <span>{post.author.fullName || 'Marissa'}</span>
          <span>·</span>
          {post.publishedAt && (
            <span>{format(post.publishedAt, 'MMMM d, yyyy')}</span>
          )}
        </div>

        {/* Heart rule */}
        <div className="mt-6 mb-8">
          <HeartRule />
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-[20px] mb-10">
            <Image
              src={post.coverImage}
              alt={post.coverImageAlt || post.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="text-[1.05rem] text-[#3A372F] leading-[1.6] space-y-4 whitespace-pre-wrap"
          style={{ fontFamily: 'var(--font-serif-4)' }}
        >
          {post.content}
        </div>

        {/* Footer */}
        <div className="border-t border-[#D9CFB9] mt-12 pt-8">
          <Link
            href="/blog"
            className="text-sm text-[#6E6A60] hover:text-[#1F1D1A] no-underline"
            style={{ fontFamily: 'Inter' }}
          >
            ← Back to all posts
          </Link>
        </div>
      </div>
    </>
  )
}
