import { getAllPublishedPosts } from '@/lib/blog'
import { PostCard } from '@/components/blog/PostCard'
import { Reveal } from '@/components/public/reveal'
import { Eyebrow } from '@/components/public/motifs'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reimagineparenting.co'

export const metadata: Metadata = {
  title: 'Blog | Reimagine Parenting',
  description: 'Insights, tips, and guidance from our parent coaches.',
  openGraph: { type: 'website' },
  alternates: {
    types: { 'application/rss+xml': `${SITE_URL}/api/rss` },
  },
}

export default async function BlogPage() {
  const posts = await getAllPublishedPosts()

  return (
    <section className="py-20 sm:py-24 px-6 sm:px-10 lg:px-16 bg-[#F7F7F5]">
      <div className="max-w-6xl mx-auto">
        <Reveal>
          <div className="max-w-2xl mb-14">
            <Eyebrow>From the blog</Eyebrow>
            <h1
              className="font-bold text-[#1F1D1A] leading-[1.05] -tracking-[.02em] mt-5 mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.6rem, 6vw, 4.4rem)',
              }}
            >
              Insights for intentional parents
            </h1>
            <p
              className="text-[1.15rem] text-[#3A372F] leading-relaxed max-w-[560px]"
              style={{ fontFamily: 'var(--font-serif-4)' }}
            >
              Evidence-based guidance, real stories, and practical tools for parents raising neurodiverse children.
            </p>
          </div>
        </Reveal>

        {posts.length === 0 ? (
          <div style={{ fontFamily: 'var(--font-serif-4)' }}>
            <p className="text-[#6E6A60]">No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={(i % 3) * 100}>
                <PostCard post={post} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
