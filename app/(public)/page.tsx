import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Reimagine Parenting | More Calm. More Confidence. More Connection.',
  description:
    'Parent coaching for families navigating challenging behavior. Work with Marissa — a special-education teacher specializing in neurodiverse children ages 3–12.',
}

/* ── Design tokens ─────────────────────────────────── */
const NAVY      = '#4A5F7F'
const NAVY_TINT = '#C8D1DF'
const CREAM     = '#F5EFE2'
const LINEN     = '#FAF5EA'
const CHAR      = '#2C2A28'
const TEXT      = '#1F1D1A'
const TEXT2     = '#3A372F'
const HAIRLINE  = '#D9CFB9'

const D = 'var(--font-display)'
const B = 'var(--font-body)'
const U = 'var(--font-ui)'

/* ── Shared components ─────────────────────────────── */
function Pill({ children, char, cream }: { children: string; char?: boolean; cream?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '7px 22px 8px',
      background: cream ? '#FAF5EA' : char ? CHAR : NAVY,
      color: cream ? TEXT : '#FAF5EA',
      borderRadius: 999,
      fontFamily: U, fontWeight: 600, fontSize: '0.72rem',
      letterSpacing: '.18em', textTransform: 'uppercase' as const,
    }}>
      {children}
    </span>
  )
}

function HeartRule({ light, center }: { light?: boolean; center?: boolean }) {
  const c = light ? '#FAF5EA' : TEXT
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: center ? 'center' : 'flex-start', gap: 14, color: c }}>
      <div style={{ height: 1, width: 80, background: c, flexShrink: 0 }} />
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
        <path d="M12 21s-7.5-4.6-9.5-10.2C1.2 7.4 3.7 4 7.1 4c2 0 3.6 1 4.9 2.6C13.3 5 14.9 4 16.9 4c3.4 0 5.9 3.4 4.6 6.8C19.5 16.4 12 21 12 21z"/>
      </svg>
      <div style={{ height: 1, width: 80, background: c, flexShrink: 0 }} />
    </div>
  )
}

function SecHead({ pill, title, lede }: { pill: string; title: React.ReactNode; lede?: string }) {
  return (
    <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 56px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <Pill>{pill}</Pill>
      </div>
      <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05, color: TEXT, letterSpacing: '-0.015em', margin: '0 0 20px' }}>
        {title}
      </h2>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: lede ? 20 : 0 }}>
        <HeartRule center />
      </div>
      {lede && <p style={{ fontFamily: B, fontSize: '1.1rem', color: TEXT2, lineHeight: 1.55, margin: 0 }}>{lede}</p>}
    </div>
  )
}

