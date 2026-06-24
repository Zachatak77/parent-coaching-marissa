import Link from 'next/link'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { LiftCard } from './lift-card'

/**
 * Metric tile built on LiftCard — replaces the repeated 4-up stat grids.
 * Big value rendered in Cormorant; optional link footer.
 */
export function StatCard({
  label,
  value,
  icon: Icon,
  href,
  accent = 'var(--navy)',
}: {
  label: string
  value: React.ReactNode
  icon: LucideIcon
  href?: string | null
  accent?: string
}) {
  return (
    <LiftCard accent={accent}>
      <div className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs text-[#6E6A60]">{label}</p>
          <Icon className="w-4 h-4 text-[#6E6A60]" />
        </div>
        <div className="mt-3 flex items-end justify-between">
          <p className="font-cormorant text-3xl font-semibold leading-none text-[#1F1D1A]">{value}</p>
          {href && (
            <Link href={href} className="text-xs text-[#6E6A60] hover:text-[#1F1D1A] flex items-center gap-0.5">
              View <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      </div>
    </LiftCard>
  )
}
