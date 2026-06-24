import * as React from 'react'
import { Eyebrow } from '@/components/public/motifs'

/**
 * Page heading in the public design language: optional Eyebrow label,
 * a Cormorant display title, an optional subtitle, and a right-aligned
 * actions slot for existing buttons.
 */
export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  subtitle?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-2.5">
            <Eyebrow>{eyebrow}</Eyebrow>
          </div>
        )}
        <h1
          className="font-cormorant font-semibold text-[#1F1D1A]"
          style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.6rem)', lineHeight: 1.05, letterSpacing: '-0.01em' }}
        >
          {title}
        </h1>
        {subtitle && <p className="mt-1 text-sm text-[#6E6A60]">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  )
}
