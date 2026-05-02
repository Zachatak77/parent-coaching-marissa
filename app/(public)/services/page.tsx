import type { Metadata } from 'next'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Coaching Programs | Reimagine Parenting',
  description:
    'Explore parent coaching packages — from a focused 2-week program to ongoing monthly support. All pricing discussed during your free discovery call.',
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

function Pill({ children, cream }: { children: string; cream?: boolean }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '7px 22px 8px',
      background: cream ? LINEN : NAVY,
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

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginTop: 3 }}>
      <path d="M3 8 L6.5 11.5 L13 5" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

export default function ServicesPage() {
  return (
    <div style={{ background: CREAM }}>

      {/* ── Header ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 sm:py-20 lg:py-24" style={{ background: CREAM }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{ marginBottom: 20 }}><Pill>COACHING PROGRAMS</Pill></div>
          <h1 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2.8rem, 6vw, 5rem)', lineHeight: 0.97, color: TEXT, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Programs built around your family
          </h1>
          <div style={{ margin: '0 0 24px' }}><HeartRule /></div>
          <p style={{ fontFamily: B, fontSize: '1.1rem', color: TEXT2, lineHeight: 1.6, margin: '0 0 18px' }}>
            Every family is different. Choose the level of support that fits where you are right now.
          </p>
          <span style={{ fontFamily: U, fontSize: '0.76rem', fontWeight: 500, color: TEXT2, letterSpacing: '.04em', background: NAVY_TINT, display: 'inline-block', padding: '8px 18px', borderRadius: 999 }}>
            Pricing is shared during your free discovery call
          </span>
        </div>
      </section>

      {/* ── Packages ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24" style={{ background: LINEN }}>
        <div className="grid sm:grid-cols-3 gap-7 max-w-5xl mx-auto">
          {packages.map(({ name, duration, outcome, includes, featured }) => (
            <div
              key={name}
              style={{
                borderRadius: 18,
                border: `1px solid ${featured ? NAVY : HAIRLINE}`,
                display: 'flex',
                flexDirection: 'column' as const,
                overflow: 'hidden',
                ...(featured ? { boxShadow: '0 4px 28px rgba(74,95,127,0.18)' } : {}),
              }}
            >
              <div style={{ padding: '28px 28px 22px', background: featured ? NAVY : CREAM }}>
                {featured && (
                  <p style={{ fontFamily: U, fontSize: '0.64rem', fontWeight: 700, letterSpacing: '.20em', textTransform: 'uppercase' as const, color: 'rgba(250,245,234,0.5)', margin: '0 0 8px' }}>Most Popular</p>
                )}
                <p style={{ fontFamily: U, fontSize: '0.68rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase' as const, color: featured ? 'rgba(250,245,234,0.45)' : '#6E6A60', margin: '0 0 6px' }}>{duration}</p>
                <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.55rem', lineHeight: 1.1, color: featured ? '#FAF5EA' : TEXT, margin: 0 }}>{name}</h2>
              </div>
              <div style={{ padding: '22px 28px', background: LINEN, display: 'flex', flexDirection: 'column' as const, flex: 1, gap: 20 }}>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column' as const, gap: 12 }}>
                  {includes.map((item) => (
                    <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <CheckIcon />
                      <span style={{ fontFamily: B, fontSize: '0.94rem', color: TEXT2, lineHeight: 1.5 }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: 18 }}>
                  <p style={{ fontFamily: U, fontSize: '0.64rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase' as const, color: '#6E6A60', margin: '0 0 6px' }}>Outcome</p>
                  <p style={{ fontFamily: B, fontSize: '0.92rem', fontStyle: 'italic', color: TEXT, lineHeight: 1.45, margin: 0 }}>{outcome}</p>
                </div>
                <Link
                  href="/book"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '13px 20px', background: NAVY, color: '#FAF5EA', borderRadius: 999, fontFamily: U, fontWeight: 600, fontSize: '0.72rem', letterSpacing: '.14em', textTransform: 'uppercase' as const, textDecoration: 'none' }}
                >
                  Book a Free Call
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Add-ons ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-16 sm:py-20" style={{ background: CREAM }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.8rem', lineHeight: 1.1, color: TEXT, margin: '0 0 8px', letterSpacing: '-0.01em' }}>Add-ons</h2>
          <p style={{ fontFamily: B, fontSize: '0.94rem', color: TEXT2, margin: '0 0 24px', lineHeight: 1.5 }}>
            Pricing for all packages and add-ons is discussed during your discovery call.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {['Additional Session', 'IEP / School Prep Call', 'Custom Behavior Plan'].map((addon) => (
              <div key={addon} style={{ background: LINEN, borderRadius: 12, border: `1px solid ${HAIRLINE}`, padding: '18px 22px', display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckIcon />
                <p style={{ fontFamily: U, fontSize: '0.86rem', fontWeight: 600, color: TEXT, margin: 0 }}>{addon}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24" style={{ background: LINEN }}>
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 2.8rem)', lineHeight: 1.05, color: TEXT, margin: '0 0 36px', letterSpacing: '-0.015em' }}>
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-none" style={{ borderBottom: `1px solid ${HAIRLINE}` }}>
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
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-6 sm:px-10 lg:px-16 py-20 sm:py-24" style={{ background: NAVY, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Pill cream>REIMAGINE</Pill>
        </div>
        <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: 'clamp(2rem, 4vw, 3rem)', lineHeight: 1.05, color: '#FAF5EA', margin: '0 0 20px', letterSpacing: '-0.015em' }}>
          Not sure where to start?
        </h2>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22 }}>
          <HeartRule light center />
        </div>
        <p style={{ fontFamily: B, fontSize: '1.05rem', color: '#E0D9C7', lineHeight: 1.55, maxWidth: 480, margin: '0 auto 32px' }}>
          Let&apos;s talk. The discovery call is free and there&apos;s no pressure.
        </p>
        <Link
          href="/book"
          style={{ display: 'inline-flex', alignItems: 'center', padding: '15px 36px', background: LINEN, color: TEXT, borderRadius: 999, fontFamily: U, fontWeight: 600, fontSize: '0.84rem', letterSpacing: '.16em', textTransform: 'uppercase', textDecoration: 'none' }}
        >
          BOOK YOUR FREE DISCOVERY CALL →
        </Link>
      </section>

    </div>
  )
}
