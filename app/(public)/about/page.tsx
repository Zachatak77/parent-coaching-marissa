import type { Metadata } from 'next'
import Link from 'next/link'
import { HeartRule } from '@/components/public/heart-rule'
import { Pill } from '@/components/public/pill'

export const metadata: Metadata = {
  title: 'About Marissa | Reimagine Parenting',
  description:
    'Learn about Marissa, her story, her coaching philosophy, and why she became a certified parent coach dedicated to helping families thrive.',
}

const NAVY       = '#5F728D'
const CREAM      = '#F7F7F5'
const LINEN      = '#FFFFFF'
const TEXT       = '#1F1D1A'
const TEXT2      = '#3A372F'
const HAIRLINE   = '#D9CFB9'
const SAGE_LIGHT = '#9BB39B'
const PEACH      = '#E98773'
const STRAW      = '#EFB63F'
const D = 'var(--font-display)'
const B = 'var(--font-body)'
const U = 'var(--font-ui)'

export default function AboutPage() {
  return (
    <div style={{ background: CREAM }}>

      {/* ── Hero ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24" style={{ background: CREAM }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 20 }}><Pill bg={SAGE}>YOUR COACH</Pill></div>
          <h1 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 1.05, color: TEXT, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
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
            <div style={{ marginBottom: 16 }}><Pill bg={PEACH} fg={TEXT}>MY STORY</Pill></div>
            <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.05, color: TEXT, margin: '0 0 20px', letterSpacing: '-0.015em' }}>
              Why I became a parent coach
            </h2>
            <HeartRule />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.65, margin: 0 }}>
              As a special education teacher, I spent years supporting neurodivergent children and working closely with families who were doing everything they could to help their child thrive. Over and over again, I saw the same thing: parents understood their child&apos;s needs, but often felt unsure of how to turn strategies into real-life support at home.
            </p>
            <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.65, margin: 0 }}>
              Then I became a parent myself.
            </p>
            <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.65, margin: 0 }}>
              I quickly realized that parenting is hard, emotional, and overwhelming at times—no matter how much experience you have. Parenting truly takes a village, and so many families are carrying the weight of trying to figure it all out alone.
            </p>
            <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.65, margin: 0 }}>
              That&apos;s why I created Reimagine Parenting.
            </p>
            <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.65, margin: 0 }}>
              By blending my professional background in special education with my personal experience as a parent, I support families in creating calmer routines, stronger connections, and practical strategies that actually work in everyday life. My goal is to help parents feel more confident, more supported, and less alone in their parenting journey.
            </p>
          </div>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24" style={{ background: CREAM }}>
        <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 52px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><Pill bg={STRAW} fg={TEXT}>HOW I WORK</Pill></div>
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
            <div key={title} style={{ background: LINEN, borderRadius: 20, padding: '36px 32px', border: `1px solid ${HAIRLINE}` }}>
              <h3 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.15, color: TEXT, margin: '0 0 14px' }}>{title}</h3>
              <p style={{ fontFamily: B, fontSize: '0.98rem', color: TEXT2, lineHeight: 1.6, margin: 0 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Credentials ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24" style={{ background: LINEN }}>
        <div style={{ maxWidth: 620, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><Pill char>CREDENTIALS</Pill></div>
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
              <div key={label} style={{ background: SAGE_LIGHT, borderRadius: 20, padding: '24px 24px' }}>
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
        <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05, color: '#FFFFFF', margin: '0 0 20px', letterSpacing: '-0.015em' }}>
          Ready to get started?
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <HeartRule light center />
        </div>
        <p style={{ fontFamily: B, fontSize: '1.05rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, maxWidth: 480, margin: '0 auto 32px' }}>
          Book a free discovery call and let&apos;s talk about your family.
        </p>
        <Link
          href="/book"
          style={{ display: 'inline-flex', alignItems: 'center', padding: '15px 36px', background: LINEN, color: TEXT, borderRadius: 999, fontFamily: U, fontWeight: 600, fontSize: '0.84rem', letterSpacing: '.16em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          BOOK A CONSULT →
        </Link>
      </section>

    </div>
  )
}
