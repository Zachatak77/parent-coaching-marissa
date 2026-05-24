import { getAllPublishedPosts } from '@/lib/blog'
import { PostCard } from '@/components/blog/PostCard'
import { HeartRule } from '@/components/public/heart-rule'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog | Reimagine Parenting',
  description: 'Insights, tips, and guidance from our parent coaches.',
  openGraph: { type: 'website' },
}

export default async function BlogPage() {
  const posts = await getAllPublishedPosts()

  return (
    <section className="py-20 sm:py-24 px-6 sm:px-10 lg:px-16 bg-[#F7F7F5]">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-[680px] mx-auto text-center mb-14">
          <span className="inline-flex rounded-full px-5 py-1.5 bg-[#5F728D] text-white font-semibold text-xs uppercase tracking-[.18em]" style={{ fontFamily: 'Inter' }}>
            From the Blog
          </span>
          <h1
            className="font-bold text-[#1F1D1A] leading-[1.05] -tracking-[.02em] mt-4 mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.6rem, 6vw, 4.4rem)',
            }}
          >
            Insights for Intentional Parents
          </h1>
          <div className="flex justify-center mt-4">
            <HeartRule center />
          </div>
          <p
            className="text-[1.15rem] text-[#3A372F] leading-relaxed max-w-[560px] mx-auto mt-4"
            style={{ fontFamily: 'var(--font-serif-4)' }}
          >
            Evidence-based guidance, real stories, and practical tools for parents raising neurodiverse children.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center" style={{ fontFamily: 'var(--font-serif-4)' }}>
            <p className="text-[#6E6A60]">No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
