'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
]

const NAVY = '#4A5F7F'
const CREAM = '#F5EFE2'
const TEXT2 = '#3A372F'
const HAIRLINE = '#D9CFB9'

export function PublicNav() {
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
      style={{ borderBottom: `1px solid ${HAIRLINE}`, backgroundColor: CREAM }}
      className={cn('sticky top-0 z-50 w-full transition-shadow duration-200', scrolled && 'shadow-sm')}
    >
      <nav className="max-w-6xl mx-auto flex h-16 items-center justify-between px-6 sm:px-10 lg:px-16">

        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <div>
            <span style={{ display: 'block', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.62rem', letterSpacing: '.20em', textTransform: 'uppercase', color: NAVY, lineHeight: 1, marginBottom: 2 }}>Reimagine</span>
            <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.2rem', color: '#1F1D1A', lineHeight: 1, paddingLeft: 12 }}>Parenting</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'var(--font-ui)',
                fontWeight: 500,
                fontSize: '0.92rem',
                letterSpacing: '0.02em',
                color: pathname === href ? '#1F1D1A' : TEXT2,
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/book"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '10px 22px',
              background: NAVY,
              color: '#FAF5EA',
              borderRadius: '999px',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: '0.72rem',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              transition: 'opacity 0.18s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Book a Call
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md transition-colors"
          style={{ color: '#1F1D1A' }}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      <div
        style={{ backgroundColor: CREAM, borderTop: `1px solid ${HAIRLINE}` }}
        className={cn(
          'md:hidden overflow-hidden transition-all duration-200 ease-in-out',
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-6 py-4 flex flex-col gap-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              style={{ fontFamily: 'var(--font-ui)', fontWeight: 500, fontSize: '0.92rem', color: TEXT2, textDecoration: 'none' }}
              className="py-1"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/book"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '11px 22px',
              background: NAVY,
              color: '#FAF5EA',
              borderRadius: '999px',
              fontFamily: 'var(--font-ui)',
              fontWeight: 600,
              fontSize: '0.72rem',
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              marginTop: 4,
            }}
          >
            Book a Call
          </Link>
        </div>
      </div>
    </header>
  )
}
