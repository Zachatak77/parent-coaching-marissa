import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Reveal } from '@/components/public/reveal'
import { ArrowCta, Eyebrow } from '@/components/public/motifs'

export const metadata: Metadata = {
  title: 'Coaching Programs | Reimagine Parenting',
  description:
    'Explore parent coaching packages — from a focused 2-week program to ongoing monthly support. All pricing discussed during your free discovery call.',
}

const NAVY  = '#5F728D'
const INK   = '#23211E'
const CREAM = '#F7F7F5'
const TEXT  = '#1F1D1A'
const TEXT2 = '#3A372F'
const DIM   = '#6E6A60'
const SAGE  = '#9BB39B'
const D = 'var(--font-display)'
const B = 'var(--font-body)'
const U = 'var(--font-ui)'

const packages = [
  {
    name: 'Confident Parent Program',
    duration: '2 Weeks',
    outcome: 'Clear plan. Less overwhelm. Strategies you can use right away.',
    includes: [
      '2 private coaching sessions (45–60 min)',
      'Personalized home strategy plan',
      'Custom scripts for behavior + transitions',
      '2 weeks of text/email support',
      'Follow-up notes with clear action steps',
    ],
  },
  {
    name: 'Parent Coaching Partnership',
    duration: '4 Weeks',
    outcome: 'More consistency, fewer battles, and stronger parent confidence.',
    featured: true,
    includes: [
      '4 weekly coaching sessions (45–60 min)',
      'Fully customized home support plan',
      'Ongoing text/email support',
      'School + IEP guidance',
      'Routine/behavior tracking tool',
      'Session recaps with next steps',
    ],
  },
  {
    name: 'Ongoing Support',
    duration: 'Monthly',
    outcome: 'Ongoing clarity, accountability, and support.',
    includes: [
      '1 monthly check-in call (30 min)',
      'Ongoing text/email access',
      'Strategy adjustments as needed',
      'School communication support',
    ],
  },
]

const faqs = [
  {
    q: 'Is parent coaching the same as therapy?',
    a: "No. Coaching is forward-focused and practical. I'm not diagnosing or treating — I'm working with you on strategies, routines, and communication to make daily life better. If deeper support is needed, I'm always happy to discuss referrals.",
  },
  {
    q: 'What age children do you work with?',
    a: "I work with families with children from toddlers through middle school. The strategies are always tailored to your child's specific age, stage, and temperament.",
  },
  {
    q: 'How do sessions work?',
    a: "Sessions are held via Zoom and are 45–60 minutes. You'll always leave with clear next steps — no vague advice, just an actionable plan for the week ahead.",
  },
  {
    q: "What if I'm not sure which package is right for me?",
    a: "That's exactly what the discovery call is for. We'll talk about what's going on at home, what you've already tried, and what would make the biggest difference. There's no pressure — just a real conversation.",
  },
  {
    q: 'Do you offer any guarantees?',
    a: "I'm committed to your progress. If you're not finding the sessions helpful, we'll talk openly about adjustments or next steps. Your family's wellbeing is always the priority.",
  },
]

