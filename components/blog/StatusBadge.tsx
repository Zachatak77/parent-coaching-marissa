'use client'

interface StatusBadgeProps {
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  scheduledAt?: Date | string | null
}

const configs = {
  DRAFT:     { label: 'Draft',     cls: 'bg-[#F2EBDA] text-[#6E6A60]' },
  PUBLISHED: { label: 'Published', cls: 'bg-[#9BB39B]/20 text-[#5C7A5C]' },
  ARCHIVED:  { label: 'Archived',  cls: 'bg-[#EFB63F]/20 text-[#9A7200]' },
  SCHEDULED: { label: 'Scheduled', cls: 'bg-[#5F728D]/20 text-[#3D5068]' },
}

export function StatusBadge({ status, scheduledAt }: StatusBadgeProps) {
  const isScheduled =
    status === 'DRAFT' && scheduledAt && new Date(scheduledAt) > new Date()
  const cfg = isScheduled ? configs.SCHEDULED : configs[status]
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide font-[Inter] ${cfg.cls}`}>
      {isScheduled && '⏰ '}
      {cfg.label}
    </span>
  )
}
