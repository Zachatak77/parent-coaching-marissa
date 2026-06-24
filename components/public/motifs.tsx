import Link from 'next/link'

const NAVY  = '#5F728D'
const TEXT  = '#1F1D1A'
const TEXT2 = '#3A372F'
const DIM   = '#6E6A60'
const PEACH = '#E98773'
const STRAW = '#EFB63F'
const U = 'var(--font-ui)'

export function Eyebrow({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <p
      className="inline-flex items-center gap-2.5"
      style={{
        fontFamily: U,
        fontWeight: 600,
        fontSize: '0.72rem',
        letterSpacing: '.2em',
        textTransform: 'uppercase',
        color: light ? 'rgba(255,255,255,0.65)' : DIM,
        margin: 0,
      }}
    >
      <span aria-hidden className="h-1.5 w-1.5 rounded-full" style={{ background: PEACH }} />
      {children}
    </p>
  )
}

export function ArrowCta({
  href,
  children,
  variant = 'navy',
}: {
  href: string
  children: React.ReactNode
  variant?: 'navy' | 'white' | 'ghost' | 'ghost-light'
}) {
  const base =
    'group inline-flex items-center gap-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
  const styles: Record<string, { className: string; style: React.CSSProperties }> = {
    navy: {
      className: `${base} px-7 py-[15px] hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-[#5F728D]`,
      style: { background: NAVY, color: '#fff' },
    },
    white: {
      className: `${base} px-7 py-[15px] hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-white focus-visible:ring-offset-transparent`,
      style: { background: '#fff', color: TEXT },
    },
    ghost: {
      className: `${base} px-7 py-[14px] border hover:bg-white focus-visible:ring-[#5F728D]`,
      style: { borderColor: '#D6D2C8', color: TEXT2, background: 'transparent' },
    },
    'ghost-light': {
      className: `${base} px-7 py-[14px] border hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-transparent`,
      style: { borderColor: 'rgba(255,255,255,0.3)', color: '#fff', background: 'transparent' },
    },
  }
  const v = styles[variant]
  return (
    <Link
      href={href}
      className={v.className}
      style={{ ...v.style, fontFamily: U, fontWeight: 600, fontSize: '0.82rem', letterSpacing: '.12em', textTransform: 'uppercase', textDecoration: 'none' }}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </Link>
  )
}

export function ArrowLink({
  href,
  children,
  color = NAVY,
}: {
  href: string
  children: React.ReactNode
  color?: string
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5F728D]"
      style={{ fontFamily: U, fontWeight: 600, fontSize: '0.78rem', letterSpacing: '.14em', textTransform: 'uppercase', color, textDecoration: 'none' }}
    >
      {children}
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
    </Link>
  )
}

export function Stars() {
  return (
    <div className="flex gap-1" aria-hidden>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={STRAW}>
          <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8z" />
        </svg>
      ))}
    </div>
  )
}
