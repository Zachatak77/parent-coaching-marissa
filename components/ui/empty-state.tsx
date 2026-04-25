import { type LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title?: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
        <Icon className="w-7 h-7 text-muted-foreground" />
      </div>
      {title && <p className="text-sm font-semibold text-foreground mb-1">{title}</p>}
      <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
