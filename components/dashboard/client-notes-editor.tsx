'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Textarea } from '@/components/ui/textarea'
import { updateClientNotesAction } from '@/app/actions/clients'

export function ClientNotesEditor({ clientId, initialNotes }: { clientId: string; initialNotes: string | null }) {
  const [notes, setNotes] = React.useState(initialNotes ?? '')
  const [saving, setSaving] = React.useState(false)

  const handleBlur = async () => {
    if (notes === (initialNotes ?? '')) return
    setSaving(true)
    const result = await updateClientNotesAction(clientId, notes)
    setSaving(false)
    if (result.error) toast.error(result.error)
    else toast.success('Notes saved')
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Notes</p>
        {saving && <span className="text-xs text-muted-foreground">Saving…</span>}
      </div>
      <Textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={handleBlur}
        placeholder="Add notes about this client..."
        rows={5}
        className="resize-none"
      />
    </div>
  )
}
