'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { Search } from 'lucide-react'

type Client = {
  id: string
  status: string
  package: string
  start_date: string | null
  notes: string | null
  profiles: { full_name: string | null; email: string | null; phone: string | null } | null
  sessions: { session_date: string }[]
}

const statusVariants: Record<string, 'green' | 'yellow' | 'blue' | 'gray'> = {
  active: 'green',
  paused: 'yellow',
  discovery: 'blue',
  completed: 'gray',
}

const packageLabels: Record<string, string> = {
  confident_parent: 'Confident Parent',
  partnership: 'Partnership',
  ongoing: 'Ongoing Support',
}

export function ClientsTable({ clients }: { clients: Client[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = React.useState(searchParams.get('q') ?? '')
  const [statusFilter, setStatusFilter] = React.useState(searchParams.get('status') ?? 'all')
  const [packageFilter, setPackageFilter] = React.useState(searchParams.get('package') ?? 'all')

  const updateParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value && value !== 'all') params.set(key, value)
    else params.delete(key)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const filtered = clients.filter((c) => {
    const name = c.profiles?.full_name ?? ''
    const email = c.profiles?.email ?? ''
    const matchSearch = !search || name.toLowerCase().includes(search.toLowerCase()) || email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || c.status === statusFilter
    const matchPackage = packageFilter === 'all' || c.package === packageFilter
    return matchSearch && matchStatus && matchPackage
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              updateParams('q', e.target.value)
            }}
            className="pl-8"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); updateParams('status', v) }}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="discovery">Discovery</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={packageFilter} onValueChange={(v) => { setPackageFilter(v); updateParams('package', v) }}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All packages" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Packages</SelectItem>
            <SelectItem value="confident_parent">Confident Parent</SelectItem>
            <SelectItem value="partnership">Partnership</SelectItem>
            <SelectItem value="ongoing">Ongoing Support</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No clients found.
        </div>
      ) : (
        <>
          {/* Mobile card view */}
          <div className="lg:hidden space-y-3">
            {filtered.map((client) => {
              const lastSession = client.sessions?.[0]?.session_date
              return (
                <div key={client.id} className="bg-white rounded-xl border border-[#2D5016]/15 p-4 flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#2D5016] truncate">
                      {client.profiles?.full_name ?? '—'}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {client.profiles?.email ?? ''}
                    </p>
                    {client.profiles?.phone && (
                      <p className="text-xs text-muted-foreground truncate mb-2">{client.profiles.phone}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge variant={statusVariants[client.status] ?? 'gray'} className="text-[10px]">
                        {client.status}
                      </Badge>
                      <span>{packageLabels[client.package] ?? client.package}</span>
                      {lastSession && (
                        <span>Last: {new Date(lastSession).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                  <Button asChild size="sm" variant="outline" className="flex-shrink-0">
                    <Link href={`/dashboard/clients/${client.id}`}>View</Link>
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Desktop table view */}
          <div className="hidden lg:block rounded-md border border-[#2D5016]/15 bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30">
                  <TableHead>Client Name</TableHead>
                  <TableHead>Package</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Last Session</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((client) => {
                  const lastSession = client.sessions?.[0]?.session_date
                  return (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p className="text-sm font-medium text-[#2D5016]">
                            {client.profiles?.full_name ?? '—'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {client.profiles?.email ?? ''}
                          </p>
                          {client.profiles?.phone && (
                            <p className="text-xs text-muted-foreground">{client.profiles.phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {packageLabels[client.package] ?? client.package}
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariants[client.status] ?? 'gray'}>
                          {client.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {client.start_date
                          ? new Date(client.start_date).toLocaleDateString()
                          : '—'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {lastSession ? new Date(lastSession).toLocaleDateString() : '—'}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/dashboard/clients/${client.id}`}>View</Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}
