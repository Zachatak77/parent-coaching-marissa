import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Color Palette | Parent Coaching with Marissa',
  robots: { index: false, follow: false },
}

const current = [
  { name: 'Forest Green', hex: '#2D5016', note: 'Primary — headings, buttons, nav, icons, borders' },
  { name: 'Green Hover',  hex: '#3A6B1E', note: 'Hover state on all green buttons and links' },
  { name: 'Warm Cream',   hex: '#F5F0E8', note: 'Page and section backgrounds, nav fill' },
  { name: 'White',        hex: '#FFFFFF', note: 'Card backgrounds, form surfaces' },
]

const proposed = [
  {
    label: 'Secondary / Warmth',
    swatches: [
      { name: 'Amber',     hex: '#D97B2E', note: 'Energy, CTAs, playful moments',        var: '--amber' },
      { name: 'Marigold',  hex: '#F0A84A', note: 'Warm highlight, badges, tags',         var: '--marigold' },
      { name: 'Straw',     hex: '#FAE6C0', note: 'Warm cream, card backgrounds',         var: '--straw' },
      { name: 'Parchment', hex: '#FDF8F0', note: 'Warm off-white page background',       var: '--parchment' },
    ],
  },
  {
    label: 'Blue Accent',
    swatches: [
      { name: 'Slate',     hex: '#1B4A6B', note: 'Deep trust blue — links, info states', var: '--slate' },
      { name: 'River',     hex: '#2E6FA3', note: 'Mid blue — interactive, badges',       var: '--river' },
      { name: 'Sky',       hex: '#6AAFD6', note: 'Soft blue — hover, icons',             var: '--sky' },
      { name: 'Haze',      hex: '#D0E8F4', note: 'Light tint — info backgrounds',        var: '--haze' },
      { name: 'Frost',     hex: '#EEF6FB', note: 'Near-white blue — subtle fills',       var: '--frost' },
    ],
  },
  {
    label: 'Neutrals',
    swatches: [
      { name: 'Bark',      hex: '#2A2217', note: 'Near-black body text',                 var: '--bark' },
      { name: 'Soil',      hex: '#5C4A32', note: 'Warm dark brown, subheadings',         var: '--soil' },
      { name: 'Clay',      hex: '#A08060', note: 'Tertiary text, metadata',              var: '--clay' },
      { name: 'Sand',      hex: '#E8DED0', note: 'Border strokes, dividers',             var: '--sand' },
      { name: 'Linen',     hex: '#F6F2EC', note: 'Section fills, neutral cards',         var: '--linen' },
    ],
  },
]

const DARK = new Set(['#2D5016','#3A6B1E','#1B4A6B','#2E6FA3','#2A2217','#5C4A32','#D97B2E'])

function Swatch({ name, hex, note, cssVar }: { name: string; hex: string; note: string; cssVar?: string }) {
  const dark = DARK.has(hex.toUpperCase()) || DARK.has(hex)
  return (
    <div className="rounded-xl overflow-hidden shadow-sm border border-black/8 flex-shrink-0 w-40">
      <div className="h-20 relative" style={{ backgroundColor: hex }}>
        {cssVar && (
          <span
            className="absolute bottom-2 left-2 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded"
            style={{ background: dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)', color: dark ? '#fff' : '#333' }}
          >
            {cssVar}
          </span>
        )}
      </div>
      <div className="bg-white p-3">
        <p className="font-semibold text-[13px] text-[#1a1a1a]">{name}</p>
        <p className="font-mono text-[11px] text-[#666] mt-0.5">{hex}</p>
        <p className="text-[11px] text-[#999] mt-1 leading-snug">{note}</p>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-widest text-[#2D5016]/50 mb-5">{children}</p>
}

export default function ColorsPage() {
  return (
    <div className="bg-[#F5F0E8] min-h-screen py-16 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-[11px] font-bold uppercase tracking-widest text-[#2D5016]/50 mb-3">Internal Reference</p>
        <h1 className="font-nunito text-3xl sm:text-4xl font-extrabold text-[#2D5016] mb-2">Color Palette</h1>
        <p className="text-[#2D5016]/60 text-sm mb-14">Current hardcoded colors vs. proposed design tokens.</p>

        {/* ── Currently In Use ── */}
        <div className="mb-14">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-nunito text-xl font-bold text-[#2D5016]">Currently in use</h2>
            <span className="text-[11px] font-bold uppercase tracking-widest bg-[#2D5016] text-[#F5F0E8] px-2.5 py-1 rounded-full">Live</span>
          </div>
          <p className="text-[13px] text-[#2D5016]/60 mb-6 -mt-2">Hardcoded hex values used across the site today. No CSS variables.</p>
          <div className="flex flex-wrap gap-4">
            {current.map((s) => <Swatch key={s.hex} {...s} />)}
          </div>
        </div>

        <div className="border-t border-[#2D5016]/10 mb-14" />

        {/* ── Newly Proposed ── */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <h2 className="font-nunito text-xl font-bold text-[#2D5016]">Newly proposed</h2>
            <span className="text-[11px] font-bold uppercase tracking-widest bg-[#2E6FA3] text-white px-2.5 py-1 rounded-full">Proposed</span>
          </div>
          <p className="text-[13px] text-[#2D5016]/60 mb-10 -mt-2">
            Defined as CSS custom properties in <code className="font-mono bg-[#2D5016]/8 px-1.5 py-0.5 rounded text-[12px]">globals.css</code>.
            Use via <code className="font-mono bg-[#2D5016]/8 px-1.5 py-0.5 rounded text-[12px]">var(--token)</code> or apply to Tailwind config to use as utility classes.
          </p>

          <div className="space-y-12">
            {proposed.map(({ label, swatches }) => (
              <div key={label}>
                <SectionLabel>{label}</SectionLabel>
                <div className="flex flex-wrap gap-4">
                  {swatches.map((s) => <Swatch key={s.hex} name={s.name} hex={s.hex} note={s.note} cssVar={s.var} />)}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
