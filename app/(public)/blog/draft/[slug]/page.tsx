import { getPostBySlugPreview } from '@/lib/blog'
import { sanitizeHtml } from '@/lib/sanitize'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { HeartRule } from '@/components/public/heart-rule'
import type { Metadata } from 'next'

// Minimal markdown renderer — fallback for legacy posts stored as markdown
function renderInline(text: string) {
  const parts: React.ReactNode[] = []
  const re = /\*\*(.+?)\*\*|\*(.+?)\*/g
  let last = 0, m: RegExpExecArray | null, k = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    parts.push(m[1] ? <strong key={k++}>{m[1]}</strong> : <em key={k++}>{m[2]}</em>)
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

function MarkdownContent({ content }: { content: string }) {
  const nodes: React.ReactNode[] = []
  const listBuf: React.ReactNode[] = []
  let listKind: 'ul' | 'ol' | null = null
  let key = 0

  function flush() {
    if (!listKind || !listBuf.length) return
    nodes.push(
      listKind === 'ul'
        ? <ul key={key++} className="list-disc pl-6 mb-4 space-y-1">{[...listBuf]}</ul>
        : <ol key={key++} className="list-decimal pl-6 mb-4 space-y-1">{[...listBuf]}</ol>
    )
    listBuf.length = 0
    listKind = null
  }

  for (const line of content.split('\n')) {
    const bullet  = line.match(/^-\s+(.+)/)
    const ordered = line.match(/^\d+\.\s+(.+)/)
    const h2      = line.match(/^##\s+(.+)/)
    const h3      = line.match(/^###\s+(.+)/)

    if (bullet) {
      if (listKind !== 'ul') { flush(); listKind = 'ul' }
      listBuf.push(<li key={key++}>{renderInline(bullet[1])}</li>)
    } else if (ordered) {
      if (listKind !== 'ol') { flush(); listKind = 'ol' }
      listBuf.push(<li key={key++}>{renderInline(ordered[1])}</li>)
    } else {
      flush()
      if (h2) nodes.push(<h2 key={key++} className="text-2xl font-bold mb-3 mt-8" style={{ fontFamily: 'var(--font-display)' }}>{renderInline(h2[1])}</h2>)
      else if (h3) nodes.push(<h3 key={key++} className="text-xl font-semibold mb-2 mt-6" style={{ fontFamily: 'var(--font-display)' }}>{renderInline(h3[1])}</h3>)
      else if (line.trim()) nodes.push(<p key={key++} className="mb-4">{renderInline(line)}</p>)
    }
  }
  flush()
  return <>{nodes}</>
}

export const dynamic = 'force-dynamic'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  try {
    const post = await getPostBySlugPreview(slug)
    if (!post) return {}
    return {
      title: `[Draft] ${post.title}`,
      robots: { index: false, follow: false },
    }
  } catch {
    return {}
  }
}

export default async function DraftPreviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlugPreview(slug).catch(() => null)
  if (!post) notFound()

  const plainText = post.content.replace(/<[^>]*>/g, ' ').trim()
  const wordCount = plainText.split(/\s+/).filter(Boolean).length
  const readTime = Math.max(1, Math.ceil(wordCount / 200))

  return (
    <div className="max-w-3xl mx-auto px-6 sm:px-10 py-12 sm:py-16">
      {/* Draft banner */}
      <div className="mb-8 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800" style={{ fontFamily: 'Inter' }}>
        <strong>Draft Preview</strong> — This post has not been published. Only people with this link can see it.
      </div>

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

      {/* Author + read time */}
      <div
        className="flex items-center gap-3 text-sm text-[#6E6A60]"
        style={{ fontFamily: 'Inter' }}
      >
        <span>{post.author.fullName || 'Marissa'}</span>
        <span>·</span>
        <span>{readTime} min read</span>
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
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="text-[1.05rem] text-[#3A372F] leading-[1.6]"
        style={{ fontFamily: 'var(--font-serif-4)' }}
      >
        {post.content.trim().startsWith('<') ? (
          <div
            className={[
              '[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mb-3 [&_h2]:mt-8',
              '[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mb-2 [&_h3]:mt-6',
              '[&_p]:mb-4',
              '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1',
              '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1',
              '[&_strong]:font-bold',
              '[&_em]:italic',
            ].join(' ')}
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
          />
        ) : (
          <MarkdownContent content={post.content} />
        )}
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
  )
}
