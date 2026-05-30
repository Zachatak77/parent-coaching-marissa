'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const BLUE     = '#5F728D'
const BG       = '#F7F7F5'
const HAIRLINE = '#D6D6D2'
const TEXT     = '#1F1D1A'
const TEXT2    = '#3A372F'
const DIM      = '#6E6A60'
const CHAR     = '#2C2A28'

const links = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
]

function TestNav() {
  const [open, setOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const pathname = usePathname()

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  React.useEffect(() => { setOpen(false) }, [pathname])

  return (
    <header
      style={{ borderBottom: `1px solid ${HAIRLINE}`, backgroundColor: BG }}
      className={cn('sticky top-0 z-50 w-full transition-shadow duration-200', scrolled && 'shadow-sm')}
    >
      <nav className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6 sm:px-10 lg:px-16">
        <Link href="/test" className="flex items-center flex-shrink-0">
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', letterSpacing: '.22em', textTransform: 'uppercase', color: DIM, lineHeight: 1, marginBottom: 1 }}>Reimagine</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: BLUE, lineHeight: 1 }}>Parenting</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '0.92rem', letterSpacing: '0.02em', color: pathname === href ? TEXT : TEXT2, textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
          <Link
            href="/book"
            style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 22px', background: BLUE, color: BG, borderRadius: '999px', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '.14em', textTransform: 'uppercase', textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Book a Consult
          </Link>
        </div>

        <button className="md:hidden p-2 rounded-md" style={{ color: TEXT }} onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <div
        style={{ backgroundColor: BG, borderTop: `1px solid ${HAIRLINE}` }}
        className={cn('md:hidden overflow-hidden transition-all duration-200 ease-in-out', open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0')}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '0.92rem', color: TEXT2, textDecoration: 'none' }} className="py-1">{label}</Link>
          ))}
          <Link href="/book" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '11px 22px', background: BLUE, color: BG, borderRadius: '999px', fontFamily: 'var(--font-ui)', fontWeight: 600, fontSize: '0.72rem', letterSpacing: '.14em', textTransform: 'uppercase', textDecoration: 'none', marginTop: 4 }}>
            Book a Consult
          </Link>
        </div>
      </div>
    </header>
  )
}

export default function ColorTestLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: BG }}>
      <TestNav />
      <main className="flex-1">{children}</main>
      <footer>
        <div style={{ borderTop: `1px solid ${HAIRLINE}`, backgroundColor: BG }} className="py-6">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '.10em', textTransform: 'uppercase', color: DIM }} className="mr-2">Portal access</p>
            <Link href="/login" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.74rem', color: TEXT2, border: `1px solid ${HAIRLINE}`, borderRadius: 6, padding: '6px 14px', textDecoration: 'none' }}>
              Portal Login
            </Link>
          </div>
        </div>
        <div style={{ backgroundColor: CHAR, color: '#C9BFAA' }} className="py-10 px-6 sm:px-10 lg:px-16">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: BG }}>REIMAGINE Parenting</div>
            <div className="flex flex-col sm:items-end gap-1 text-center sm:text-right">
              <a href="mailto:parentcoachwithmarissa@gmail.com" style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: '#C9BFAA', textDecoration: 'none' }}>parentcoachwithmarissa@gmail.com</a>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '.10em', textTransform: 'uppercase', color: DIM }}>reimagineparenting.co · © {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
