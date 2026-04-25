'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Leaf } from 'lucide-react'
import Link from 'next/link'

type Mode = 'signin' | 'signup' | 'forgot'

const roleLabels: Record<string, { desc: string; portal: string }> = {
  coach: {
    desc: 'Sign in to manage clients, sessions, and resources.',
    portal: 'Coach',
  },
  parent: {
    desc: 'Sign in to view your coaching plan and session notes.',
    portal: 'Parent',
  },
}

function LoginForm() {
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'parent'
  const info = roleLabels[role] ?? roleLabels.parent
  const router = useRouter()

  const [mode, setMode] = useState<Mode>('signin')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const email = (fd.get('email') as string).trim()

    try {
      if (mode === 'forgot') {
        const res = await fetch('/api/auth/forgot-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        })
        const data = await res.json()
        if (data.error) { setError(data.error); return }
        setResetSent(true)
        return
      }

      const password = fd.get('password') as string
      const full_name = (fd.get('full_name') as string | null)?.trim() ?? ''
      const endpoint = mode === 'signin' ? '/api/auth/signin' : '/api/auth/signup'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name, role }),
      })

      const data = await res.json()

      if (data.error) { setError(data.error); return }
      if (data.emailConfirmation) { setEmailSent(true); return }
      if (data.redirectTo) {
        router.push(data.redirectTo)
        router.refresh()
        return
      }

      setError('Unexpected response. Please try again.')
    } catch {
      setError('Could not reach the server. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#F5F0E8]">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2D5016] mb-4">
            <Leaf className="w-7 h-7 text-[#F5F0E8]" />
          </Link>
          <h1 className="text-xl font-semibold text-[#2D5016]">Parent Coaching with Marissa</h1>
          <p className="text-sm text-[#2D5016]/60 mt-1">{info.portal} Portal</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-[#2D5016]/15 shadow-sm overflow-hidden">

          {resetSent ? (
            <div className="p-8 text-center space-y-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2D5016]/10 mx-auto">
                <Leaf className="w-6 h-6 text-[#2D5016]" />
              </div>
              <h2 className="text-base font-semibold text-[#2D5016]">Check your email</h2>
              <p className="text-sm text-[#2D5016]/60">
                If that email has an account, we sent a password reset link. Check your inbox.
              </p>
              <button
                type="button"
                onClick={() => { setResetSent(false); setMode('signin') }}
                className="text-sm text-[#2D5016] font-medium hover:underline mt-2"
              >
                Back to sign in
              </button>
            </div>
          ) : emailSent ? (
            <div className="p-8 text-center space-y-3">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#2D5016]/10 mx-auto">
                <Leaf className="w-6 h-6 text-[#2D5016]" />
              </div>
              <h2 className="text-base font-semibold text-[#2D5016]">Check your email</h2>
              <p className="text-sm text-[#2D5016]/60">
                We sent a confirmation link to your inbox. Click it to activate your account, then come back to sign in.
              </p>
              <button
                type="button"
                onClick={() => { setEmailSent(false); setMode('signin') }}
                className="text-sm text-[#2D5016] font-medium hover:underline mt-2"
              >
                Back to sign in
              </button>
            </div>
          ) : mode === 'forgot' ? (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <h2 className="text-base font-semibold text-[#2D5016]">Reset your password</h2>
                <p className="text-xs text-[#2D5016]/55 mt-1">Enter your email and we'll send a reset link.</p>
              </div>

              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg bg-[#2D5016] text-[#F5F0E8] font-semibold py-2.5 text-sm hover:bg-[#3a6b1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : 'Send reset link'}
              </button>

              <p className="text-xs text-center text-[#2D5016]/45">
                <button type="button" onClick={() => { setMode('signin'); setError(null) }} className="text-[#2D5016] font-medium hover:underline">
                  Back to sign in
                </button>
              </p>
            </form>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex border-b border-[#2D5016]/10">
                {(['signin', 'signup'] as Mode[]).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => { setMode(m); setError(null) }}
                    className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                      mode === m
                        ? 'text-[#2D5016] border-b-2 border-[#2D5016]'
                        : 'text-[#2D5016]/45 hover:text-[#2D5016]/70'
                    }`}
                  >
                    {m === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <p className="text-xs text-[#2D5016]/55">{info.desc}</p>

                {error && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="space-y-1.5">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      placeholder="Jane Smith"
                      required
                      className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    {mode === 'signin' && (
                      <button
                        type="button"
                        onClick={() => { setMode('forgot'); setError(null) }}
                        className="text-xs text-[#2D5016]/55 hover:text-[#2D5016] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
                    className="border-[#2D5016]/25 focus-visible:ring-[#2D5016]"
                  />
                  {mode === 'signup' && (
                    <p className="text-xs text-[#2D5016]/45">Minimum 6 characters</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-lg bg-[#2D5016] text-[#F5F0E8] font-semibold py-2.5 text-sm hover:bg-[#3a6b1e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                >
                  {loading
                    ? (mode === 'signin' ? 'Signing in…' : 'Creating account…')
                    : (mode === 'signin' ? 'Sign In' : 'Create Account')}
                </button>

                <p className="text-xs text-center text-[#2D5016]/45 pt-1">
                  {mode === 'signin' ? (
                    <>No account?{' '}
                      <button type="button" onClick={() => setMode('signup')} className="text-[#2D5016] font-medium hover:underline">
                        Create one
                      </button>
                    </>
                  ) : (
                    <>Already have an account?{' '}
                      <button type="button" onClick={() => setMode('signin')} className="text-[#2D5016] font-medium hover:underline">
                        Sign in
                      </button>
                    </>
                  )}
                </p>
              </form>
            </>
          )}
        </div>

        {/* Switch role */}
        <p className="text-center text-xs text-[#2D5016]/40 mt-5">
          {role === 'coach'
            ? <Link href="/login?role=parent" className="hover:text-[#2D5016] hover:underline">Switch to Parent portal →</Link>
            : <Link href="/login?role=coach" className="hover:text-[#2D5016] hover:underline">Switch to Coach portal →</Link>
          }
        </p>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F5F0E8]" />}>
      <LoginForm />
    </Suspense>
  )
}
