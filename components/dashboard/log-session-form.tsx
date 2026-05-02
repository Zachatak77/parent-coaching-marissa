'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { logSessionAction, updateSessionAction } from '@/app/actions/sessions'

type Session = {
  id: string
  session_date: string
  session_notes: string | null
  action_items: string[] | null
  shared_with_parent: boolean
  created_at: string
}

function today() {
  return new Date().toISOString().split('T')[0]
}

function LogForm({ clientId, onDone }: { clientId: string; onDone: () => void }) {
  const [date, setDate] = React.useState(today())
  const [notes, setNotes] = React.useState('')
  const [items, setItems] = React.useState([''])
  const [shared, setShared] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const addItem = () => setItems([...items, ''])
  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))
  const updateItem = (i: number, v: string) => {
    const next = [...items]
    next[i] = v
    setItems(next)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData()
    fd.append('client_id', clientId)
    fd.append('session_date', date)
    fd.append('session_notes', notes)
    fd.append('action_items', JSON.stringify(items.filter((i) => i.trim())))
    fd.append('shared_with_parent', String(shared))

    const result = await logSessionAction(fd)
    setLoading(false)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Session logged')
      onDone()
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-[#D9CFB9] rounded-lg p-4 space-y-4 bg-white">
      <h3 className="text-sm font-semibold text-[#1F1D1A]">Log New Session</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="date">Session Date *</Label>
          <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="notes">Session Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="What was covered in this session..."
          rows={4}
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Action Items</Label>
          <Button type="button" variant="ghost" size="sm" onClick={addItem}>
            <Plus className="w-3.5 h-3.5 mr-1" /> Add item
          </Button>
        </div>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => updateItem(i, e.target.value)}
                placeholder={`Action item ${i + 1}`}
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  className="text-muted-foreground hover:text-destructive flex-shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Switch id="shared" checked={shared} onCheckedChange={setShared} />
        <Label htmlFor="shared" className="cursor-pointer">Share with parent</Label>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" size="sm" onClick={onDone}>Cancel</Button>
        <Button type="submit" size="sm" className="bg-[#4A5F7F] hover:bg-[#3E5070]/90 text-white" disabled={loading}>
          {loading ? 'Saving…' : 'Save Session'}
        </Button>
      </div>
    </form>
  )
}

function SessionCard({ session, clientId }: { session: Session; clientId: string }) {
  const [expanded, setExpanded] = React.useState(false)
  const [editNotes, setEditNotes] = React.useState(session.session_notes ?? '')
  const [shared, setShared] = React.useState(session.shared_with_parent)
  const [editing, setEditing] = React.useState(false)
  const [saving, setSaving] = React.useState(false)
  const router = useRouter()

  const saveChanges = async () => {
    setSaving(true)
    const result = await updateSessionAction(session.id, clientId, {
      session_notes: editNotes,
      shared_with_parent: shared,
    })
    setSaving(false)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Session updated')
      setEditing(false)
      router.refresh()
    }
  }

  const toggleShare = async () => {
    const newShared = !shared
    setShared(newShared)
    const result = await updateSessionAction(session.id, clientId, { shared_with_parent: newShared })
    if (result.error) {
      setShared(!newShared)
      toast.error(result.error)
    }
  }

  const actionItems = Array.isArray(session.action_items) ? session.action_items : []

  return (
    <div className="border border-[#D9CFB9] rounded-lg bg-white overflow-hidden">
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/20"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <p className="text-sm font-medium text-[#1F1D1A]">
            {new Date(session.session_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          {actionItems.length > 0 && (
            <span className="text-xs text-muted-foreground">{actionItems.length} action item{actionItems.length !== 1 ? 's' : ''}</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Badge
            variant={shared ? 'green' : 'gray'}
            className="text-[10px] cursor-pointer"
            onClick={(e) => { e.stopPropagation(); toggleShare() }}
          >
            {shared ? 'Shared' : 'Private'}
          </Badge>
          {expanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </div>
      </div>

      {expanded && (
        <div className="border-t border-[#D9CFB9] px-4 py-4 space-y-4">
          {editing ? (
            <>
              <Textarea
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={saveChanges} disabled={saving} className="bg-[#4A5F7F] hover:bg-[#3E5070]/90 text-white">
                  {saving ? 'Saving…' : 'Save'}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-foreground whitespace-pre-wrap">
                {session.session_notes || <span className="text-muted-foreground italic">No notes for this session.</span>}
              </p>
              {actionItems.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">Action Items</p>
                  <ul className="space-y-1">
                    {actionItems.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#4A5F7F] flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <Button size="sm" variant="ghost" onClick={() => setEditing(true)} className="text-[#1F1D1A]">
                Edit notes
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export function SessionsList({ clientId, sessions }: { clientId: string; sessions: Session[] }) {
  const [showForm, setShowForm] = React.useState(false)

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          className="bg-[#4A5F7F] hover:bg-[#3E5070]/90 text-white"
          onClick={() => setShowForm(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Log Session
        </Button>
      </div>

      {showForm && <LogForm clientId={clientId} onDone={() => setShowForm(false)} />}

      {sessions.length === 0 && !showForm ? (
        <div className="text-center py-12 text-muted-foreground text-sm border border-dashed border-[#D9CFB9] rounded-lg">
          No sessions logged yet. Click &ldquo;Log Session&rdquo; to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((s) => (
            <SessionCard key={s.id} session={s} clientId={clientId} />
          ))}
        </div>
      )}
    </div>
  )
}
