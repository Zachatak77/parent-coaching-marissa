'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { signIn, signUp } from './actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Leaf } from 'lucide-react'
import Link from 'next/link'

type Mode = 'signin' | 'signup'

const roleLabels: Record<string, { title: string; desc: string; portal: string }> = {
  coach: {
    title: 'Coach portal',
    desc: 'Sign in to manage clients, sessions, and resources.',
    portal: 'Coach',
  },
  parent: {
    title: 'Parent portal',
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const fd = new FormData(e.currentTarget)
      fd.set('role', role)
      const result = (mode === 'signin' ? await signIn(fd) : await signUp(fd)) as {
        error?: string; redirectTo?: string; emailConfirmation?: boolean
      }
      if (result?.error) { setError(result.error); return }
      if (result?.emailConfirmation) { setEmailSent(true); return }
      if (result?.redirectTo) { router.push(result.redirectTo); return }
    } catch {
      setError('Something went wrong. Please try again.')
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

          {emailSent && (
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
          )}

          {!emailSent && (
          <>
          {/* Tabs */}
          <div className="flex border-b border-[#2D5016]/10">
            {(['signin', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
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
            <div className="mb-1">
              <p className="text-xs text-[#2D5016]/55">{info.desc}</p>
            </div>

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
              <Label htmlFor="password">Password</Label>
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
                ? mode === 'signin' ? 'Signing in…' : 'Creating account…'
                : mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>

            <p className="text-xs text-center text-[#2D5016]/45 pt-1">
              {mode === 'signin'
                ? <>No account?{' '}<button type="button" onClick={() => setMode('signup')} className="text-[#2D5016] font-medium hover:underline">Create one</button></>
                : <>Already have an account?{' '}<button type="button" onClick={() => setMode('signin')} className="text-[#2D5016] font-medium hover:underline">Sign in</button></>
              }
            </p>
          </form>
          </>
          )}
        </div>

        {/* Switch role */}
        <p className="text-center text-xs text-[#2D5016]/40 mt-5">
          {role === 'coach'
            ? <><Link href="/login?role=parent" className="hover:text-[#2D5016] hover:underline">Switch to Parent portal →</Link></>
            : <><Link href="/login?role=coach" className="hover:text-[#2D5016] hover:underline">Switch to Coach portal →</Link></>
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
