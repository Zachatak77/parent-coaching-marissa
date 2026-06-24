import { cn } from '@/lib/utils'

const NAVY = '#5F728D'
const SAGE = '#9BB39B'
const PEACH = '#E98773'

/**
 * Ambient gradient-blob backdrop for dashboard/admin shells.
 * Mirrors the public hero's field at lower opacity so it sits behind
 * dense data UI. Animations + visibility honour prefers-reduced-motion
 * via the global rp-blob-* rules in globals.css.
 */
export function BlobField({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <div
        className="rp-blob-1 absolute -top-32 -right-24 h-[480px] w-[480px] rounded-full opacity-[0.14] blur-3xl"
        style={{ background: `radial-gradient(circle at 35% 35%, ${NAVY}, transparent 70%)` }}
      />
      <div
        className="rp-blob-2 absolute top-48 -left-40 h-[420px] w-[420px] rounded-full opacity-[0.10] blur-3xl"
        style={{ background: `radial-gradient(circle at 60% 40%, ${SAGE}, transparent 70%)` }}
      />
      <div
        className="absolute bottom-0 right-1/4 h-[300px] w-[300px] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: `radial-gradient(circle, ${PEACH}, transparent 70%)` }}
      />
    </div>
  )
}
