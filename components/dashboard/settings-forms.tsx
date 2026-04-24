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
        className="bg-[#2D5016] hover:bg-[#2D5016]/90 text-white"
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
        className="bg-[#2D5016] hover:bg-[#2D5016]/90 text-white"
      >
        {saving ? 'Updating…' : 'Update Password'}
      </Button>
    </form>
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
