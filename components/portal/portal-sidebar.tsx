'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BookOpen, CalendarDays, Library, ClipboardList, User, LogOut, Menu, X, Mail,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface PortalSidebarProps {
  firstName: string
  initials: string
  intakeSubmitted: boolean
}

const allNavItems = [
  { href: '/portal', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portal/plan', label: 'My Plan', icon: BookOpen },
  { href: '/portal/sessions', label: 'Sessions', icon: CalendarDays },
  { href: '/portal/resources', label: 'Resources', icon: Library },
  { href: '/portal/intake', label: 'Intake Form', icon: ClipboardList },
  { href: '/portal/profile', label: 'Profile', icon: User },
]

const pageTitles: Record<string, string> = {
  '/portal': 'Dashboard',
  '/portal/plan': 'My Plan',
  '/portal/sessions': 'Sessions',
  '/portal/resources': 'Resources',
  '/portal/intake': 'Intake Form',
  '/portal/profile': 'Profile',
}

export function PortalDesktopHeader({ initials }: { initials: string }) {
  const pathname = usePathname()
  const pageTitle = pageTitles[pathname] ?? 'Portal'

  return (
    <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-[#FFFFFF] border-b border-[#D9CFB9]">
      <span className="text-sm font-semibold text-[#1F1D1A]">{pageTitle}</span>
      <div className="w-9 h-9 rounded-full bg-[#5F728D] flex items-center justify-center text-xs font-bold text-white">
        {initials}
      </div>
    </header>
  )
}

export function PortalSidebar({ firstName, initials, intakeSubmitted }: PortalSidebarProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pageTitle = pageTitles[pathname] ?? 'Portal'

  const navItems = allNavItems.filter(
    (item) => item.href !== '/portal/intake' || !intakeSubmitted
  )

  const isActive = (href: string) =>
    href === '/portal' ? pathname === '/portal' : pathname.startsWith(href)

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="mb-5">
          <span style={{ display: 'block', fontFamily: 'var(--font-ui)', fontWeight: 700, fontSize: '0.58rem', letterSpacing: '.22em', textTransform: 'uppercase', color: '#C8D1DF', lineHeight: 1, marginBottom: 3 }}>
            Reimagine
          </span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.15rem', color: '#FFFFFF', lineHeight: 1, paddingLeft: 11 }}>
            Parenting
          </span>
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>
          Hi, {firstName}
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
              isActive(href)
                ? 'bg-[#5F728D]/50 text-[#FFFFFF] font-medium'
                : 'text-[#FFFFFF]/65 hover:text-[#FFFFFF] hover:bg-white/8'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-4 pt-2 border-t border-white/10 space-y-0.5">
        <a
          href="mailto:parentcoachwithmarissa@gmail.com"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#FFFFFF]/55 hover:text-[#FFFFFF] hover:bg-white/8 transition-colors"
        >
          <Mail className="w-4 h-4 flex-shrink-0" />
          Questions? Email us
        </a>
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#FFFFFF]/55 hover:text-[#FFFFFF] hover:bg-white/8 transition-colors"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col h-screen sticky top-0" style={{ background: '#2C2A28' }}>
        {sidebarContent}
      </aside>

      {/* Mobile top bar — single bar showing page title */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 text-[#FFFFFF] flex items-center justify-between px-4 h-14" style={{ background: '#2C2A28' }}>
        <span className="text-sm font-semibold">{pageTitle}</span>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#5F728D] flex items-center justify-center text-xs font-bold text-[#FFFFFF]">
            {initials}
          </div>
          <button onClick={() => setMobileOpen(true)} className="p-1 hover:bg-white/10 rounded">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="relative w-72 h-full flex flex-col shadow-xl" style={{ background: '#2C2A28' }}>
            <div className="flex items-center justify-between px-4 h-14 border-b border-white/10">
              <span style={{ fontFamily: 'var(--font-ui)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '.14em', textTransform: 'uppercase', color: '#C8D1DF' }}>Menu</span>
              <button onClick={() => setMobileOpen(false)} className="p-1 text-[#FFFFFF]/60 hover:text-[#FFFFFF]">
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  )
}

export function PortalMobileTabs({ intakeSubmitted }: { intakeSubmitted: boolean }) {
  const pathname = usePathname()

  const tabs = intakeSubmitted
    ? [
        { href: '/portal', label: 'Home', icon: LayoutDashboard },
        { href: '/portal/plan', label: 'Plan', icon: BookOpen },
        { href: '/portal/sessions', label: 'Sessions', icon: CalendarDays },
        { href: '/portal/resources', label: 'Resources', icon: Library },
        { href: '/portal/profile', label: 'Profile', icon: User },
      ]
    : [
        { href: '/portal', label: 'Home', icon: LayoutDashboard },
        { href: '/portal/plan', label: 'Plan', icon: BookOpen },
        { href: '/portal/sessions', label: 'Sessions', icon: CalendarDays },
        { href: '/portal/intake', label: 'Intake', icon: ClipboardList },
        { href: '/portal/profile', label: 'Profile', icon: User },
      ]

  const isActive = (href: string) =>
    href === '/portal' ? pathname === '/portal' : pathname.startsWith(href)

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFFFF] border-t border-[#D9CFB9] flex">
      {tabs.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[10px] font-medium transition-colors',
            isActive(href) ? 'text-[#5F728D]' : 'text-[#6E6A60] hover:text-[#1F1D1A]'
          )}
        >
          <Icon className="w-5 h-5" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
