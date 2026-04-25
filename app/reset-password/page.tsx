'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Leaf } from 'lucide-react'

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const fd = new FormData(e.currentTarget)
    const password = fd.get('password') as string
    const confirm = fd.get('confirm') as string

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    setDone(true)
    setTimeout(() => router.push('/login'), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F0E8]">
      <div className="w-full max-w-md">

        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2D5016] mb-4">
            <Leaf className="w-7 h-7 text-[#F5F0E8]" />
          </div>
          <h1 className="text-xl font-semibold text-[#2D5016]">Parent Coaching with Marissa</h1>
        </div>

        <div className="bg-white rounded-2xl border border-[#2D5016]/15 shadow-sm p-8">
          {done ? (
            <div className="text-center space-y-2">
              <h2 className="text-base font-semibold text-[#2D5016]">Password updated</h2>
              <p className="text-sm text-[#2D5016]/60">Redirecting you to sign in…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="text-base font-semibold text-[#2D5016]">Set a new password</h2>
                <p className="text-xs text-[#2D5016]/55 mt-1">Choose a password you'll remember.</p>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="confirm">Confirm Password</Label>
                <Input
                  id="confirm"
                  name="confirm"
                  type="password"
                  required
                  autoComplete="new-password"
                  className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#2D5016] text-[#F5F0E8] font-semibold py-2.5 text-sm hover:bg-[#3a6b1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {loading ? 'Updating…' : 'Set Password'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  )
}
