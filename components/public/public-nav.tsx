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
      className={cn(
        'sticky top-0 z-50 w-full transition-shadow duration-200',
        scrolled ? 'shadow-sm bg-[#F5F0E8]' : 'bg-[#F5F0E8]/95 backdrop-blur-sm',
        'border-b border-[#2D5016]/10'
      )}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <div>
            <span className="block text-[10px] font-extrabold uppercase tracking-[.22em] text-[#4A7A9B] leading-none mb-0.5">Reimagine</span>
            <span className="block font-playfair font-bold text-[#1A1614] text-lg leading-tight pl-3">Parenting</span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === href
                  ? 'text-[#2D5016]'
                  : 'text-[#2D5016]/70 hover:text-[#2D5016]'
              )}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-md bg-[#D97B2E] px-4 py-2 text-sm font-semibold text-white hover:bg-[#C06B20] transition-colors"
          >
            Book a Call
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-[#2D5016] hover:bg-[#2D5016]/10 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile slide-down menu */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-200 ease-in-out bg-[#F5F0E8] border-t border-[#2D5016]/10',
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="px-4 py-4 flex flex-col gap-3">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm font-medium text-[#2D5016]/80 hover:text-[#2D5016] py-1"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/book"
            className="inline-flex items-center justify-center rounded-md bg-[#D97B2E] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#C06B20] transition-colors mt-1"
          >
            Book a Free Call
          </Link>
        </div>
      </div>
    </header>
  )
}
