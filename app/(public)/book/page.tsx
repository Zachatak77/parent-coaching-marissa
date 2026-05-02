import type { Metadata } from 'next'
import { BookForm } from '@/components/public/book-form'
import { Shield, Clock, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Book a Free Discovery Call | Reimagine Parenting',
  description:
    "Book a free, no-pressure discovery call with Marissa. Share what's going on at home and find out if coaching is the right fit for your family.",
}

export default function BookPage() {
  return (
    <div className="bg-[#F5F0E8] min-h-screen">

      {/* ── Header ──────────────────────────────────────── */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-nunito text-4xl sm:text-5xl font-extrabold text-[#2D5016] mb-4">
            Let&apos;s talk about your family.
          </h1>
          <p className="text-lg text-[#2D5016]/70 leading-relaxed max-w-xl mx-auto">
            This free call is a chance to share what&apos;s going on at home and see if coaching is
            a good fit. No pressure, no commitment.
          </p>
        </div>
      </section>

      {/* ── Main content ────────────────────────────────── */}
      <section className="pb-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-10 items-start">

            {/* Form — wider column */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-[#2D5016]/10 p-8">
              <h2 className="font-nunito text-xl font-bold text-[#2D5016] mb-6">
                Tell me about your family
              </h2>
              <BookForm />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              {/* Trust signals */}
              <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-6 space-y-5">
                <h3 className="font-nunito font-bold text-[#2D5016]">What to expect</h3>
                {[
                  {
                    icon: Clock,
                    title: '20–30 minute call',
                    desc: 'A relaxed conversation — not a sales pitch.',
                  },
                  {
                    icon: MessageCircle,
                    title: 'Share your situation',
                    desc: "Tell me what's hard right now. I listen first.",
                  },
                  {
                    icon: Shield,
                    title: 'No commitment',
                    desc: 'You decide if coaching feels right. Zero pressure.',
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-full bg-[#2D5016]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-[#2D5016]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#2D5016]">{title}</p>
                      <p className="text-xs text-[#2D5016]/60 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quote */}
              <div className="bg-[#2D5016] rounded-2xl p-6">
                <p className="text-[#F5F0E8]/85 text-sm leading-relaxed italic mb-4">
                  &ldquo;I was nervous to reach out, but Marissa made me feel so at ease on our first
                  call. I knew within five minutes it was exactly what I needed.&rdquo;
                </p>
                <p className="text-xs text-[#F5F0E8]/50 font-semibold">— Parent, Montclair NJ</p>
              </div>

              {/* Contact */}
              <p className="text-center text-sm text-[#2D5016]/55">
                Prefer email?{' '}
                <a
                  href="mailto:parentcoachwithmarissa@gmail.com"
                  className="text-[#2D5016] font-semibold hover:underline"
                >
                  parentcoachwithmarissa@gmail.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
