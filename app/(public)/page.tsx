import type { Metadata } from 'next'
import { Reveal } from '@/components/public/reveal'
import { ArrowCta, ArrowLink, Eyebrow, Stars } from '@/components/public/motifs'

export const metadata: Metadata = {
  title: 'Reimagine Parenting | Coaching that works with your child’s brain',
  description:
    'One-on-one parent coaching for families raising neurodiverse kids ages 3–12. Built on a decade of special-education experience — not generic advice.',
}

/* ── Brand tokens (see globals.css design system) ── */
const NAVY  = '#5F728D'
const INK   = '#23211E'
const INK2  = '#2C2A28'
const CREAM = '#F7F7F5'
const TEXT  = '#1F1D1A'
const TEXT2 = '#3A372F'
const DIM   = '#6E6A60'
const SAGE  = '#9BB39B'
const PEACH = '#E98773'
const STRAW = '#EFB63F'

const D = 'var(--font-display)'
const B = 'var(--font-body)'
const U = 'var(--font-ui)'

const marqueeItems = [
  'Meltdowns', 'School-morning chaos', 'Bedtime battles', 'Transitions',
  'Big feelings', 'Sibling conflict', 'Picky eating', 'Homework standoffs',
]

const steps = [
  {
    num: '01',
    accent: SAGE,
    title: 'Understand',
    body: 'We decode what your child’s behavior is actually communicating — through the lens of their nervous system, not a generic parenting playbook.',
  },
  {
    num: '02',
    accent: PEACH,
    title: 'Build',
    body: 'You get a personalized, written plan with concrete scripts and routines designed around your child, your home, and your real life.',
  },
  {
    num: '03',
    accent: STRAW,
    title: 'Practice & adjust',
    body: 'Weekly support while you put it into action. We keep what works, tweak what doesn’t, and build your confidence week by week.',
  },
]

const forYouItems = [
  'Your child melts down at every transition — and nothing you’ve read online helps',
  'School mornings regularly end in tears (sometimes yours)',
  'Advice that works for other kids has never worked for yours',
  'Your child is autistic, has ADHD, or is otherwise wired differently — diagnosed or not',
  'You love your kid fiercely and you’re exhausted at the same time',
]

const chips = ['Ages 3–12', 'ADHD', 'Autism', 'Sensory needs', 'Anxiety', 'No diagnosis needed']

const services = [
  {
    title: 'One-Time Consultation',
    best: 'For parents who need a clear starting point',
    body: 'A focused session to tackle your most pressing challenge — grounded in expertise, delivered with compassion.',
  },
  {
    title: 'Personalized Coaching Plan',
    best: 'For families with specific behavior goals',
    body: 'A behavior plan built around your child’s individual needs, with weekly support to put it into action.',
  },
  {
    title: 'Ongoing Monthly Support',
    best: 'For continued accountability and guidance',
    body: 'Regular check-ins and strategy adjustments to keep your family moving forward, week by week.',
  },
]

const testimonials = [
  {
    quote: 'We had tried everything. Marissa helped us understand why our son was struggling and gave us a real plan. The difference in our house within a month was remarkable.',
    byline: 'Parent of a 9-year-old',
  },
  {
    quote: 'I was nervous to reach out, but Marissa made me feel so at ease on our first call. I knew within five minutes it was exactly what I needed.',
    byline: 'Parent of a 7-year-old · Montclair, NJ',
  },
  {
    quote: 'For the first time, bedtime isn’t a battle. The plan was so specific to our daughter — it finally felt like someone actually got her.',
    byline: 'Parent of a 5-year-old',
  },
]

