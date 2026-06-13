import type { Metadata } from 'next'
import { Reveal } from '@/components/public/reveal'
import { ArrowCta, Eyebrow } from '@/components/public/motifs'

export const metadata: Metadata = {
  title: 'About Marissa | Reimagine Parenting',
  description:
    'Learn about Marissa, her story, her coaching philosophy, and why she became a certified parent coach dedicated to helping families thrive.',
}

const NAVY  = '#5F728D'
const INK   = '#23211E'
const CREAM = '#F7F7F5'
const TEXT  = '#1F1D1A'
const TEXT2 = '#3A372F'
const SAGE  = '#9BB39B'
const PEACH = '#E98773'
const STRAW = '#EFB63F'
const D = 'var(--font-display)'
const B = 'var(--font-body)'
const U = 'var(--font-ui)'

const philosophy = [
  {
    accent: SAGE,
    title: 'Connection first',
    body: 'Before strategies, before scripts — you need to feel heard and understood. Every session starts with you, not a checklist.',
  },
  {
    accent: PEACH,
    title: 'Real-life strategies',
    body: "Everything I share is practical, age-appropriate, and designed for actual family life. If it doesn't work in your kitchen on a Tuesday morning, it doesn't make the plan.",
  },
  {
    accent: STRAW,
    title: 'Progress over perfection',
    body: 'Small, consistent wins matter more than getting it right every time. We celebrate the moments that are better — not just the ones that are perfect.',
  },
]

const credentials = [
  { label: 'Certified Parent Coach', desc: 'Professionally trained in evidence-based parent coaching methodologies' },
  { label: 'Family Systems Training', desc: 'Specialized training in child development and family communication' },
  { label: '10+ Years in Special Education', desc: 'Classroom experience working with neurodiverse children ages 3–12' },
  { label: 'Behavior & IEP Expertise', desc: 'Skilled in behavior planning, school communication, and individualized strategies' },
]

export default function AboutPage() {
  return (
    <div style={{ background: CREAM }}>

      {/* ── Hero ── */}
      <section aria-labelledby="about-hero" className="relative overflow-hidden px-6 sm:px-10 lg:px-16 py-16 sm:py-24" style={{ background: '#FFFFFF' }}>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="rp-blob-1 absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full opacity-[0.18] blur-3xl"
            style={{ background: `radial-gradient(circle at 35% 35%, ${NAVY}, transparent 70%)` }} />
          <div className="absolute bottom-0 -left-32 h-[320px] w-[320px] rounded-full opacity-[0.14] blur-3xl"
            style={{ background: `radial-gradient(circle, ${SAGE}, transparent 70%)` }} />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Your coach</Eyebrow>
            <h1 id="about-hero" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(3rem, 7vw, 5.5rem)', lineHeight: 1.02, letterSpacing: '-0.025em', color: TEXT, margin: '22px 0 20px' }}>
              Hi, I’m Marissa.
            </h1>
            <p style={{ fontFamily: B, fontSize: '1.18rem', color: TEXT2, lineHeight: 1.6, maxWidth: 560, margin: 0 }}>
              I help parents feel more confident, connected, and calm — even on the hard days.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── My Story ── */}
      <section aria-labelledby="story-heading" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28" style={{ background: CREAM }}>
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <Eyebrow>My story</Eyebrow>
            <h2 id="story-heading" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.08, letterSpacing: '-0.015em', color: TEXT, margin: '18px 0 28px' }}>
              Why I became a parent coach
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex flex-col gap-5">
              <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.7, margin: 0 }}>
                As a special education teacher, I spent years supporting neurodivergent children and working closely with families who were doing everything they could to help their child thrive. Over and over again, I saw the same thing: parents understood their child&apos;s needs, but often felt unsure of how to turn strategies into real-life support at home.
              </p>
              <p style={{ fontFamily: D, fontStyle: 'italic', fontSize: '1.4rem', color: NAVY, lineHeight: 1.4, margin: '8px 0' }}>
                Then I became a parent myself.
              </p>
              <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.7, margin: 0 }}>
                I quickly realized that parenting is hard, emotional, and overwhelming at times — no matter how much experience you have. Parenting truly takes a village, and so many families are carrying the weight of trying to figure it all out alone.
              </p>
              <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.7, margin: 0 }}>
                That&apos;s why I created Reimagine Parenting.
              </p>
              <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.7, margin: 0 }}>
                By blending my professional background in special education with my personal experience as a parent, I support families in creating calmer routines, stronger connections, and practical strategies that actually work in everyday life. My goal is to help parents feel more confident, more supported, and less alone in their parenting journey.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Philosophy ── */}
      <section aria-labelledby="philosophy-heading" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28" style={{ background: '#FFFFFF' }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-14 max-w-2xl">
              <Eyebrow>How I work</Eyebrow>
              <h2 id="philosophy-heading" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.02em', color: TEXT, margin: '18px 0 0' }}>
                My coaching philosophy
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3">
            {philosophy.map(({ accent, title, body }, i) => (
              <Reveal key={title} delay={i * 120}>
                <article className="group relative h-full overflow-hidden rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl" style={{ borderColor: 'rgba(0,0,0,0.07)', background: CREAM }}>
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: accent }} />
                  <h3 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.5rem', lineHeight: 1.15, color: TEXT, margin: '0 0 14px' }}>{title}</h3>
                  <p style={{ fontFamily: B, fontSize: '0.98rem', color: TEXT2, lineHeight: 1.6, margin: 0 }}>{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credentials ── */}
      <section aria-labelledby="credentials-heading" className="relative overflow-hidden px-6 sm:px-10 lg:px-16 py-20 sm:py-28" style={{ background: INK }}>
        <div aria-hidden className="pointer-events-none absolute -top-40 right-0 h-[460px] w-[460px] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: `radial-gradient(circle, ${NAVY}, transparent 70%)` }} />
        <div className="relative mx-auto max-w-4xl">
          <Reveal>
            <div className="mb-12 text-center">
              <Eyebrow light>Credentials</Eyebrow>
              <h2 id="credentials-heading" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.08, letterSpacing: '-0.015em', color: '#fff', margin: '18px 0 0' }}>
                Trained. Certified. Committed.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {credentials.map(({ label, desc }, i) => (
              <Reveal key={label} delay={i * 100}>
                <div className="h-full rounded-xl border p-6 transition-colors duration-300 hover:bg-white/[0.06]" style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}>
                  <p style={{ fontFamily: U, fontWeight: 700, fontSize: '0.76rem', letterSpacing: '.14em', textTransform: 'uppercase', color: [SAGE, PEACH, STRAW, SAGE][i], margin: '0 0 8px' }}>{label}</p>
                  <p style={{ fontFamily: B, fontSize: '0.95rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.55, margin: 0 }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section aria-labelledby="about-cta" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28 text-center" style={{ background: CREAM }}>
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <h2 id="about-cta" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.06, letterSpacing: '-0.02em', color: TEXT, margin: '0 0 18px' }}>
              Ready to get started?
            </h2>
            <p style={{ fontFamily: B, fontSize: '1.08rem', color: TEXT2, lineHeight: 1.6, maxWidth: 480, margin: '0 auto 34px' }}>
              Book a free discovery call and let&apos;s talk about your family.
            </p>
            <div className="flex justify-center">
              <ArrowCta href="/book">Book a free consult</ArrowCta>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  )
}
