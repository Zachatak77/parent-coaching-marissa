import type { Metadata } from 'next'
import type { Prisma } from '@prisma/client'

type BlogPostWithAuthor = Prisma.BlogPostGetPayload<{
  include: { author: { select: { id: true; fullName: true } } }
}>

export function generatePostMetadata(
  post: BlogPostWithAuthor,
  siteUrl: string,
): Metadata {
  const title = post.seoTitle || post.title
  const description = post.seoDescription || post.excerpt || ''
  const image = post.ogImage || post.coverImage || `${siteUrl}/og-default.png`
  const url = post.canonicalUrl || `${siteUrl}/blog/${post.slug}`
  const robots = post.noIndex ? 'noindex,nofollow' : 'index,follow'

  return {
    title,
    description,
    keywords: post.seoKeywords,
    robots,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: post.author.fullName ? [post.author.fullName] : [],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.coverImageAlt || title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}