/* ── Page ──────────────────────────────────────────── */
export default function HomePage() {
  return (
    <div style={{ background: CREAM }}>

      {/* ── 1. Hero ── */}
      <section style={{ position: 'relative', overflow: 'hidden', background: CREAM }}>
        {/* corner blob */}
        <svg aria-hidden style={{ position: 'absolute', top: 0, right: 0, width: 240, height: 240, pointerEvents: 'none' }} viewBox="0 0 200 200">
          <path fill="#4A5F7F" opacity="0.14" d="M200 0 L200 120 C150 100 110 60 90 0 Z"/>
        </svg>

        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24">
          <div style={{ maxWidth: 600 }}>
            <div style={{ marginBottom: 20 }}><Pill>REIMAGINE</Pill></div>
            <h1 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(3.6rem, 9vw, 7rem)', lineHeight: 0.95, color: TEXT, margin: '0 0 14px', letterSpacing: '-0.02em' }}>
              Parenting
            </h1>
            <div style={{ margin: '20px 0 24px' }}><HeartRule /></div>
            <h2 style={{ fontFamily: D, fontWeight: 600, fontSize: '1.15rem', letterSpacing: '.10em', textTransform: 'uppercase', color: TEXT, margin: '0 0 18px', lineHeight: 1.35 }}>
              Take charge of parenting<br />in your home
            </h2>
            <p style={{ fontFamily: B, fontSize: '1.1rem', color: TEXT2, lineHeight: 1.6, maxWidth: 460, margin: '0 0 36px' }}>
              You don&apos;t have to do it alone. I&apos;m here to help you feel confident, supported, and in control.
            </p>
            <Link
              href="/book"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '15px 32px', background: NAVY, color: '#FAF5EA', borderRadius: 999, fontFamily: U, fontWeight: 600, fontSize: '0.84rem', letterSpacing: '.16em', textTransform: 'uppercase', textDecoration: 'none' }}
            >
              BOOK YOUR FREE CALL →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 2. Tagline ribbon ── */}
      <div style={{ background: NAVY, color: '#FAF5EA', padding: '20px 24px', textAlign: 'center', fontFamily: U, fontWeight: 600, fontSize: '0.88rem', letterSpacing: '.26em', textTransform: 'uppercase' }}>
        <span style={{ display: 'block' }}>
          SUPPORT{' '}
          <span style={{ color: NAVY_TINT, margin: '0 14px', fontSize: '1.1rem', verticalAlign: '-2px' }}>•</span>
          {' '}STRATEGY
        </span>
        <span style={{ display: 'block' }}>CONFIDENCE</span>
      </div>

      {/* ── 3. Services ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-28" style={{ background: LINEN }}>
        <SecHead
          pill="PARENT COACHING"
          title="How I can help"
          lede="Three ways to get the support that fits your family — from one-time consults to ongoing partnership."
        />
        <div className="grid grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto">
          {[
            {
              title: 'Parent Coach Consultant',
              body: 'Everyday parenting support — grounded in expertise, delivered with compassion.',
            },
            {
              title: '1:1 Support',
              body: 'A behavior plan created based on individual needs for your family and child.',
            },
            {
              title: 'Ongoing Services',
              body: 'Access ongoing email check-ins designed to support your family week to week.',
            },
          ].map(({ title, body }, i) => (
            <div key={title} style={{ padding: '0 32px', textAlign: 'center', borderRight: i < 2 ? `1px solid ${HAIRLINE}` : 'none' }} className="mb-10 sm:mb-0">
              <h3 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.65rem', lineHeight: 1.1, color: TEXT, margin: '0 0 14px' }}>{title}</h3>
              <p style={{ fontFamily: B, fontSize: '1rem', color: TEXT2, lineHeight: 1.55, margin: '0 0 18px' }}>{body}</p>
              <Link href="/services" style={{ fontFamily: U, fontWeight: 600, fontSize: '0.72rem', letterSpacing: '.16em', textTransform: 'uppercase', color: NAVY, textDecoration: 'none' }}>
                LEARN MORE →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. About Marissa ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-28" style={{ background: CREAM }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-start', marginBottom: 24 }}>
            <Pill>REIMAGINE</Pill>
            <Pill char>HI, I&apos;M MARISSA</Pill>
          </div>
          <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', lineHeight: 1.1, color: TEXT, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
            I help parents feel more calm, confident, and in control.
          </h2>
          <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.6, margin: '0 0 16px' }}>
            Parenting can feel overwhelming, but you don&apos;t have to figure it out alone. I&apos;m here to guide you with practical strategies that work for your family.
          </p>
          <Link href="/about" style={{ fontFamily: U, fontWeight: 600, fontSize: '0.72rem', letterSpacing: '.16em', textTransform: 'uppercase', color: NAVY, textDecoration: 'none' }}>
            MEET MARISSA →
          </Link>
          {/* Info ribbon */}
          <div style={{ background: NAVY_TINT, borderRadius: 22, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center', marginTop: 28 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: CHAR, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg viewBox="0 0 100 100" width="26" height="26" fill="none" stroke="#FAF5EA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="50" cy="38" r="13"/>
                <path d="M22 80 C22 64 34 56 50 56 C66 56 78 64 78 80"/>
              </svg>
            </div>
            <p style={{ fontFamily: B, fontSize: '0.94rem', lineHeight: 1.4, color: TEXT, margin: 0 }}>
              Special education teacher with 10+ years working with neurodiverse children ages 3–12.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. Outcomes ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-28" style={{ background: LINEN }}>
        <SecHead
          pill="PARENT COACHING CAN HELP YOU"
          title={<>Small shifts today.<br />Big changes tomorrow.</>}
        />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-9 max-w-5xl mx-auto">
          {[
            {
              name: 'Reduce\npower struggles',
              icon: <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4 C8 4 5 7 5 11 C5 14 7 16 7 18 L17 18 C17 16 19 14 19 11 C19 7 16 4 12 4 Z"/><line x1="12" y1="4" x2="12" y2="18"/></svg>,
            },
            {
              name: 'Build routines\nthat actually work',
              icon: <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="6" width="16" height="14" rx="1.5"/><line x1="4" y1="10" x2="20" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>,
            },
            {
              name: 'Feel more\nconfident',
              icon: <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 L19 6 V12 C19 16 16 19 12 21 C8 19 5 16 5 12 V6 Z"/></svg>,
            },
            {
              name: 'Strengthen\nyour connection',
              icon: <svg viewBox="0 0 24 24" width="38" height="38" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="3"/><circle cx="16" cy="11" r="2.4"/><path d="M3 19 C3 16 5.5 14 9 14 C12.5 14 15 16 15 19"/><path d="M14 19 C14 17 16 15.5 18.5 15.5"/></svg>,
            },
          ].map(({ name, icon }) => (
            <div key={name} style={{ textAlign: 'center' }}>
              <div style={{ width: 80, height: 80, borderRadius: '50%', background: NAVY_TINT, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', color: TEXT }}>
                {icon}
              </div>
              <p style={{ fontFamily: B, fontSize: '1rem', color: TEXT, lineHeight: 1.4, margin: 0, whiteSpace: 'pre-line' }}>{name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6. Final CTA ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24 lg:py-28" style={{ background: NAVY, textAlign: 'center', color: '#FAF5EA' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Pill cream>REIMAGINE</Pill>
        </div>
        <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2.2rem, 5vw, 3.4rem)', lineHeight: 1.05, color: '#FAF5EA', margin: '0 0 20px', letterSpacing: '-0.015em' }}>
          You&apos;re not doing<br />it wrong.
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <HeartRule light center />
        </div>
        <p style={{ fontFamily: B, fontSize: '1.1rem', color: '#E0D9C7', lineHeight: 1.55, maxWidth: 520, margin: '0 auto 36px' }}>
          You just need the right tools, support, and strategies that actually work for your child and your family.
        </p>
        <Link
          href="/book"
          style={{ display: 'inline-flex', alignItems: 'center', padding: '15px 36px', background: '#FAF5EA', color: TEXT, borderRadius: 999, fontFamily: U, fontWeight: 600, fontSize: '0.84rem', letterSpacing: '.16em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          BOOK YOUR FREE CALL →
        </Link>
      </section>

    </div>
  )
}
