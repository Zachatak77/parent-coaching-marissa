import type { Metadata } from 'next'
import { BookForm } from '@/components/public/book-form'
import { Reveal } from '@/components/public/reveal'
import { Eyebrow } from '@/components/public/motifs'

export const metadata: Metadata = {
  title: 'Book a Free Discovery Call | Reimagine Parenting',
  description:
    "Book a free, no-pressure discovery call with Marissa. Share what's going on at home and find out if coaching is the right fit for your family.",
}

const NAVY  = '#5F728D'
const INK2  = '#2C2A28'
const CREAM = '#F7F7F5'
const TEXT  = '#1F1D1A'
const TEXT2 = '#3A372F'
const SAGE  = '#9BB39B'
const D = 'var(--font-display)'
const B = 'var(--font-body)'
const U = 'var(--font-ui)'

const trustItems = [
  {
    title: '20–30 minute call',
    desc: 'A relaxed conversation — not a sales pitch.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <polyline points="12 7 12 12 15 15"/>
      </svg>
    ),
  },
  {
    title: 'Share your situation',
    desc: "Tell me what's hard right now. I listen first.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    title: 'No commitment',
    desc: 'You decide if coaching feels right. Zero pressure.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 L19 6 V12 C19 16 16 19 12 21 C8 19 5 16 5 12 V6 Z"/>
      </svg>
    ),
  },
]

export default function BookPage() {
  return (
    <div style={{ background: CREAM, minHeight: '100vh' }}>

      {/* ── Header ── */}
      <section aria-labelledby="book-hero" className="relative overflow-hidden px-6 sm:px-10 lg:px-16 pt-16 sm:pt-20 pb-12 sm:pb-14" style={{ background: '#FFFFFF' }}>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="rp-blob-1 absolute -top-32 -right-24 h-[380px] w-[380px] rounded-full opacity-[0.18] blur-3xl"
            style={{ background: `radial-gradient(circle at 35% 35%, ${NAVY}, transparent 70%)` }} />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <Reveal>
            <Eyebrow>Book a call</Eyebrow>
            <h1 id="book-hero" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', lineHeight: 1.02, letterSpacing: '-0.025em', color: TEXT, margin: '22px 0 18px' }}>
              Let&apos;s talk about your family.
            </h1>
            <p style={{ fontFamily: B, fontSize: '1.12rem', color: TEXT2, lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
              This free call is a chance to share what&apos;s going on at home and see if coaching is a good fit. No pressure, no commitment.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Main ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-14 sm:py-16 pb-24" style={{ background: CREAM }}>
        <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-5">

          {/* Form card */}
          <Reveal className="lg:col-span-3">
            <div className="rounded-2xl border bg-white p-8 sm:p-9 shadow-sm" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
              <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.7rem', lineHeight: 1.1, color: TEXT, margin: '0 0 24px' }}>
                Tell me about your family
              </h2>
              <BookForm />
            </div>
          </Reveal>

          {/* Sidebar */}
          <div className="flex flex-col gap-5 lg:col-span-2">

            {/* Trust signals */}
            <Reveal delay={120}>
              <div className="rounded-2xl border bg-white p-7" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
                <h3 style={{ fontFamily: U, fontWeight: 700, fontSize: '0.74rem', letterSpacing: '.16em', textTransform: 'uppercase', color: TEXT, margin: '0 0 22px' }}>What to expect</h3>
                <div className="flex flex-col gap-5">
                  {trustItems.map(({ title, desc, icon }) => (
                    <div key={title} className="flex items-start gap-4">
                      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full" style={{ background: SAGE }}>
                        {icon}
                      </div>
                      <div>
                        <p style={{ fontFamily: U, fontWeight: 600, fontSize: '0.9rem', color: TEXT, margin: '0 0 2px' }}>{title}</p>
                        <p style={{ fontFamily: B, fontSize: '0.86rem', color: TEXT2, margin: 0, lineHeight: 1.5 }}>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Quote */}
            <Reveal delay={220}>
              <div className="rounded-2xl p-7" style={{ background: INK2 }}>
                <p style={{ fontFamily: B, fontSize: '0.98rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.88)', lineHeight: 1.65, margin: '0 0 16px' }}>
                  &ldquo;I was nervous to reach out, but Marissa made me feel so at ease on our first call. I knew within five minutes it was exactly what I needed.&rdquo;
                </p>
                <p style={{ fontFamily: U, fontSize: '0.68rem', fontWeight: 600, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: 0 }}>— Parent, Montclair NJ</p>
              </div>
            </Reveal>

            {/* Email */}
            <Reveal delay={300}>
              <p style={{ fontFamily: B, fontSize: '0.88rem', color: TEXT2, textAlign: 'center', margin: 0 }}>
                Prefer email?{' '}
                <a href="mailto:parentcoachwithmarissa@gmail.com" style={{ color: NAVY, fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  parentcoachwithmarissa@gmail.com
                </a>
              </p>
            </Reveal>

          </div>
        </div>
      </section>

    </div>
  )
}
