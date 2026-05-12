'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { updateProfileAction, changePasswordAction } from '@/app/actions/settings'

export function ProfileForm({ initialName }: { initialName: string }) {
  const [name, setName] = React.useState(initialName)
  const [saving, setSaving] = React.useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData()
    fd.append('full_name', name)
    const result = await updateProfileAction(fd)
    setSaving(false)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Profile updated')
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={saving || name === initialName}
        className="bg-[#4A5F7F] hover:bg-[#3E5070]/90 text-white"
      >
        {saving ? 'Saving…' : 'Save Changes'}
      </Button>
    </form>
  )
}

export function PasswordForm() {
  const [password, setPassword] = React.useState('')
  const [confirm, setConfirm] = React.useState('')
  const [saving, setSaving] = React.useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const fd = new FormData()
    fd.append('password', password)
    fd.append('confirm_password', confirm)
    const result = await changePasswordAction(fd)
    setSaving(false)
    if (result.error) toast.error(result.error)
    else {
      toast.success('Password updated')
      setPassword('')
      setConfirm('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="password">New Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Min. 8 characters"
          required
          minLength={8}
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="confirm_password">Confirm Password</Label>
        <Input
          id="confirm_password"
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Repeat new password"
          required
        />
      </div>
      <Button
        type="submit"
        disabled={saving || !password || !confirm}
        className="bg-[#4A5F7F] hover:bg-[#3E5070]/90 text-white"
      >
        {saving ? 'Updating…' : 'Update Password'}
      </Button>
    </form>
  )
}

export function CalendarIntegration({ connectedEmail, isConnected }: { connectedEmail: string | null; isConnected: boolean }) {
  const [disconnecting, setDisconnecting] = React.useState(false)
  const router = useRouter()

  const handleDisconnect = async () => {
    setDisconnecting(true)
    await fetch('/api/auth/google-calendar/disconnect', { method: 'POST' })
    router.refresh()
    setDisconnecting(false)
  }

  if (isConnected) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium">Connected</span>
        </div>
        <p className="text-sm text-muted-foreground">{connectedEmail ?? 'parentcoachwithmarissa@gmail.com'}</p>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDisconnect}
          disabled={disconnecting}
          className="border-[#D9CFB9] text-[#1F1D1A]"
        >
          {disconnecting ? 'Disconnecting…' : 'Disconnect'}
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/40" />
        <span className="text-sm text-muted-foreground">Not connected</span>
      </div>
      <Button asChild size="sm" className="bg-[#4A5F7F] hover:bg-[#3E5070]/90 text-white">
        <a href="/api/auth/google-calendar">Connect Google Calendar</a>
      </Button>
    </div>
  )
}

export function NotificationPreferences() {
  const [newDiscovery, setNewDiscovery] = React.useState(true)
  const [intakeSubmit, setIntakeSubmit] = React.useState(true)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">New discovery call submitted</p>
          <p className="text-xs text-muted-foreground">Get notified when someone fills out the booking form</p>
        </div>
        <Switch checked={newDiscovery} onCheckedChange={setNewDiscovery} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Parent completes intake form</p>
          <p className="text-xs text-muted-foreground">Get notified when a client submits their intake form</p>
        </div>
        <Switch checked={intakeSubmit} onCheckedChange={setIntakeSubmit} />
      </div>
      <p className="text-xs text-muted-foreground pt-2 border-t">
        Notifications via Resend — coming in a future update.
      </p>
    </div>
  )
}
