'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Leaf,
  LayoutDashboard,
  Users,
  PhoneCall,
  Library,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  fullName: string | null
  role: string | null
  discoveryCount: number
}

const roleLabel: Record<string, string> = { admin: 'Admin', coach: 'Coach' }

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
    { href: '/dashboard/resources', label: 'Resources', icon: Library },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ]

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href)

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="px-6 py-6 border-b border-[#F5F0E8]/15">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#F5F0E8]/15">
            <Leaf className="w-4 h-4 text-[#F5F0E8]" />
          </div>
          <span className="text-xs font-medium text-[#F5F0E8]/70">Parent Coaching</span>
        </div>
        <p className="text-sm font-semibold text-[#F5F0E8] truncate">{fullName ?? 'Coach'}</p>
        <span className="inline-flex items-center mt-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[#F5F0E8]/20 text-[#F5F0E8]/90 uppercase tracking-wide">
          {roleLabel[role ?? 'coach'] ?? 'Coach'}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, badge }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={cn(
              'flex items-center justify-between px-3 py-2.5 rounded-md text-sm transition-colors',
              isActive(href)
                ? 'bg-[#F5F0E8]/20 text-[#F5F0E8] font-medium'
                : 'text-[#F5F0E8]/75 hover:text-[#F5F0E8] hover:bg-[#F5F0E8]/10'
            )}
          >
            <span className="flex items-center gap-3">
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </span>
            {badge !== null && badge !== undefined && (
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-400 text-white text-[10px] font-bold">
                {badge > 9 ? '9+' : badge}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-[#F5F0E8]/15">
        <form action="/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-md text-sm text-[#F5F0E8]/70 hover:text-[#F5F0E8] hover:bg-[#F5F0E8]/10 transition-colors"
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
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-[#2D5016] text-[#F5F0E8] flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-[#2D5016] text-[#F5F0E8]">
        <div className="flex items-center gap-2">
          <Leaf className="w-5 h-5" />
          <span className="text-sm font-semibold">Parent Coaching</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-1.5 rounded-md hover:bg-[#F5F0E8]/10"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-72 bg-[#2D5016] text-[#F5F0E8] flex flex-col h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md hover:bg-[#F5F0E8]/10"
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
