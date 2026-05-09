'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatDistanceToNow } from 'date-fns'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { ChevronDown, ChevronUp, Search, Plus } from 'lucide-react'
import { updateDiscoveryStatusAction, updateDiscoveryNotesAction, createDiscoveryCallAction } from '@/app/actions/discovery'
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

const statusColors: Record<string, string> = {
  new: 'text-[#4A5F7F] font-medium',
  contacted: 'text-[#8B6914] font-medium',
  booked: 'text-[#3D6B45] font-medium',
  converted: 'text-[#1F4D29] font-medium',
  closed: 'text-[#6E6A60]',
}

function StatusLabel({ status }: { status: string }) {
  return (
    <span className={`text-sm capitalize ${statusColors[status] ?? 'text-[#6E6A60]'}`}>
      {status}
    </span>
  )
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
      <TableRow>
        <TableCell className="font-medium">
          <p className="text-sm font-medium text-[#1F1D1A]">{call.name}</p>
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">{call.email}</TableCell>
        <TableCell className="text-sm text-muted-foreground">{call.phone ?? '—'}</TableCell>
        <TableCell className="text-sm text-muted-foreground">{call.child_ages ?? '—'}</TableCell>
        <TableCell className="text-sm text-muted-foreground max-w-[180px]">
          <span className="line-clamp-2">{call.main_concern ?? '—'}</span>
        </TableCell>
        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
          {formatDistanceToNow(new Date(call.submitted_at), { addSuffix: true })}
        </TableCell>
        <TableCell>
          <Select value={status} onValueChange={(v) => handleStatusChange(v as Status)}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue>
                <StatusLabel status={status} />
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  <StatusLabel status={s} />
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
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
              className="text-muted-foreground hover:text-[#1F1D1A] hover:bg-muted/50 rounded p-1 transition-colors"
              aria-label="Toggle details"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow className="bg-muted/10 hover:bg-muted/10">
          <TableCell colSpan={8} className="px-6 py-5">
            <div className="space-y-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">Main Concern</p>
                <p className="text-sm">{call.main_concern ?? '—'}</p>
              </div>
              {call.how_they_heard && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1.5">How They Heard</p>
                  <p className="text-sm">{call.how_they_heard}</p>
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-1.5">
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
            </div>
          </TableCell>
        </TableRow>
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
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#1F1D1A] truncate">{call.name}</p>
          <p className="text-xs text-muted-foreground truncate">{call.email}</p>
          {call.main_concern && (
            <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">{call.main_concern}</p>
          )}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex-shrink-0 text-muted-foreground hover:text-[#1F1D1A] hover:bg-muted/50 rounded p-1 transition-colors"
          aria-label="Toggle details"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={status} onValueChange={(v) => handleStatusChange(v as Status)}>
          <SelectTrigger className="h-9 w-32">
            <SelectValue>
              <StatusLabel status={status} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                <StatusLabel status={s} />
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
        <span className="text-xs text-muted-foreground ml-auto">
          {formatDistanceToNow(new Date(call.submitted_at), { addSuffix: true })}
        </span>
      </div>

      {expanded && (
        <div className="pt-3 border-t space-y-2 text-xs text-muted-foreground">
          {call.phone && <p><span className="font-medium">Phone:</span> {call.phone}</p>}
          {call.child_ages && <p><span className="font-medium">Child ages:</span> {call.child_ages}</p>}
          {call.how_they_heard && <p><span className="font-medium">How they heard:</span> {call.how_they_heard}</p>}
        </div>
      )}
    </div>
  )
}

function AddLeadDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await createDiscoveryCallAction(new FormData(e.currentTarget))
    setLoading(false)
    if (result.error) { setError(result.error); return }
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="lead-name" className="text-xs font-semibold">Name <span className="text-red-500">*</span></Label>
              <Input id="lead-name" name="name" placeholder="Jane Smith" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-email" className="text-xs font-semibold">Email <span className="text-red-500">*</span></Label>
              <Input id="lead-email" name="email" type="email" placeholder="jane@example.com" required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="lead-phone" className="text-xs font-semibold text-muted-foreground">Phone</Label>
              <Input id="lead-phone" name="phone" placeholder="(555) 000-0000" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lead-ages" className="text-xs font-semibold text-muted-foreground">Child ages</Label>
              <Input id="lead-ages" name="child_ages" placeholder="e.g. 5, 8" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-concern" className="text-xs font-semibold text-muted-foreground">Main concern</Label>
            <Textarea id="lead-concern" name="main_concern" placeholder="What are they dealing with?" rows={2} className="resize-none text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="lead-source" className="text-xs font-semibold text-muted-foreground">How they heard</Label>
            <Input id="lead-source" name="how_they_heard" placeholder="e.g. referral, Instagram" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-[#4A5F7F] hover:bg-[#3E5070] text-white rounded-full">
              {loading ? 'Adding…' : 'Add lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function AddLeadButton({ size = 'default' }: { size?: 'default' | 'sm' }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size={size}
        className="bg-[#4A5F7F] hover:bg-[#3E5070] text-white rounded-full gap-1.5"
      >
        <Plus className="w-4 h-4" /> Add Lead
      </Button>
      {open && <AddLeadDialog open={open} onClose={() => setOpen(false)} />}
    </>
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
          <div className="hidden lg:block rounded-md border border-[#D9CFB9] bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Child Ages</TableHead>
                  <TableHead>Main Concern</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((call) => (
                  <DiscoveryRow key={call.id} call={call} coachId={coachId} />
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
