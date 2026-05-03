'use client'

import * as React from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  adminCreateUserAction,
  adminUpdateUserAction,
  adminGenerateMagicLinkAction,
  adminSetPasswordAction,
  adminGenerateResetLinkAction,
  adminDeleteUserAction,
} from '@/app/actions/admin-users'
import { ExternalLink, Pencil, Trash2, Plus, Copy, Check, KeyRound, RotateCcw } from 'lucide-react'

interface User {
  id: string
  full_name: string | null
  email: string | null
  role: string
  coach_id: string | null
  created_at: string
}

interface Coach {
  id: string
  full_name: string | null
}

interface UsersTableProps {
  users: User[]
  coaches: Coach[]
}

const roleBadgeVariant: Record<string, 'blue' | 'green' | 'yellow' | 'gray'> = {
  admin: 'blue',
  coach: 'green',
  parent: 'yellow',
}

const ROLES = ['admin', 'coach', 'parent'] as const
type Role = typeof ROLES[number]

function RoleFilterTabs({ current }: { current: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const filters = ['all', ...ROLES] as const

  return (
    <div className="flex gap-1.5 flex-wrap">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => {
            const params = new URLSearchParams()
            if (f !== 'all') params.set('role', f)
            router.replace(`${pathname}${params.size ? `?${params}` : ''}`)
          }}
          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors capitalize ${
            current === f
              ? 'bg-[#4A5F7F] text-white'
              : 'bg-[#F5EFE2] text-[#6E6A60] hover:bg-[#D9CFB9]'
          }`}
        >
          {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1) + 's'}
        </button>
      ))}
    </div>
  )
}

function MagicLinkButton({ userId }: { userId: string }) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    const result = await adminGenerateMagicLinkAction(userId)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    if (result.url) window.open(result.url, '_blank')
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        title="View portal as this user"
        className="p-1.5 rounded hover:bg-[#F5EFE2] text-[#6E6A60] hover:text-[#4A5F7F] transition-colors disabled:opacity-50"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </button>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function SetPasswordDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [done, setDone] = React.useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const password = fd.get('password') as string
    const result = await adminSetPasswordAction(user.id, password)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    setDone(true)
  }

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-sm bg-[#FAF5EA] border-[#D9CFB9]">
        <DialogHeader>
          <DialogTitle className="text-[#1F1D1A]">Set password</DialogTitle>
        </DialogHeader>
        {done ? (
          <div className="space-y-4">
            <p className="text-sm text-[#3A372F]">Password updated for <strong>{user.full_name ?? user.email}</strong>.</p>
            <Button onClick={onClose} className="w-full bg-[#4A5F7F] hover:bg-[#3E5070] text-white rounded-full">Done</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-[#6E6A60]">Set a new password for <strong className="text-[#1F1D1A]">{user.full_name ?? user.email}</strong>. The field is masked — the user's password will not be visible.</p>
            {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1F1D1A]">New Password</Label>
              <Input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                autoComplete="new-password"
                className="border-[#D9CFB9] focus-visible:ring-[#4A5F7F]"
              />
              <p className="text-xs text-[#6E6A60]">Minimum 6 characters.</p>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} className="border-[#D9CFB9]">Cancel</Button>
              <Button type="submit" disabled={loading} className="bg-[#4A5F7F] hover:bg-[#3E5070] text-white rounded-full">
                {loading ? 'Saving…' : 'Set password'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function ResetLinkButton({ userId }: { userId: string }) {
  const [loading, setLoading] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleClick() {
    setLoading(true)
    setError(null)
    const result = await adminGenerateResetLinkAction(userId)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    if (result.url) {
      await navigator.clipboard.writeText(result.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={loading}
        title="Copy password reset link"
        className="p-1.5 rounded hover:bg-[#F5EFE2] text-[#6E6A60] hover:text-[#4A5F7F] transition-colors disabled:opacity-50"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <RotateCcw className="w-3.5 h-3.5" />}
      </button>
      {error && <p className="text-[10px] text-red-500 mt-1">{error}</p>}
    </div>
  )
}

function CreateUserDialog({ coaches, open, onClose }: { coaches: Coach[]; open: boolean; onClose: () => void }) {
  const [role, setRole] = React.useState<Role>('parent')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [magicLink, setMagicLink] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  function handleClose() {
    setRole('parent')
    setLoading(false)
    setError(null)
    setMagicLink(null)
    setCopied(false)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const result = await adminCreateUserAction(new FormData(e.currentTarget))
    setLoading(false)
    if (result.error) { setError(result.error); return }
    if ('magicLink' in result) setMagicLink(result.magicLink ?? null)
  }

  async function copyLink() {
    if (!magicLink) return
    await navigator.clipboard.writeText(magicLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) handleClose() }}>
      <DialogContent className="sm:max-w-md bg-[#FAF5EA] border-[#D9CFB9]">
        <DialogHeader>
          <DialogTitle className="text-[#1F1D1A]">
            {magicLink ? 'User created' : 'Create new user'}
          </DialogTitle>
        </DialogHeader>

        {magicLink ? (
          <div className="space-y-4">
            <p className="text-sm text-[#3A372F]">
              The account has been created. Share this magic link to give the user immediate access:
            </p>
            <div className="flex gap-2">
              <Input
                readOnly
                value={magicLink}
                className="text-xs font-mono border-[#D9CFB9] bg-white"
              />
              <Button variant="outline" size="icon" onClick={copyLink} className="flex-shrink-0 border-[#D9CFB9]">
                {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-[#6E6A60]">This link logs the user in directly. It expires after one use.</p>
            <Button onClick={handleClose} className="w-full bg-[#4A5F7F] hover:bg-[#3E5070] text-white rounded-full">
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
            )}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1F1D1A]">Full Name</Label>
              <Input name="full_name" placeholder="Jane Smith" required className="border-[#D9CFB9] focus-visible:ring-[#4A5F7F]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1F1D1A]">Email</Label>
              <Input name="email" type="email" placeholder="jane@example.com" required className="border-[#D9CFB9] focus-visible:ring-[#4A5F7F]" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1F1D1A]">Role</Label>
              <Select name="role" value={role} onValueChange={(v) => setRole(v as Role)}>
                <SelectTrigger className="border-[#D9CFB9] focus:ring-[#4A5F7F]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parent">Parent</SelectItem>
                  <SelectItem value="coach">Coach</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {role === 'parent' && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-[#1F1D1A]">Assign Coach <span className="font-normal text-[#6E6A60]">(optional)</span></Label>
                <Select name="coach_id">
                  <SelectTrigger className="border-[#D9CFB9] focus:ring-[#4A5F7F]">
                    <SelectValue placeholder="Select a coach…" />
                  </SelectTrigger>
                  <SelectContent>
                    {coaches.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.full_name ?? c.id}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose} className="border-[#D9CFB9]">Cancel</Button>
              <Button type="submit" disabled={loading} className="bg-[#4A5F7F] hover:bg-[#3E5070] text-white rounded-full">
                {loading ? 'Creating…' : 'Create user'}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function EditUserDialog({ user, coaches, onClose }: { user: User; coaches: Coach[]; onClose: () => void }) {
  const [role, setRole] = React.useState<Role>(user.role as Role)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    fd.set('userId', user.id)
    const result = await adminUpdateUserAction(fd)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    onClose()
  }

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-md bg-[#FAF5EA] border-[#D9CFB9]">
        <DialogHeader>
          <DialogTitle className="text-[#1F1D1A]">Edit user</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#1F1D1A]">Full Name</Label>
            <Input name="full_name" defaultValue={user.full_name ?? ''} required className="border-[#D9CFB9] focus-visible:ring-[#4A5F7F]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#1F1D1A]">Email</Label>
            <Input name="email" type="email" defaultValue={user.email ?? ''} required className="border-[#D9CFB9] focus-visible:ring-[#4A5F7F]" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-[#1F1D1A]">Role</Label>
            <Select name="role" value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger className="border-[#D9CFB9] focus:ring-[#4A5F7F]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="parent">Parent</SelectItem>
                <SelectItem value="coach">Coach</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {role === 'parent' && (
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-[#1F1D1A]">Assign Coach <span className="font-normal text-[#6E6A60]">(optional)</span></Label>
              <Select name="coach_id" defaultValue={user.coach_id ?? undefined}>
                <SelectTrigger className="border-[#D9CFB9] focus:ring-[#4A5F7F]">
                  <SelectValue placeholder="Select a coach…" />
                </SelectTrigger>
                <SelectContent>
                  {coaches.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.full_name ?? c.id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="border-[#D9CFB9]">Cancel</Button>
            <Button type="submit" disabled={loading} className="bg-[#4A5F7F] hover:bg-[#3E5070] text-white rounded-full">
              {loading ? 'Saving…' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function DeleteUserDialog({ user, onClose }: { user: User; onClose: () => void }) {
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  async function handleDelete() {
    setLoading(true)
    const result = await adminDeleteUserAction(user.id)
    setLoading(false)
    if (result.error) { setError(result.error); return }
    onClose()
  }

  return (
    <Dialog open onOpenChange={(v) => { if (!v) onClose() }}>
      <DialogContent className="sm:max-w-sm bg-[#FAF5EA] border-[#D9CFB9]">
        <DialogHeader>
          <DialogTitle className="text-[#1F1D1A]">Delete user?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-[#3A372F]">
          This will permanently delete <strong>{user.full_name ?? user.email}</strong> and all their data. This cannot be undone.
        </p>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="border-[#D9CFB9]">Cancel</Button>
          <Button onClick={handleDelete} disabled={loading} className="bg-red-600 hover:bg-red-700 text-white rounded-full">
            {loading ? 'Deleting…' : 'Delete'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function UsersTable({ users, coaches }: UsersTableProps) {
  const searchParams = useSearchParams()
  const activeRole = searchParams.get('role') ?? 'all'
  const [search, setSearch] = React.useState('')
  const [createOpen, setCreateOpen] = React.useState(false)
  const [editUser, setEditUser] = React.useState<User | null>(null)
  const [setPasswordUser, setSetPasswordUser] = React.useState<User | null>(null)
  const [deleteUser, setDeleteUser] = React.useState<User | null>(null)

  const filtered = users.filter((u) => {
    const matchesRole = activeRole === 'all' || u.role === activeRole
    const q = search.toLowerCase()
    const matchesSearch = !q || (u.full_name ?? '').toLowerCase().includes(q) || (u.email ?? '').toLowerCase().includes(q)
    return matchesRole && matchesSearch
  })

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <RoleFilterTabs current={activeRole} />
        <div className="flex gap-2">
          <Input
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-52 text-sm border-[#D9CFB9] focus-visible:ring-[#4A5F7F]"
          />
          <Button
            onClick={() => setCreateOpen(true)}
            className="bg-[#4A5F7F] hover:bg-[#3E5070] text-white rounded-full text-xs gap-1.5 flex-shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> New User
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-[#D9CFB9] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F5EFE2] border-b border-[#D9CFB9]">
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6E6A60] uppercase tracking-wide">Name</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6E6A60] uppercase tracking-wide hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6E6A60] uppercase tracking-wide">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-[#6E6A60] uppercase tracking-wide hidden md:table-cell">Joined</th>
              <th className="px-4 py-3 text-xs font-semibold text-[#6E6A60] uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D9CFB9] bg-white">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-sm text-[#6E6A60]">No users found.</td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAF5EA] transition-colors">
                  <td className="px-4 py-3 font-medium text-[#1F1D1A]">
                    {u.full_name ?? '—'}
                    <span className="block sm:hidden text-xs text-[#6E6A60] font-normal">{u.email}</span>
                  </td>
                  <td className="px-4 py-3 text-[#3A372F] hidden sm:table-cell">{u.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    <Badge variant={roleBadgeVariant[u.role] ?? 'gray'} className="text-[10px] capitalize">
                      {u.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[#6E6A60] text-xs hidden md:table-cell">
                    {new Date(u.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <MagicLinkButton userId={u.id} />
                      <button
                        onClick={() => setEditUser(u)}
                        title="Edit user"
                        className="p-1.5 rounded hover:bg-[#F5EFE2] text-[#6E6A60] hover:text-[#1F1D1A] transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setSetPasswordUser(u)}
                        title="Set password"
                        className="p-1.5 rounded hover:bg-[#F5EFE2] text-[#6E6A60] hover:text-[#4A5F7F] transition-colors"
                      >
                        <KeyRound className="w-3.5 h-3.5" />
                      </button>
                      <ResetLinkButton userId={u.id} />
                      <button
                        onClick={() => setDeleteUser(u)}
                        title="Delete user"
                        className="p-1.5 rounded hover:bg-red-50 text-[#6E6A60] hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {createOpen && (
        <CreateUserDialog coaches={coaches} open={createOpen} onClose={() => setCreateOpen(false)} />
      )}
      {editUser && (
        <EditUserDialog user={editUser} coaches={coaches} onClose={() => setEditUser(null)} />
      )}
      {setPasswordUser && (
        <SetPasswordDialog user={setPasswordUser} onClose={() => setSetPasswordUser(null)} />
      )}
      {deleteUser && (
        <DeleteUserDialog user={deleteUser} onClose={() => setDeleteUser(null)} />
      )}
    </div>
  )
}
