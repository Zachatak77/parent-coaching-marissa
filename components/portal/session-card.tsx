'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'

interface SessionCardProps {
  sessionDate: string
  sessionNotes: string | null
  actionItems: string[] | null
}

export function SessionCard({ sessionDate, sessionNotes, actionItems }: SessionCardProps) {
  const [checked, setChecked] = React.useState<Record<number, boolean>>({})

  const items = actionItems?.filter((i) => i.trim()) ?? []

  return (
    <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-6 shadow-sm space-y-4">
      <p className="text-xs font-semibold text-[#2D5016]/50 uppercase tracking-wide">
        {format(new Date(sessionDate), 'EEEE, MMMM d, yyyy')}
      </p>

      {sessionNotes && (
        <div>
          <p className="text-xs font-semibold text-[#2D5016] mb-1.5">Session Notes</p>
          <p className="text-sm text-[#2D5016]/75 leading-relaxed whitespace-pre-wrap">{sessionNotes}</p>
        </div>
      )}

      {items.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[#2D5016] mb-2">Your Action Steps</p>
          <p className="text-xs text-[#2D5016]/45 mb-3">Use these as a personal checklist during the week. Resets on page reload.</p>
          <ul className="space-y-2">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <Checkbox
                  id={`item-${i}`}
                  checked={!!checked[i]}
                  onCheckedChange={(v) => setChecked((c) => ({ ...c, [i]: !!v }))}
                  className="mt-0.5 border-[#2D5016]/30 data-[state=checked]:bg-[#2D5016] data-[state=checked]:border-[#2D5016]"
                />
                <label
                  htmlFor={`item-${i}`}
                  className={`text-sm cursor-pointer transition-colors ${checked[i] ? 'line-through text-[#2D5016]/40' : 'text-[#2D5016]/75'}`}
                >
                  {item}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