function CheckIcon({ color = SAGE }: { color?: string }) {
  return (
    <svg aria-hidden width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 4 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

export default function ServicesPage() {
  return (
    <div style={{ background: CREAM }}>

      {/* ── Header ── */}
      <section aria-labelledby="services-hero" className="relative overflow-hidden px-6 sm:px-10 lg:px-16 py-16 sm:py-24" style={{ background: '#FFFFFF' }}>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="rp-blob-1 absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full opacity-[0.18] blur-3xl"
            style={{ background: `radial-gradient(circle at 35% 35%, ${NAVY}, transparent 70%)` }} />
        </div>
        <div className="relative mx-auto max-w-6xl">
          <Reveal>
            <Eyebrow>Coaching programs</Eyebrow>
            <h1 id="services-hero" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 1.02, letterSpacing: '-0.025em', color: TEXT, margin: '22px 0 20px', maxWidth: 700 }}>
              Programs built around your family
            </h1>
            <p style={{ fontFamily: B, fontSize: '1.15rem', color: TEXT2, lineHeight: 1.6, maxWidth: 540, margin: 0 }}>
              Every family is different. Choose the level of support that fits where you are right now.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Packages ── */}
      <section aria-label="Coaching packages" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28" style={{ background: CREAM }}>
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {packages.map(({ name, duration, outcome, includes, featured }, i) => (
            <Reveal key={name} delay={i * 120}>
              <article
                className="relative flex h-full flex-col rounded-2xl border bg-white p-8 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                style={featured
                  ? { borderColor: NAVY, boxShadow: '0 8px 32px rgba(95,114,141,0.18)' }
                  : { borderColor: 'rgba(0,0,0,0.08)' }}
              >
                {featured && (
                  <span className="absolute -top-3 left-8 rounded-full px-3.5 py-1" style={{ background: NAVY, fontFamily: U, fontWeight: 700, fontSize: '0.62rem', letterSpacing: '.18em', textTransform: 'uppercase', color: '#fff' }}>
                    Most popular
                  </span>
                )}
                <p style={{ fontFamily: U, fontWeight: 600, fontSize: '0.7rem', letterSpacing: '.16em', textTransform: 'uppercase', color: NAVY, margin: '0 0 10px' }}>{duration}</p>
                <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.65rem', lineHeight: 1.1, color: TEXT, margin: '0 0 20px' }}>{name}</h2>
                <ul className="m-0 flex flex-col gap-3 p-0" style={{ listStyle: 'none' }}>
                  {includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckIcon />
                      <span style={{ fontFamily: B, fontSize: '0.95rem', color: TEXT2, lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex-1 border-t pt-5" style={{ borderColor: 'rgba(0,0,0,0.07)' }}>
                  <p style={{ fontFamily: U, fontWeight: 700, fontSize: '0.64rem', letterSpacing: '.14em', textTransform: 'uppercase', color: DIM, margin: '0 0 6px' }}>Outcome</p>
                  <p style={{ fontFamily: B, fontStyle: 'italic', fontSize: '0.95rem', color: TEXT, lineHeight: 1.5, margin: 0 }}>{outcome}</p>
                </div>
                <Link
                  href="/book"
                  className="mt-7 flex items-center justify-center rounded-full py-[13px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5F728D] focus-visible:ring-offset-2"
                  style={{ background: featured ? NAVY : INK, color: '#fff', fontFamily: U, fontWeight: 600, fontSize: '0.76rem', letterSpacing: '.14em', textTransform: 'uppercase', textDecoration: 'none' }}
                >
                  Book a consult
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Add-ons ── */}
      <section aria-labelledby="addons-heading" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24" style={{ background: '#FFFFFF' }}>
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <Eyebrow>Add-ons</Eyebrow>
            <h2 id="addons-heading" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(1.7rem, 3vw, 2.2rem)', lineHeight: 1.1, letterSpacing: '-0.01em', color: TEXT, margin: '16px 0 10px' }}>
              Extra support when you need it
            </h2>
            <p style={{ fontFamily: B, fontSize: '1rem', color: TEXT2, margin: '0 0 28px', lineHeight: 1.55 }}>
              Pricing for all packages and add-ons is discussed during your discovery call.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-3">
            {['Additional Session', 'IEP / School Prep Call', 'Custom Behavior Plan'].map((addon, i) => (
              <Reveal key={addon} delay={i * 100}>
                <div className="flex items-center gap-3 rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md" style={{ borderColor: 'rgba(0,0,0,0.08)', background: CREAM }}>
                  <CheckIcon />
                  <p style={{ fontFamily: U, fontSize: '0.9rem', fontWeight: 600, color: TEXT, margin: 0 }}>{addon}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section aria-labelledby="faq-heading" className="px-6 sm:px-10 lg:px-16 py-20 sm:py-28" style={{ background: CREAM }}>
        <div className="mx-auto max-w-2xl">
          <Reveal>
            <Eyebrow>Good to know</Eyebrow>
            <h2 id="faq-heading" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.08, letterSpacing: '-0.015em', color: TEXT, margin: '18px 0 36px' }}>
              Frequently asked questions
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map(({ q, a }, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-none" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <AccordionTrigger
                    className="hover:no-underline py-5 text-left"
                    style={{ fontFamily: U, fontWeight: 600, fontSize: '0.96rem', color: TEXT }}
                  >
                    {q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-6" style={{ fontFamily: B, fontSize: '1rem', color: TEXT2, lineHeight: 1.65 }}>
                    {a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section aria-labelledby="services-cta" className="relative overflow-hidden px-6 sm:px-10 lg:px-16 py-24 sm:py-28 text-center" style={{ background: INK }}>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-1/2 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-[0.16] blur-3xl"
            style={{ background: `radial-gradient(ellipse, ${NAVY}, transparent 65%)` }} />
        </div>
        <div className="relative mx-auto max-w-2xl">
          <Reveal>
            <h2 id="services-cta" style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', lineHeight: 1.06, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 18px' }}>
              Not sure where to start?
            </h2>
            <p style={{ fontFamily: B, fontSize: '1.08rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, maxWidth: 460, margin: '0 auto 34px' }}>
              Let&apos;s talk. The discovery call is free and there&apos;s no pressure.
            </p>
            <div className="flex justify-center">
              <ArrowCta href="/book" variant="white">Book a free consult</ArrowCta>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  )
}
