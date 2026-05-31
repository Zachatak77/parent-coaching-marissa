// Shared validation for POST /api/blog and PUT /api/blog/[id]
// Returns { data, error } — caller returns the error response or uses data.

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

export interface ValidatedPostBody {
  title: string
  content: string
  slug: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  scheduledAt: Date | null
  // optional fields — explicitly enumerated, no ...rest spread
  excerpt: string | undefined
  coverImage: string | undefined
  coverImageAlt: string | undefined
  tags: string[] | undefined
  seoTitle: string | undefined
  seoDescription: string | undefined
  seoKeywords: string[] | undefined
  canonicalUrl: string | undefined
  ogImage: string | undefined
  noIndex: boolean | undefined
}

export function validatePostBody(body: Record<string, unknown>): {
  data: ValidatedPostBody | null
  error: string | null
} {
  const {
    title, content, slug, status, scheduledAt,
    excerpt, coverImage, coverImageAlt, tags,
    seoTitle, seoDescription, seoKeywords,
    canonicalUrl, ogImage, noIndex,
  } = body

  // Required fields
  if (!title || typeof title !== 'string' || !title.trim())
    return { data: null, error: 'Title is required' }

  if (!content || typeof content !== 'string' || !content.replace(/<[^>]*>/g, '').trim())
    return { data: null, error: 'Content is required' }

  if (!slug || typeof slug !== 'string' || !slug.trim())
    return { data: null, error: 'Slug is required' }

  if (!SLUG_RE.test(slug as string))
    return { data: null, error: 'Slug must be lowercase letters, numbers, and hyphens only' }

  const validStatuses = ['DRAFT', 'PUBLISHED', 'ARCHIVED']
  if (!status || !validStatuses.includes(status as string))
    return { data: null, error: 'Invalid status' }

  // Optional: seoTitle
  if (seoTitle !== undefined && seoTitle !== null && seoTitle !== '') {
    if (typeof seoTitle !== 'string' || seoTitle.length > 60)
      return { data: null, error: 'SEO title must be 60 characters or less' }
  }

  // Optional: seoDescription
  if (seoDescription !== undefined && seoDescription !== null && seoDescription !== '') {
    if (typeof seoDescription !== 'string' || seoDescription.length > 160)
      return { data: null, error: 'SEO description must be 160 characters or less' }
  }

  // Optional: scheduledAt — must be in the future
  let scheduledAtDate: Date | null = null
  if (scheduledAt !== undefined && scheduledAt !== null && scheduledAt !== '') {
    scheduledAtDate = new Date(scheduledAt as string)
    if (isNaN(scheduledAtDate.getTime()))
      return { data: null, error: 'Invalid scheduledAt' }
    if (scheduledAtDate <= new Date())
      return { data: null, error: 'Scheduled time must be in the future' }
  }

  return {
    data: {
      title: (title as string).trim(),
      content: content as string,
      slug: (slug as string).trim(),
      status: status as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
      scheduledAt: scheduledAtDate,
      excerpt: typeof excerpt === 'string' ? excerpt : undefined,
      coverImage: typeof coverImage === 'string' ? coverImage : undefined,
      coverImageAlt: typeof coverImageAlt === 'string' ? coverImageAlt : undefined,
      tags: Array.isArray(tags) ? (tags as string[]).filter(t => typeof t === 'string') : undefined,
      seoTitle: typeof seoTitle === 'string' && seoTitle ? seoTitle : undefined,
      seoDescription: typeof seoDescription === 'string' && seoDescription ? seoDescription : undefined,
      seoKeywords: Array.isArray(seoKeywords) ? (seoKeywords as string[]).filter(k => typeof k === 'string') : undefined,
      canonicalUrl: typeof canonicalUrl === 'string' ? canonicalUrl : undefined,
      ogImage: typeof ogImage === 'string' ? ogImage : undefined,
      noIndex: typeof noIndex === 'boolean' ? noIndex : undefined,
    },
    error: null,
  }
}
