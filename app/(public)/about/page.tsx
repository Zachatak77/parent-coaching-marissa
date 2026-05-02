import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Marissa | Reimagine Parenting',
  description:
    'Learn about Marissa, her story, her coaching philosophy, and why she became a certified parent coach dedicated to helping families thrive.',
}

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

function Pill({ children, char, cream }: { children: string; char?: boolean; cream?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '7px 22px 8px',
      background: cream ? LINEN : char ? CHAR : NAVY,
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

export default function AboutPage() {
  return (
    <div style={{ background: CREAM }}>

      {/* ── Hero ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24" style={{ background: CREAM }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 20 }}><Pill>YOUR COACH</Pill></div>
          <h1 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 0.95, color: TEXT, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Hi, I&apos;m Marissa.
          </h1>
          <div style={{ margin: '0 0 28px' }}><HeartRule /></div>
          <p style={{ fontFamily: B, fontSize: '1.15rem', color: TEXT2, lineHeight: 1.6, margin: 0 }}>
            I help parents feel more confident, connected, and calm — even on the hard days.
          </p>
        </div>
      </section>

      {/* ── My Story ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24" style={{ background: LINEN }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ marginBottom: 16 }}><Pill>MY STORY</Pill></div>
            <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.05, color: TEXT, margin: '0 0 20px', letterSpacing: '-0.015em' }}>
              Why I became a parent coach
            </h2>
            <HeartRule />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.65, margin: 0 }}>
              I didn&apos;t always have the answers. Like so many parents, I found myself cycling through the same
              struggles — the power struggles at bedtime, the meltdowns over nothing, the feeling that no matter
              what I tried, nothing was working. I remember sitting in my car one afternoon, exhausted, wondering
              if I was just doing it all wrong.
            </p>
            <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.65, margin: 0 }}>
              What I discovered — slowly, through research, training, and eventually my own coaching journey —
              is that most parents aren&apos;t failing. They&apos;re just missing a few specific tools. The kind
              that are actually designed for real life, with real kids, in real families. Not Instagram perfection.
              Not textbook theories. Real strategies.
            </p>
            <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.65, margin: 0 }}>
              That&apos;s what drew me to parent coaching. I became certified because I wanted to help other families
              find what I found: a way through the hard days that actually feels sustainable. My approach blends
              proven coaching methods with genuine compassion — because the best strategy in the world won&apos;t
              work if you don&apos;t feel understood first.
            </p>
          </div>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24" style={{ background: CREAM }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 52px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><Pill>HOW I WORK</Pill></div>
          <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05, color: TEXT, margin: '0 0 20px', letterSpacing: '-0.015em' }}>
            My coaching philosophy
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center' }}><HeartRule center /></div>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              title: 'Connection first',
              body: 'Before strategies, before scripts — you need to feel heard and understood. Every session starts with you, not a checklist.',
            },
            {
              title: 'Real-life strategies',
              body: "Everything I share is practical, age-appropriate, and designed for actual family life. If it doesn't work in your kitchen on a Tuesday morning, it doesn't make the plan.",
            },
            {
              title: 'Progress over perfection',
              body: "Small, consistent wins matter more than getting it right every time. We celebrate the moments that are better — not just the ones that are perfect.",
            },
          ].map(({ title, body }) => (
            <div key={title} style={{ background: LINEN, borderRadius: 16, padding: '36px 32px', border: `1px solid ${HAIRLINE}` }}>
              <h3 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.15, color: TEXT, margin: '0 0 14px' }}>{title}</h3>
              <p style={{ fontFamily: B, fontSize: '0.98rem', color: TEXT2, lineHeight: 1.6, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Credentials ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24" style={{ background: LINEN }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><Pill>CREDENTIALS</Pill></div>
          <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.6rem)', lineHeight: 1.05, color: TEXT, margin: '0 0 20px', letterSpacing: '-0.015em' }}>
            Trained. Certified. Committed.
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 44 }}><HeartRule center /></div>
          <div className="grid sm:grid-cols-2 gap-5 text-left">
            {[
              { label: 'Certified Parent Coach', desc: 'Professionally trained in evidence-based parent coaching methodologies' },
              { label: 'Family Systems Training', desc: 'Specialized training in child development and family communication' },
              { label: '10+ Years in Special Education', desc: 'Classroom experience working with neurodiverse children ages 3–12' },
              { label: 'Behavior & IEP Expertise', desc: 'Skilled in behavior planning, school communication, and individualized strategies' },
            ].map(({ label, desc }) => (
              <div key={label} style={{ background: NAVY_TINT, borderRadius: 14, padding: '24px 24px' }}>
                <p style={{ fontFamily: U, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '.10em', textTransform: 'uppercase', color: TEXT, margin: '0 0 8px' }}>{label}</p>
                <p style={{ fontFamily: B, fontSize: '0.92rem', color: TEXT2, lineHeight: 1.55, margin: 0 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24" style={{ background: NAVY, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Pill cream>REIMAGINE</Pill>
        </div>
        <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05, color: '#FAF5EA', margin: '0 0 20px', letterSpacing: '-0.015em' }}>
          Ready to get started?
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <HeartRule light center />
        </div>
        <p style={{ fontFamily: B, fontSize: '1.05rem', color: '#E0D9C7', lineHeight: 1.55, maxWidth: 480, margin: '0 auto 32px' }}>
          Book a free discovery call and let&apos;s talk about your family.
        </p>
        <Link
          href="/book"
          style={{ display: 'inline-flex', alignItems: 'center', padding: '15px 36px', background: LINEN, color: TEXT, borderRadius: 999, fontFamily: U, fontWeight: 600, fontSize: '0.84rem', letterSpacing: '.16em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          BOOK YOUR FREE CALL →
        </Link>
      </section>

    </div>
  )
}
