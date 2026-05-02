import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Heart, Lightbulb, TrendingUp, Award } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Marissa | Reimagine Parenting',
  description:
    'Learn about Marissa, her story, her coaching philosophy, and why she became a certified parent coach dedicated to helping families thrive.',
}

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="bg-[#F5F0E8] pt-16 pb-20 sm:pt-24 sm:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center gap-12">
            {/* Photo placeholder */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 sm:w-64 sm:h-64 rounded-full bg-[#2D5016]/10 border-4 border-[#2D5016]/20 flex items-center justify-center shadow-md">
                <span className="font-nunito text-6xl font-extrabold text-[#2D5016]/25">M</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#2D5016]/50 mb-3">Your Coach</p>
              <h1 className="font-nunito text-4xl sm:text-5xl font-extrabold text-[#2D5016] leading-tight mb-4">
                Hi, I&apos;m Marissa.
              </h1>
              <p className="text-lg text-[#2D5016]/70 leading-relaxed max-w-xl">
                I help parents feel more confident, connected, and calm —
                even on the hard days.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── My Story ────────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2D5016]/50 mb-4">My Story</p>
          <h2 className="font-nunito text-3xl font-extrabold text-[#2D5016] mb-8">
            Why I became a parent coach
          </h2>
          <div className="space-y-6 text-[#2D5016]/75 leading-relaxed">
            <p>
              I didn&apos;t always have the answers. Like so many parents, I found myself cycling through the same
              struggles — the power struggles at bedtime, the meltdowns over nothing, the feeling that no matter
              what I tried, nothing was working. I remember sitting in my car one afternoon, exhausted, wondering
              if I was just doing it all wrong.
            </p>
            <p>
              What I discovered — slowly, through research, training, and eventually my own coaching journey —
              is that most parents aren&apos;t failing. They&apos;re just missing a few specific tools. The kind
              that are actually designed for real life, with real kids, in real families. Not Instagram perfection.
              Not textbook theories. Real strategies.
            </p>
            <p>
              That&apos;s what drew me to parent coaching. I became certified because I wanted to help other families
              find what I found: a way through the hard days that actually feels sustainable. My approach blends
              proven coaching methods with genuine compassion — because the best strategy in the world won&apos;t
              work if you don&apos;t feel understood first.
            </p>
          </div>
        </div>
      </section>

      {/* ── Philosophy ──────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#F5F0E8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs font-bold uppercase tracking-widest text-[#2D5016]/50 mb-3">How I Work</p>
            <h2 className="font-nunito text-3xl sm:text-4xl font-extrabold text-[#2D5016]">
              My coaching philosophy
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                icon: Heart,
                title: 'Connection first',
                body: 'Before strategies, before scripts — parents need to feel heard and understood. Every session starts with you, not a checklist.',
              },
              {
                icon: Lightbulb,
                title: 'Real-life strategies',
                body: "Everything I share is practical, age-appropriate, and designed for actual family life. If it doesn't work in your kitchen on a Tuesday morning, it doesn't make the plan.",
              },
              {
                icon: TrendingUp,
                title: 'Progress over perfection',
                body: "Small, consistent wins matter more than getting it right every time. We celebrate the moments that are better — not just the ones that are perfect.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-white rounded-2xl p-8 border border-[#2D5016]/10">
                <div className="w-12 h-12 rounded-full bg-[#2D5016]/10 flex items-center justify-center mb-5">
                  <Icon className="w-6 h-6 text-[#2D5016]" />
                </div>
                <h3 className="font-nunito text-xl font-bold text-[#2D5016] mb-3">{title}</h3>
                <p className="text-sm text-[#2D5016]/65 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Credentials ─────────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#2D5016]/50 mb-4">Training &amp; Credentials</p>
          <h2 className="font-nunito text-3xl font-extrabold text-[#2D5016] mb-10">
            Trained. Certified. Committed.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-[#F5F0E8] border border-[#2D5016]/10 w-full sm:w-64">
              <div className="w-14 h-14 rounded-full bg-[#2D5016]/10 flex items-center justify-center">
                <Award className="w-7 h-7 text-[#2D5016]" />
              </div>
              <p className="font-nunito font-bold text-[#2D5016]">Certified Parent Coach</p>
              <p className="text-xs text-[#2D5016]/55 text-center">Professionally trained in evidence-based parent coaching methodologies</p>
            </div>
            <div className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-[#F5F0E8] border border-[#2D5016]/10 w-full sm:w-64">
              <div className="w-14 h-14 rounded-full bg-[#2D5016]/10 flex items-center justify-center">
                <Award className="w-7 h-7 text-[#2D5016]" />
              </div>
              <p className="font-nunito font-bold text-[#2D5016]">Family Systems Training</p>
              <p className="text-xs text-[#2D5016]/55 text-center">Specialized training in child development and family communication</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="bg-[#2D5016] py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-nunito text-3xl font-extrabold text-[#F5F0E8] mb-4">
            Ready to get started?
          </h2>
          <p className="text-[#F5F0E8]/70 mb-8">Book a free discovery call and let&apos;s talk about your family.</p>
          <Link
            href="/book"
            className="inline-flex items-center gap-2 rounded-lg bg-[#D97B2E] text-white font-bold px-8 py-4 hover:bg-[#C06B20] transition-colors"
          >
            Book a Free Discovery Call <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  )
}