export default function HomePage() {
  return (
    <div style={{ background: CREAM }}>

      {/* ── 1. Hero ── */}
      <section aria-labelledby="hero-heading" className="relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        {/* ambient gradient field */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="rp-blob-1 absolute -top-32 -right-24 h-[480px] w-[480px] rounded-full opacity-[0.22] blur-3xl"
            style={{ background: `radial-gradient(circle at 35% 35%, ${NAVY}, transparent 70%)` }} />
          <div className="rp-blob-2 absolute top-48 -left-40 h-[420px] w-[420px] rounded-full opacity-[0.18] blur-3xl"
            style={{ background: `radial-gradient(circle at 60% 40%, ${SAGE}, transparent 70%)` }} />
          <div className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full opacity-[0.12] blur-3xl"
            style={{ background: `radial-gradient(circle, ${PEACH}, transparent 70%)` }} />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 sm:px-10 lg:px-16 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-32">
          <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
            {/* copy */}
            <div>
              <Reveal>
                <h1
                  id="hero-heading"
                  style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2.8rem, 6.5vw, 4.8rem)', lineHeight: 1.02, letterSpacing: '-0.025em', color: TEXT, margin: '0 0 24px' }}
                >
                  Parenting that works{' '}
                  <em style={{ fontStyle: 'italic', color: NAVY }}>with</em>{' '}
                  your child’s brain.
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p style={{ fontFamily: B, fontSize: '1.18rem', color: TEXT2, lineHeight: 1.6, maxWidth: 540, margin: '0 0 36px' }}>
                  One-on-one coaching for parents of neurodiverse kids — built on a decade
                  of special-education experience, not generic advice. Less chaos, more
                  connection, a plan that actually fits your family.
                </p>
              </Reveal>
              <Reveal delay={200}>
                <div className="flex flex-wrap items-center gap-4">
                  <ArrowCta href="/book">Book a free consult</ArrowCta>
                  <ArrowCta href="#approach" variant="ghost">See how it works</ArrowCta>
                </div>
              </Reveal>
              <Reveal delay={280}>
                <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 list-none p-0 m-0" style={{ fontFamily: U, fontSize: '0.82rem', color: DIM }}>
                  {['10+ years in special education', 'Virtual — meet from anywhere', 'No-pressure discovery call'].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <svg aria-hidden width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={SAGE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>

            {/* floating cards (decorative) */}
            <div aria-hidden className="relative hidden lg:block" style={{ minHeight: 380 }}>
              <Reveal delay={300} className="absolute top-0 right-0 w-[320px]">
                <div className="rounded-2xl border bg-white/80 p-6 shadow-xl backdrop-blur-md transition-transform duration-500 hover:-translate-y-1.5"
                  style={{ borderColor: 'rgba(95,114,141,0.18)' }}>
                  <p style={{ fontFamily: U, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '.16em', textTransform: 'uppercase', color: DIM, margin: '0 0 14px' }}>
                    Tonight’s wind-down plan
                  </p>
                  {['Visual timer at 7:15', 'Two-choice script for pajamas', 'Deep-pressure check-in after books'].map((t) => (
                    <div key={t} className="mb-2.5 flex items-start gap-2.5 last:mb-0">
                      <span className="mt-[3px] flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full" style={{ background: SAGE }}>
                        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span style={{ fontFamily: U, fontSize: '0.88rem', color: TEXT2, lineHeight: 1.4 }}>{t}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal delay={460} className="absolute bottom-0 left-0 w-[280px]">
                <div className="rounded-2xl p-6 shadow-xl transition-transform duration-500 hover:-translate-y-1.5" style={{ background: INK2 }}>
                  <p style={{ fontFamily: U, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: '0 0 10px' }}>
                    Text from a client
                  </p>
                  <p style={{ fontFamily: B, fontStyle: 'italic', fontSize: '1.02rem', color: '#fff', lineHeight: 1.5, margin: 0 }}>
                    “Bedtime took 20 minutes tonight. TWENTY. 🥹”
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Marquee ribbon ── */}
      <section aria-label="Challenges we work on" className="overflow-hidden py-5" style={{ background: INK }}>
        <div className="flex w-max rp-marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy === 1} className="flex items-center">
              <span className="px-8 whitespace-nowrap" style={{ fontFamily: B, fontStyle: 'italic', fontSize: '0.95rem', color: 'rgba(255,255,255,0.55)' }}>
                What we untangle together
              </span>
              {marqueeItems.map((item) => (
                <span key={item} className="flex items-center whitespace-nowrap">
                  <span aria-hidden className="mx-1 h-1 w-1 rounded-full" style={{ background: PEACH }} />
                  <span className="px-7" style={{ fontFamily: U, fontWeight: 500, fontSize: '0.82rem', letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)' }}>
                    {item}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. The approach ── */}
      <section id="approach" aria-labelledby="approach-heading" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28" style={{ background: CREAM, scrollMarginTop: 80 }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-14 max-w-2xl">
              <Eyebrow>The approach</Eyebrow>
              <h2 id="approach-heading" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.02em', color: TEXT, margin: '18px 0 16px' }}>
                A plan as individual as your child.
              </h2>
              <p style={{ fontFamily: B, fontSize: '1.08rem', color: TEXT2, lineHeight: 1.6, margin: 0 }}>
                No scripts copied from a bestseller. Every family starts in the same three
                places — and ends up somewhere entirely their own.
              </p>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3">
            {steps.map(({ num, accent, title, body }, i) => (
              <Reveal key={num} delay={i * 120}>
                <article className="group relative h-full overflow-hidden rounded-2xl border bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                  <span aria-hidden className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100" style={{ background: accent }} />
                  <p style={{ fontFamily: U, fontWeight: 700, fontSize: '0.78rem', letterSpacing: '.18em', color: accent === STRAW ? '#C28F1A' : accent, margin: '0 0 18px' }}>{num}</p>
                  <h3 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.6rem', lineHeight: 1.1, color: TEXT, margin: '0 0 12px' }}>{title}</h3>
                  <p style={{ fontFamily: B, fontSize: '1rem', color: TEXT2, lineHeight: 1.6, margin: 0 }}>{body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Who it's for ── */}
      <section aria-labelledby="for-heading" className="relative overflow-hidden px-6 sm:px-10 lg:px-16 py-20 sm:py-28" style={{ background: INK }}>
        <div aria-hidden className="pointer-events-none absolute -top-40 right-0 h-[500px] w-[500px] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: `radial-gradient(circle, ${NAVY}, transparent 70%)` }} />
        <div className="relative mx-auto grid max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div>
              <Eyebrow light>Who it’s for</Eyebrow>
              <h2 id="for-heading" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.02em', color: '#fff', margin: '18px 0 18px' }}>
                Made for families like yours.
              </h2>
              <p style={{ fontFamily: B, fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.65, margin: '0 0 28px' }}>
                If your child experiences the world a little differently, the standard
                parenting playbook was never written for you. This coaching is — whether
                you have a diagnosis in hand or just a gut feeling.
              </p>
              <div className="mb-10 flex flex-wrap gap-2.5">
                {chips.map((chip) => (
                  <span key={chip} className="rounded-full border px-4 py-1.5" style={{ borderColor: 'rgba(255,255,255,0.22)', fontFamily: U, fontWeight: 500, fontSize: '0.74rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.8)' }}>
                    {chip}
                  </span>
                ))}
              </div>
              <ArrowCta href="/book" variant="ghost-light">This sounds like us</ArrowCta>
            </div>
          </Reveal>
          <div role="list" className="flex flex-col gap-3">
            {forYouItems.map((item, i) => (
              <Reveal key={item} delay={i * 100}>
                <div role="listitem" className="flex items-start gap-4 rounded-xl border p-5 transition-colors duration-300 hover:bg-white/[0.06]" style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.03)' }}>
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full" style={{ background: [SAGE, PEACH, STRAW, SAGE, PEACH][i] }}>
                    <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <p style={{ fontFamily: B, fontSize: '1.02rem', color: 'rgba(255,255,255,0.88)', lineHeight: 1.55, margin: 0 }}>{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Services ── */}
      <section aria-labelledby="services-heading" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28" style={{ background: '#FFFFFF' }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <Eyebrow>Ways to work together</Eyebrow>
                <h2 id="services-heading" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.02em', color: TEXT, margin: '18px 0 0' }}>
                  Support that fits your family.
                </h2>
              </div>
              <div className="self-start sm:self-auto">
                <ArrowLink href="/services">All services</ArrowLink>
              </div>
            </div>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-3">
            {services.map(({ title, best, body }, i) => (
              <Reveal key={title} delay={i * 120}>
                <article className="group flex h-full flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl" style={{ borderColor: 'rgba(0,0,0,0.08)', background: CREAM }}>
                  <p style={{ fontFamily: U, fontWeight: 600, fontSize: '0.68rem', letterSpacing: '.16em', textTransform: 'uppercase', color: NAVY, margin: '0 0 14px' }}>{best}</p>
                  <h3 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.55rem', lineHeight: 1.12, color: TEXT, margin: '0 0 12px' }}>{title}</h3>
                  <p className="flex-1" style={{ fontFamily: B, fontSize: '0.98rem', color: TEXT2, lineHeight: 1.6, margin: '0 0 24px' }}>{body}</p>
                  <ArrowLink href="/services" color={TEXT}>View details</ArrowLink>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials ── */}
      <section aria-labelledby="stories-heading" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28" style={{ background: CREAM }}>
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="mb-14 max-w-2xl">
              <Eyebrow>Parent stories</Eyebrow>
              <h2 id="stories-heading" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.08, letterSpacing: '-0.02em', color: TEXT, margin: '18px 0 0' }}>
                Real homes. Real change.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map(({ quote, byline }, i) => (
              <Reveal key={byline} delay={i * 120}>
                <figure className="flex h-full flex-col rounded-2xl border bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl m-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                  <Stars />
                  <blockquote className="flex-1 m-0">
                    <p style={{ fontFamily: B, fontStyle: 'italic', fontSize: '1.05rem', color: TEXT2, lineHeight: 1.65, margin: '18px 0 22px' }}>
                      “{quote}”
                    </p>
                  </blockquote>
                  <figcaption style={{ fontFamily: U, fontWeight: 600, fontSize: '0.7rem', letterSpacing: '.14em', textTransform: 'uppercase', color: DIM }}>
                    — {byline}
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. About Marissa ── */}
      <section aria-labelledby="about-heading" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28" style={{ background: '#FFFFFF' }}>
        <div className="mx-auto max-w-3xl">
          <Reveal>
            <div>
              <Eyebrow>Hi, I’m Marissa</Eyebrow>
              <h2 id="about-heading" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', lineHeight: 1.1, letterSpacing: '-0.015em', color: TEXT, margin: '18px 0 18px' }}>
                I help parents feel calm, confident, and in control.
              </h2>
              <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.65, margin: '0 0 14px' }}>
                I’m a special-education teacher with more than a decade of experience
                working with neurodiverse children ages 3–12. I understand how these kids
                experience the world — and I help parents build strategies that fit their
                child’s nervous system, not someone else’s ideal.
              </p>
              <p style={{ fontFamily: B, fontSize: '1.05rem', color: TEXT2, lineHeight: 1.65, margin: '0 0 28px' }}>
                Parenting can feel overwhelming, but you don’t have to figure it out alone.
              </p>
              <ArrowLink href="/about">Meet Marissa</ArrowLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── 8. Final CTA ── */}
      <section aria-labelledby="cta-heading" className="relative overflow-hidden px-6 sm:px-10 lg:px-16 py-24 sm:py-32 text-center" style={{ background: INK }}>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[520px] w-[820px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-3xl"
            style={{ background: `radial-gradient(ellipse, ${NAVY}, transparent 65%)` }} />
        </div>
        <div className="relative mx-auto max-w-3xl">
          <Reveal>
            <h2 id="cta-heading" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2.4rem, 5.5vw, 4rem)', lineHeight: 1.04, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 22px' }}>
              Reimagine what home<br />can feel like.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p style={{ fontFamily: B, fontSize: '1.12rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 520, margin: '0 auto 38px' }}>
              A free 20-minute call. No pressure, no prep — just a real conversation about
              what’s hard right now and whether coaching can help.
            </p>
          </Reveal>
          <Reveal delay={220}>
            <div className="flex flex-col items-center gap-5">
              <ArrowCta href="/book" variant="white">Book your free consult</ArrowCta>
              <a href="mailto:parentcoachwithmarissa@gmail.com" className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-sm"
                style={{ fontFamily: U, fontSize: '0.84rem', color: 'rgba(255,255,255,0.55)', textDecoration: 'underline', textUnderlineOffset: 4 }}>
                or email parentcoachwithmarissa@gmail.com
              </a>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  )
}
