import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Parent Coaching with Marissa | Calmer Families, Real Results',
  description:
    'Work one-on-one with a certified parent coach to build calmer routines, reduce daily struggles, and raise confident kids. Serving families across New Jersey.',
}

/* ── Reusable green CTA button ── */
function GreenButton({ href, children, large }: { href: string; children: React.ReactNode; large?: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-lg bg-[#2D5016] text-[#F5F0E8] font-semibold hover:bg-[#3a6b1e] transition-colors ${large ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm'}`}
    >
      {children}
    </Link>
  )
}

export default function HomePage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── 1. Hero ──────────────────────────────────────── */}
      <section className="relative bg-[#F5F0E8] pt-16 pb-24 sm:pt-24 sm:pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#2D5016]/60 uppercase tracking-widest mb-4">
              Parent Coaching · New Jersey
            </p>
            <h1 className="font-nunito text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#2D5016] leading-tight mb-6">
              Parenting is hard.<br />
              You don&apos;t have to<br />
              figure it out alone.
            </h1>
            <p className="text-lg text-[#2D5016]/70 leading-relaxed mb-10 max-w-xl">
              Support for families who want calmer routines, fewer daily struggles,
              and real strategies that actually work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <GreenButton href="/book" large>Book a Free Discovery Call</GreenButton>
              <Link
                href="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D5016] hover:text-[#3a6b1e] transition-colors pt-1 sm:pt-3"
              >
                Learn about the programs <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative blob */}
        <div
          aria-hidden
          className="absolute right-0 top-0 w-[45%] h-full hidden lg:block overflow-hidden"
        >
          <div className="absolute inset-0 bg-[#2D5016]/8 rounded-bl-[120px]" />
          <div className="absolute inset-12 bg-[#2D5016]/5 rounded-bl-[80px]" />
        </div>
      </section>

      {/* ── 2. Social Proof Bar ──────────────────────────── */}
      <section className="bg-[#2D5016] py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
            <p className="text-[#F5F0E8]/80 text-sm font-medium">
              Trusted by families across New Jersey
            </p>
            <div className="hidden sm:block w-px h-5 bg-[#F5F0E8]/20" />
            {[
              '50+ Families Helped',
              'Certified Parent Coach',
              'Personalized to Your Family',
            ].map((stat, i) => (
              <div key={stat} className="flex items-center gap-2">
                {i > 0 && <div className="hidden sm:block w-px h-5 bg-[#F5F0E8]/20" />}
                <CheckCircle2 className="w-4 h-4 text-[#F5F0E8]/60 flex-shrink-0" />
                <span className="text-[#F5F0E8] text-sm font-semibold">{stat}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. How It Works ─────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-nunito text-3xl sm:text-4xl font-extrabold text-[#2D5016] mb-3">
              Here&apos;s how we work together
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                title: 'Book a free discovery call',
                body: "We get to know your family and what you're working through — no pressure, just a real conversation.",
              },
              {
                step: '02',
                title: 'Get a personalized plan',
                body: "A strategy built around your child's age, temperament, and your goals. Nothing generic.",
              },
              {
                step: '03',
                title: 'See real change at home',
                body: 'With ongoing support so you never feel stuck — small, consistent wins that build lasting confidence.',
              },
            ].map(({ step, title, body }) => (
              <div key={step} className="relative p-8 rounded-2xl bg-[#F5F0E8] border border-[#2D5016]/10">
                <p className="font-nunito text-5xl font-extrabold text-[#2D5016]/10 mb-4">{step}</p>
                <h3 className="font-nunito text-lg font-bold text-[#2D5016] mb-3">{title}</h3>
                <p className="text-sm text-[#2D5016]/65 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Services Preview ─────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-nunito text-3xl sm:text-4xl font-extrabold text-[#2D5016] mb-3">
              Programs designed around your family
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                name: 'Confident Parent Program',
                duration: '2 Weeks',
                desc: 'A focused, short-term package for immediate clarity and support. Two private sessions, a personalized home strategy plan, custom scripts for behavior and transitions, and two weeks of text/email support.',
              },
              {
                name: 'Parent Coaching Partnership',
                duration: '4 Weeks',
                desc: "A higher-touch package for building consistency and real change. Four weekly sessions, a fully customized home support plan, ongoing text/email support, school and IEP guidance, and a routine/behavior tracking tool.",
                featured: true,
              },
              {
                name: 'Ongoing Support',
                duration: 'Monthly',
                desc: 'Continued guidance as your child grows. One monthly check-in call, ongoing text/email access, strategy adjustments, and school communication support.',
              },
            ].map(({ name, duration, desc, featured }) => (
              <div
                key={name}
                className={`rounded-2xl p-8 flex flex-col gap-4 border ${featured ? 'bg-[#2D5016] text-[#F5F0E8] border-[#2D5016]' : 'bg-white border-[#2D5016]/10'}`}
              >
                <div>
                  <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${featured ? 'text-[#F5F0E8]/60' : 'text-[#2D5016]/50'}`}>
                    {duration}
                  </p>
                  <h3 className={`font-nunito text-xl font-extrabold ${featured ? 'text-[#F5F0E8]' : 'text-[#2D5016]'}`}>
                    {name}
                  </h3>
                </div>
                <p className={`text-sm leading-relaxed flex-1 ${featured ? 'text-[#F5F0E8]/80' : 'text-[#2D5016]/65'}`}>
                  {desc}
                </p>
                <Link
                  href="/services"
                  className={`inline-flex items-center gap-1 text-sm font-semibold transition-colors ${featured ? 'text-[#F5F0E8] hover:text-[#F5F0E8]/80' : 'text-[#2D5016] hover:text-[#3a6b1e]'}`}
                >
                  Learn More <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. About Marissa Teaser ──────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-12">
            {/* Photo placeholder */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#2D5016]/10 border-4 border-[#2D5016]/20 flex items-center justify-center">
                <span className="font-nunito text-5xl font-extrabold text-[#2D5016]/30">M</span>
              </div>
            </div>
            {/* Copy */}
            <div className="max-w-xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[#2D5016]/50 mb-3">Meet Your Coach</p>
              <h2 className="font-nunito text-3xl sm:text-4xl font-extrabold text-[#2D5016] mb-5">
                Hi, I&apos;m Marissa.
              </h2>
              <p className="text-[#2D5016]/70 leading-relaxed mb-4">
                I became a parent coach because I know firsthand how isolating and overwhelming parenting can feel —
                especially when the strategies you&apos;ve tried just aren&apos;t working. I&apos;ve sat where you&apos;re sitting.
              </p>
              <p className="text-[#2D5016]/70 leading-relaxed mb-6">
                My approach is practical, compassionate, and built around <em>your</em> family. No judgment.
                No one-size-fits-all answers. Just real strategies you can start using today.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#2D5016] hover:text-[#3a6b1e] transition-colors"
              >
                Meet Marissa <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. Testimonials ─────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-nunito text-3xl sm:text-4xl font-extrabold text-[#2D5016] mb-3">
              What parents are saying
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "Before working with Marissa, mornings were a battleground. Now my kids actually get ready without meltdowns. I didn't think it was possible.",
                name: 'Sarah M.',
                location: 'Montclair, NJ',
              },
              {
                quote:
                  "Marissa gave me real tools, not just reassurance. She helped me understand my son in a way I never had before. Worth every minute.",
                name: 'James & Priya T.',
                location: 'Princeton, NJ',
              },
              {
                quote:
                  "I was skeptical about coaching, but Marissa felt like a partner, not a consultant. Our family dynamic completely shifted in four weeks.",
                name: 'Rachel K.',
                location: 'Hoboken, NJ',
              },
            ].map(({ quote, name, location }) => (
              <div key={name} className="bg-white rounded-2xl p-8 border-l-4 border-[#2D5016] shadow-sm">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#2D5016] text-[#2D5016]" />
                  ))}
                </div>
                <p className="text-[#2D5016]/75 leading-relaxed text-sm mb-6 italic">&ldquo;{quote}&rdquo;</p>
                <div>
                  <p className="font-semibold text-[#2D5016] text-sm">{name}</p>
                  <p className="text-xs text-[#2D5016]/50">{location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. Final CTA ────────────────────────────────── */}
      <section className="bg-[#2D5016] py-20 sm:py-28">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-nunito text-3xl sm:text-4xl font-extrabold text-[#F5F0E8] mb-4">
            Ready for calmer mornings<br className="hidden sm:block" /> and fewer battles?
          </h2>
          <p className="text-[#F5F0E8]/75 text-lg mb-10">
            Start with a free, no-pressure discovery call.
          </p>
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-lg bg-[#F5F0E8] text-[#2D5016] font-bold px-8 py-4 text-base hover:bg-white transition-colors"
          >
            Book Your Free Call
          </Link>
          <p className="mt-6 text-sm text-[#F5F0E8]/50">
            parentcoachwithmarissa@gmail.com
          </p>
        </div>
      </section>

    </div>
  )
}
