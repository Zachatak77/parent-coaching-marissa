import * as React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Dashboard card with the public design language: hairline border, rounded-2xl,
 * hover lift + shadow, and an animated top accent bar that wipes in on hover.
 * Kept separate from the shared shadcn `Card` (which the parent portal uses).
 *
 * `interactive={false}` drops the hover lift — use for cards wrapping tables
 * or forms where movement would be distracting.
 */
export function LiftCard({
  accent = 'var(--navy)',
  href,
  interactive = true,
  className,
  children,
}: {
  accent?: string
  href?: string
  interactive?: boolean
  className?: string
  children: React.ReactNode
}) {
  const base = cn(
    'group relative overflow-hidden rounded-2xl border border-[#D9CFB9] bg-white transition-all duration-300',
    interactive && 'hover:-translate-y-1.5 hover:shadow-xl',
    className
  )
  const bar = (
    <span
      aria-hidden
      className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
      style={{ background: accent }}
    />
  )

  if (href) {
    return (
      <Link href={href} className={cn(base, 'block')}>
        {bar}
        {children}
      </Link>
    )
  }
  return (
    <div className={base}>
      {bar}
      {children}
    </div>
  )
}

export function LiftCardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6', className)} {...props} />
}

export function LiftCardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

export function LiftCardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn('font-cormorant text-xl font-semibold text-[#1F1D1A]', className)}
      {...props}
    />
  )
}
