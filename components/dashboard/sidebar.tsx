'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  PhoneCall,
  Library,
  Settings,
  LogOut,
  Menu,
  X,
  BookOpen,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  fullName: string | null
  role: string | null
  discoveryCount: number
}

const roleLabel: Record<string, string> = { admin: 'Admin', coach: 'Coach' }

const SHELL = 'linear-gradient(180deg, #2A2724 0%, #23211E 55%, #1E1C19 100%)'

export function Sidebar({ fullName, role, discoveryCount }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/clients', label: 'Clients', icon: Users },
    {
      href: '/dashboard/discovery',
      label: 'Discovery Calls',
      icon: PhoneCall,
      badge: discoveryCount > 0 ? discoveryCount : null,
    },
    { href: '/coach/blog', label: 'Blog', icon: BookOpen },
    { href: '/dashboard/resources', label: 'Resources', icon: Library },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="px-6 py-6 border-b border-white/10">
        <div className="mb-4">
          <Image src="/Brand_Logo.png" alt="Reimagine Parenting" height={36} width={144} priority style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>
        <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.7)' }} className="truncate">
          {fullName ?? 'Coach'}
        </p>
        <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide" style={{ background: 'rgba(200,209,223,0.18)', color: '#C8D1DF' }}>
          {roleLabel[role ?? 'coach'] ?? 'Coach'}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'relative flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors overflow-hidden',
              isActive(href)
                ? 'bg-[#5F728D] text-[#FFFFFF] font-medium'
                : 'text-[#FFFFFF]/65 hover:text-[#FFFFFF] hover:bg-white/8'
            )}
          >
            {isActive(href) && (
              <span aria-hidden className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r" style={{ background: '#E98773' }} />
            )}
            <span className="flex items-center gap-3">
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </span>
            {badge !== null && badge !== undefined && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-[#C8D1DF] text-[#2C2A28] text-[10px] font-bold">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
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
      <aside className="hidden md:flex w-64 flex-shrink-0 flex-col" style={{ background: SHELL }}>
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 text-[#FFFFFF]" style={{ background: SHELL }}>
        <div className="flex items-center">
          <Image src="/Brand_Logo.png" alt="Reimagine Parenting" height={30} width={120} priority style={{ objectFit: 'contain', filter: 'brightness(0) invert(1)' }} />
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-md hover:bg-white/10"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 flex flex-col h-full" style={{ background: SHELL }}>
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-white/10 text-[#FFFFFF]/70 hover:text-[#FFFFFF]"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
