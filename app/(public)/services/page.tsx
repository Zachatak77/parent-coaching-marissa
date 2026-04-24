import type { Metadata } from 'next'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export const metadata: Metadata = {
  title: 'Coaching Programs | Parent Coaching with Marissa',
  description:
    'Explore parent coaching packages — from a focused 2-week program to ongoing monthly support. All pricing discussed during your free discovery call.',
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
    a: 'I work with families with children from toddlers through teenagers. The strategies are always tailored to your child\'s specific age, stage, and temperament.',
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

export default function ServicesPage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Header ──────────────────────────────────────── */}
      <section className="bg-[#F5F0E8] pt-16 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-nunito text-4xl sm:text-5xl font-extrabold text-[#2D5016] mb-4">
            Programs built around your family
          </h1>
          <p className="text-lg text-[#2D5016]/70 mb-4">
            Every family is different. Choose the level of support that fits where you are right now.
          </p>
          <p className="text-sm text-[#2D5016]/50 bg-[#2D5016]/5 inline-block px-4 py-2 rounded-full">
            Pricing is shared during your free discovery call so we can recommend the right fit for your family.
          </p>
        </div>
      </section>

      {/* ── Packages ────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-8">
            {packages.map(({ name, duration, outcome, includes, featured }) => (
              <div
                key={name}
                className={`rounded-2xl border flex flex-col ${featured ? 'border-[#2D5016] shadow-xl ring-2 ring-[#2D5016]/20' : 'border-[#2D5016]/15'}`}
              >
                <div className={`px-8 pt-8 pb-6 rounded-t-2xl ${featured ? 'bg-[#2D5016]' : 'bg-[#F5F0E8]'}`}>
                  {featured && (
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#F5F0E8]/60 mb-2">Most Popular</p>
                  )}
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${featured ? 'text-[#F5F0E8]/50' : 'text-[#2D5016]/50'}`}>
                    {duration}
                  </p>
                  <h2 className={`font-nunito text-2xl font-extrabold ${featured ? 'text-[#F5F0E8]' : 'text-[#2D5016]'}`}>
                    {name}
                  </h2>
                </div>

                <div className="px-8 py-6 flex flex-col flex-1 gap-6">
                  <ul className="space-y-3 flex-1">
                    {includes.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#2D5016] mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-[#2D5016]/75 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="pt-4 border-t border-[#2D5016]/10">
                    <p className="text-xs font-semibold text-[#2D5016]/50 uppercase tracking-wide mb-1">Outcome</p>
                    <p className="text-sm font-semibold text-[#2D5016] italic">{outcome}</p>
                  </div>

                  <Link
                    href="/book"
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition-colors ${featured ? 'bg-[#2D5016] text-[#F5F0E8] hover:bg-[#3a6b1e]' : 'bg-[#2D5016]/10 text-[#2D5016] hover:bg-[#2D5016]/20'}`}
                  >
                    Book a Free Call <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Add-ons ─────────────────────────────────────── */}
      <section className="py-16 sm:py-20 bg-[#F5F0E8]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-nunito text-2xl font-extrabold text-[#2D5016] mb-2">Add-ons</h2>
          <p className="text-sm text-[#2D5016]/60 mb-8">
            Pricing for all packages and add-ons is discussed during your discovery call.
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {['Additional Session', 'IEP/School Prep Call', 'Custom Behavior Plan'].map((addon) => (
              <div key={addon} className="bg-white rounded-xl border border-[#2D5016]/10 px-6 py-5 flex items-center gap-3">
                <Check className="w-4 h-4 text-[#2D5016] flex-shrink-0" />
                <p className="text-sm font-semibold text-[#2D5016]">{addon}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────── */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-nunito text-3xl font-extrabold text-[#2D5016] mb-10">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible className="w-full divide-y divide-[#2D5016]/10">
            {faqs.map(({ q, a }, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border-none py-1">
                <AccordionTrigger className="text-left font-semibold text-[#2D5016] hover:no-underline hover:text-[#3a6b1e] py-4 text-base">
                  {q}
                </AccordionTrigger>
                <AccordionContent className="text-[#2D5016]/70 leading-relaxed text-sm pb-5">
                  {a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────── */}
      <section className="bg-[#2D5016] py-16 sm:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-nunito text-3xl font-extrabold text-[#F5F0E8] mb-3">
            Not sure where to start?
          </h2>
          <p className="text-[#F5F0E8]/70 mb-8">Let&apos;s talk. The discovery call is free and there&apos;s no pressure.</p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-lg bg-[#F5F0E8] text-[#2D5016] font-bold px-8 py-4 hover:bg-white transition-colors"
          >
            Book a Free Discovery Call <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}
