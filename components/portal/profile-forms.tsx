'use client'

import * as React from 'react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfileAction, updatePasswordAction } from '@/app/actions/portal'

export function NameForm({ defaultName }: { defaultName: string }) {
  const [name, setName] = React.useState(defaultName)
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      const result = await updateProfileAction(name.trim())
      if (result.error) { toast.error(result.error); return }
      toast.success('Name updated.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-sm text-[#2D5016]">Full Name</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border-[#2D5016]/25 focus-visible:ring-[#2D5016] max-w-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !name.trim()}
        className="px-4 py-2 rounded-lg bg-[#2D5016] text-white text-sm font-semibold hover:bg-[#3a6b1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Saving…' : 'Save Name'}
      </button>
    </form>
  )
}

export function PasswordForm() {
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return }
    if (password !== confirm) { toast.error('Passwords do not match.'); return }
    setLoading(true)
    try {
      const result = await updatePasswordAction(password)
      if (result.error) { toast.error(result.error); return }
      toast.success('Password updated.')
      setPassword('')
      setConfirm('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1.5">
        <Label className="text-sm text-[#2D5016]">New Password</Label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          className="border-[#2D5016]/25 focus-visible:ring-[#2D5016] max-w-sm"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-sm text-[#2D5016]">Confirm Password</Label>
        <Input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat your new password"
          autoComplete="new-password"
          className="border-[#2D5016]/25 focus-visible:ring-[#2D5016] max-w-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading || !password}
        className="px-4 py-2 rounded-lg bg-[#2D5016] text-white text-sm font-semibold hover:bg-[#3a6b1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Updating…' : 'Update Password'}
      </button>
    </form>
  )
}
