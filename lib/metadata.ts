import type { Metadata } from 'next'
type BlogPost = {
  id: string; title: string; slug: string; content: string
  excerpt: string | null; status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  authorId: string; coverImage: string | null; coverImageAlt: string | null
  seoTitle: string | null; seoDescription: string | null; seoKeywords: string[]
  canonicalUrl: string | null; ogImage: string | null; noIndex: boolean
  tags: string[]; publishedAt: Date | null; createdAt: Date; updatedAt: Date
}

export function generatePostMetadata(
  post: BlogPost & { author: { fullName: string | null } },
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
