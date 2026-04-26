import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Palette | Parent Coaching with Marissa',
  robots: { index: false, follow: false },
}

const existing = [
  { name: 'Forest Green', hex: '#2D5016', note: 'Primary — headings, buttons, icons' },
  { name: 'Warm Cream', hex: '#F5F0E8', note: 'Background — sections, nav' },
  { name: 'Green Hover', hex: '#3a6b1e', note: 'Hover state for green elements' },
]

const optionA = [
  { name: 'Dusty Slate Blue', hex: '#4A6FA5', note: 'Main accent — CTAs, links, highlights' },
  { name: 'Slate Hover', hex: '#3A5A8C', note: 'Hover / pressed state' },
  { name: 'Slate Tint', hex: '#EBF0F8', note: 'Light section backgrounds, badges' },
]

const optionB = [
  { name: 'Deep Navy', hex: '#1E3A5F', note: 'High-contrast — feature sections, dark bars' },
  { name: 'Navy Mid', hex: '#2C4F80', note: 'Hover state' },
  { name: 'Navy Tint', hex: '#E8EEF6', note: 'Light backgrounds' },
]

const optionC = [
  { name: 'Soft Periwinkle', hex: '#6B8EC4', note: 'Lighter accent — icons, tags, dividers' },
  { name: 'Periwinkle Dark', hex: '#5578B0', note: 'Hover / text on light bg' },
  { name: 'Periwinkle Tint', hex: '#EDF1FA', note: 'Soft section fill' },
]

function Swatch({ name, hex, note }: { name: string; hex: string; note: string }) {
  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-black/8 w-44">
      <div className="h-24" style={{ backgroundColor: hex }} />
      <div className="bg-white p-3">
        <p className="font-semibold text-[13px] text-[#1a1a1a]">{name}</p>
        <p className="font-mono text-[11px] text-[#666] mt-0.5">{hex}</p>
        <p className="text-[11px] text-[#999] mt-1 leading-snug">{note}</p>
      </div>
    </div>
  )
}

function Section({ label, swatches }: { label: string; swatches: typeof existing }) {
  return (
    <div className="mb-10">
      <p className="text-[11px] font-bold uppercase tracking-widest text-[#2D5016]/50 mb-4">{label}</p>
      <div className="flex flex-wrap gap-4">
        {swatches.map((s) => <Swatch key={s.hex} {...s} />)}
      </div>
    </div>
  )
}

export default function ColorsPage() {
  return (
    <div className="bg-[#F5F0E8] min-h-screen py-16 sm:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#2D5016]/50 mb-3">Internal Reference</p>
        <h1 className="font-nunito text-3xl sm:text-4xl font-extrabold text-[#2D5016] mb-2">
          Color Palette
        </h1>
        <p className="text-[#2D5016]/60 text-sm mb-12">
          Exploring blue as a contrasting accent to forest green and warm cream.
        </p>

        <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-8 mb-8">
          <Section label="Existing Palette" swatches={existing} />

          <hr className="border-[#2D5016]/10 mb-10" />

          <Section label="Option A — Dusty Slate Blue (Recommended)" swatches={optionA} />
          <Section label="Option B — Deep Navy" swatches={optionB} />
          <Section label="Option C — Soft Periwinkle" swatches={optionC} />
        </div>

        {/* Combination previews */}
        <h2 className="font-nunito text-xl font-bold text-[#2D5016] mb-6">Usage Combinations</h2>

        {/* Option A */}
        <div className="rounded-2xl overflow-hidden border border-[#2D5016]/15 shadow-sm mb-6">
          <div className="px-6 py-4 bg-[#2D5016]">
            <p className="text-[#F5F0E8] font-bold text-sm">Option A · Dusty Slate — Primary green + Blue accent</p>
          </div>
          <div className="px-6 py-6 bg-[#F5F0E8] flex items-center gap-3 flex-wrap">
            <span className="text-[#2D5016]/70 text-sm mr-2">Main content in forest green. Accent actions in dusty slate.</span>
            <button className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: '#4A6FA5' }}>Book a Free Call</button>
            <button className="px-4 py-2 rounded-lg text-sm font-bold text-[#F5F0E8] bg-[#2D5016]">Learn More</button>
          </div>
        </div>

        {/* Option B */}
        <div className="rounded-2xl overflow-hidden border border-[#c8d5e8] shadow-sm mb-6">
          <div className="px-6 py-4" style={{ backgroundColor: '#1E3A5F' }}>
            <p className="text-white font-bold text-sm">Option B · Deep Navy — Alternate dark section color</p>
          </div>
          <div className="px-6 py-6 bg-[#F5F0E8] flex items-center gap-3 flex-wrap">
            <span className="text-[#2D5016]/70 text-sm mr-2">Swap the green feature bar for deep navy. Strong contrast.</span>
            <button className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: '#1E3A5F' }}>Book a Free Call</button>
            <button className="px-4 py-2 rounded-lg text-sm font-bold text-[#F5F0E8] bg-[#2D5016]">Services</button>
          </div>
        </div>

        {/* Option C */}
        <div className="rounded-2xl overflow-hidden border border-[#cdd8ee] shadow-sm mb-6">
          <div className="px-6 py-4" style={{ backgroundColor: '#EDF1FA' }}>
            <p className="text-[#2D5016] font-bold text-sm">Option C · Periwinkle — Light and airy accent</p>
          </div>
          <div className="px-6 py-6 bg-white flex items-center gap-3 flex-wrap">
            <span className="text-[#2D5016]/70 text-sm mr-2">Soft, friendly. Best for icons and tags — not primary CTAs.</span>
            <button className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: '#6B8EC4' }}>Secondary Action</button>
            <button className="px-4 py-2 rounded-lg text-sm font-bold text-[#F5F0E8] bg-[#2D5016]">Primary CTA</button>
          </div>
        </div>

      </div>
    </div>
  )
}
