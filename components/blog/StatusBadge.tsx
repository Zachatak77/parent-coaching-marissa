'use client'

interface StatusBadgeProps {
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
}

const statusConfig = {
  DRAFT: {
    label: 'Draft',
    className: 'bg-[#F2EBDA] text-[#6E6A60]',
  },
  PUBLISHED: {
    label: 'Published',
    className: 'bg-[#9BB39B]/20 text-[#5C7A5C]',
  },
  ARCHIVED: {
    label: 'Archived',
    className: 'bg-[#EFB63F]/20 text-[#9A7200]',
  },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status]
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide font-[Inter] ${config.className}`}
    >
      {config.label}
    </span>
  )
}
