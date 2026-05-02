'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronDown, ChevronUp, Search } from 'lucide-react'
import { updateDiscoveryStatusAction, updateDiscoveryNotesAction } from '@/app/actions/discovery'
import { NewClientButton } from '@/components/dashboard/new-client-button'

type DiscoveryCall = {
  id: string
  name: string
  email: string
  phone: string | null
  child_ages: string | null
  main_concern: string | null
  how_they_heard: string | null
  submitted_at: string
  status: string
  notes: string | null
}

const statusVariants: Record<string, 'blue' | 'yellow' | 'green' | 'darkgreen' | 'gray'> = {
  new: 'blue',
  contacted: 'yellow',
  booked: 'green',
  converted: 'darkgreen',
  closed: 'gray',
}

const STATUSES = ['new', 'contacted', 'booked', 'converted', 'closed'] as const
type Status = typeof STATUSES[number]

function DiscoveryRow({ call, coachId }: { call: DiscoveryCall; coachId: string }) {
  const [expanded, setExpanded] = React.useState(false)
  const [status, setStatus] = React.useState(call.status as Status)
  const [notes, setNotes] = React.useState(call.notes ?? '')
  const [noteSaving, setNoteSaving] = React.useState(false)
  const router = useRouter()

  const handleStatusChange = async (newStatus: Status) => {
    setStatus(newStatus)
    const result = await updateDiscoveryStatusAction(call.id, newStatus)
    if (result.error) {
      toast.error(result.error)
      setStatus(call.status as Status)
    } else {
      toast.success('Status updated')
      router.refresh()
    }
  }

  const handleNoteBlur = async () => {
    if (notes === (call.notes ?? '')) return
    setNoteSaving(true)
    const result = await updateDiscoveryNotesAction(call.id, notes)
    setNoteSaving(false)
    if (result.error) toast.error(result.error)
    else toast.success('Notes saved')
  }

  return (
    <>
      <tr className="border-b border-border hover:bg-muted/20 transition-colors">
        <td className="px-4 py-3">
          <p className="text-sm font-medium text-[#1F1D1A]">{call.name}</p>
        </td>
        <td className="px-4 py-3 text-sm text-muted-foreground">{call.email}</td>
        <td className="px-4 py-3 text-sm text-muted-foreground">{call.phone ?? '—'}</td>
        <td className="px-4 py-3 text-sm text-muted-foreground">{call.child_ages ?? '—'}</td>
        <td className="px-4 py-3 text-sm text-muted-foreground max-w-[180px]">
          <span className="line-clamp-2">{call.main_concern ?? '—'}</span>
        </td>
        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(call.submitted_at), { addSuffix: true })}
        </td>
        <td className="px-4 py-3">
          <Select value={status} onValueChange={(v) => handleStatusChange(v as Status)}>
            <SelectTrigger className="w-32 h-7 text-xs">
              <SelectValue>
                <Badge variant={statusVariants[status] ?? 'gray'} className="text-[10px]">
                  {status}
                </Badge>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  <Badge variant={statusVariants[s]} className="text-[10px]">{s}</Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            {status === 'booked' && (
              <NewClientButton
                coachId={coachId}
                prefill={{ name: call.name, email: call.email }}
                triggerLabel="Convert"
                onSuccess={() => handleStatusChange('converted')}
              />
            )}
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-muted-foreground hover:text-[#1F1D1A] transition-colors"
              aria-label="Toggle details"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </td>
      </tr>

      {expanded && (
        <tr className="border-b border-border bg-muted/10">
          <td colSpan={8} className="px-4 py-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Main Concern</p>
              <p className="text-sm">{call.main_concern ?? '—'}</p>
            </div>
            {call.how_they_heard && (
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">How They Heard</p>
                <p className="text-sm">{call.how_they_heard}</p>
              </div>
            )}
            <div>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Internal Notes</p>
                {noteSaving && <span className="text-xs text-muted-foreground">Saving…</span>}
              </div>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={handleNoteBlur}
                placeholder='e.g. "Left voicemail 4/21", "Scheduled for Thursday"'
                rows={3}
                className="resize-none text-sm"
              />
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

function MobileDiscoveryCard({ call, coachId }: { call: DiscoveryCall; coachId: string }) {
  const [expanded, setExpanded] = React.useState(false)
  const [status, setStatus] = React.useState(call.status as Status)
  const router = useRouter()

  const handleStatusChange = async (newStatus: Status) => {
    setStatus(newStatus)
    const result = await updateDiscoveryStatusAction(call.id, newStatus)
    if (result.error) {
      toast.error(result.error)
      setStatus(call.status as Status)
    } else {
      toast.success('Status updated')
      router.refresh()
    }
  }

  return (
    <div className="bg-white rounded-xl border border-[#D9CFB9] p-4 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1F1D1A]">{call.name}</p>
          <p className="text-xs text-muted-foreground truncate">{call.email}</p>
        </div>
        <Badge variant={statusVariants[status] ?? 'gray'} className="text-[10px] flex-shrink-0">
          {status}
        </Badge>
      </div>
      {call.main_concern && (
        <p className="text-xs text-muted-foreground line-clamp-2">{call.main_concern}</p>
      )}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex gap-2">
          <Select value={status} onValueChange={(v) => handleStatusChange(v as Status)}>
            <SelectTrigger className="h-7 text-xs w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  <Badge variant={statusVariants[s]} className="text-[10px]">{s}</Badge>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {status === 'booked' && (
            <NewClientButton
              coachId={coachId}
              prefill={{ name: call.name, email: call.email }}
              triggerLabel="Convert"
              onSuccess={() => handleStatusChange('converted')}
            />
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-muted-foreground hover:text-[#1F1D1A]"
        >
          {expanded ? 'Less' : 'More'}
        </button>
      </div>
      {expanded && (
        <div className="pt-2 border-t space-y-2 text-xs text-muted-foreground">
          {call.phone && <p><span className="font-medium">Phone:</span> {call.phone}</p>}
          {call.child_ages && <p><span className="font-medium">Child ages:</span> {call.child_ages}</p>}
          {call.how_they_heard && <p><span className="font-medium">How they heard:</span> {call.how_they_heard}</p>}
        </div>
      )}
    </div>
  )
}

export function DiscoveryTable({
  calls,
  coachId,
}: {
  calls: DiscoveryCall[]
  coachId: string
}) {
  const [search, setSearch] = React.useState('')
  const [statusFilter, setStatusFilter] = React.useState('all')

  const filtered = calls.filter((c) => {
    const matchSearch =
      !search ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No discovery calls found.
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="lg:hidden space-y-3">
            {filtered.map((call) => (
              <MobileDiscoveryCard key={call.id} call={call} coachId={coachId} />
            ))}
          </div>

          {/* Desktop table view */}
          <div className="hidden lg:block rounded-md border border-[#D9CFB9] bg-white overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/30">
                <tr>
                  {['Name', 'Email', 'Phone', 'Child Ages', 'Main Concern', 'Submitted', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-medium text-muted-foreground whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((call) => (
                  <DiscoveryRow key={call.id} call={call} coachId={coachId} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
