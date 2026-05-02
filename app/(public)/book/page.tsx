import type { Metadata } from 'next'
import { BookForm } from '@/components/public/book-form'

export const metadata: Metadata = {
  title: 'Book a Free Discovery Call | Reimagine Parenting',
  description:
    "Book a free, no-pressure discovery call with Marissa. Share what's going on at home and find out if coaching is the right fit for your family.",
}

const NAVY      = '#4A5F7F'
const NAVY_TINT = '#C8D1DF'
const CREAM     = '#F5EFE2'
const LINEN     = '#FAF5EA'
const TEXT      = '#1F1D1A'
const TEXT2     = '#3A372F'
const HAIRLINE  = '#D9CFB9'
const D = 'var(--font-display)'
const B = 'var(--font-body)'
const U = 'var(--font-ui)'

function Pill({ children }: { children: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '7px 22px 8px',
      background: NAVY, color: '#FAF5EA',
      borderRadius: 999,
      fontFamily: U, fontWeight: 600, fontSize: '0.72rem',
      letterSpacing: '.18em', textTransform: 'uppercase' as const,
    }}>
      {children}
    </span>
  )
}

function HeartRule() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: TEXT }}>
      <div style={{ height: 1, width: 80, background: TEXT, flexShrink: 0 }} />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M12 21s-7.5-4.6-9.5-10.2C1.2 7.4 3.7 4 7.1 4c2 0 3.6 1 4.9 2.6C13.3 5 14.9 4 16.9 4c3.4 0 5.9 3.4 4.6 6.8C19.5 16.4 12 21 12 21z"/>
      </svg>
      <div style={{ height: 1, width: 80, background: TEXT, flexShrink: 0 }} />
    </div>
  )
}

const trustItems = [
  {
    title: '20–30 minute call',
    desc: 'A relaxed conversation — not a sales pitch.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9"/>
        <polyline points="12 7 12 12 15 15"/>
      </svg>
    ),
  },
  {
    title: 'Share your situation',
    desc: "Tell me what's hard right now. I listen first.",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    title: 'No commitment',
    desc: 'You decide if coaching feels right. Zero pressure.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3 L19 6 V12 C19 16 16 19 12 21 C8 19 5 16 5 12 V6 Z"/>
      </svg>
    ),
  },
]

export default function BookPage() {
  return (
    <div style={{ background: CREAM, minHeight: '100vh' }}>

      {/* ── Header ── */}
      <section className="px-6 sm:px-10 lg:px-16 pt-16 sm:pt-20 pb-12 sm:pb-14" style={{ background: CREAM }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 20 }}><Pill>BOOK A CALL</Pill></div>
          <h1 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2.6rem, 6vw, 4.5rem)', lineHeight: 0.97, color: TEXT, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Let&apos;s talk about your family.
          </h1>
          <div style={{ margin: '0 0 24px' }}><HeartRule /></div>
          <p style={{ fontFamily: B, fontSize: '1.1rem', color: TEXT2, lineHeight: 1.6, margin: 0, maxWidth: 500 }}>
            This free call is a chance to share what&apos;s going on at home and see if coaching is a good fit. No pressure, no commitment.
          </p>
        </div>
      </section>

      {/* ── Main ── */}
      <section className="px-6 sm:px-10 lg:px-16 pb-24" style={{ background: CREAM }}>
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-10 items-start">

          {/* Form card */}
          <div className="lg:col-span-3" style={{ background: LINEN, borderRadius: 18, border: `1px solid ${HAIRLINE}`, padding: '36px 32px' }}>
            <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.7rem', lineHeight: 1.1, color: TEXT, margin: '0 0 24px' }}>
              Tell me about your family
            </h2>
            <BookForm />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Trust signals */}
            <div style={{ background: LINEN, borderRadius: 18, border: `1px solid ${HAIRLINE}`, padding: '28px 24px' }}>
              <h3 style={{ fontFamily: U, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: TEXT, margin: '0 0 22px' }}>What to expect</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                {trustItems.map(({ title, desc, icon }) => (
                  <div key={title} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: NAVY_TINT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {icon}
                    </div>
                    <div>
                      <p style={{ fontFamily: U, fontWeight: 600, fontSize: '0.88rem', color: TEXT, margin: '0 0 2px' }}>{title}</p>
                      <p style={{ fontFamily: B, fontSize: '0.84rem', color: TEXT2, margin: 0, lineHeight: 1.5 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quote */}
            <div style={{ background: NAVY, borderRadius: 18, padding: '28px 24px' }}>
              <p style={{ fontFamily: B, fontSize: '0.96rem', fontStyle: 'italic', color: 'rgba(250,245,234,0.88)', lineHeight: 1.65, margin: '0 0 16px' }}>
                &ldquo;I was nervous to reach out, but Marissa made me feel so at ease on our first call. I knew within five minutes it was exactly what I needed.&rdquo;
              </p>
              <p style={{ fontFamily: U, fontSize: '0.7rem', fontWeight: 600, letterSpacing: '.10em', textTransform: 'uppercase', color: 'rgba(250,245,234,0.4)', margin: 0 }}>— Parent, Montclair NJ</p>
            </div>

            {/* Email */}
            <p style={{ fontFamily: B, fontSize: '0.88rem', color: TEXT2, textAlign: 'center', margin: 0 }}>
              Prefer email?{' '}
              <a href="mailto:parentcoachwithmarissa@gmail.com" style={{ color: NAVY, fontWeight: 600, textDecoration: 'none' }}>
                parentcoachwithmarissa@gmail.com
              </a>
            </p>

          </div>
        </div>
      </section>

    </div>
  )
}
