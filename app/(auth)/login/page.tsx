'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'

const NAVY     = '#4A5F7F'
const CREAM    = '#F5EFE2'
const TEXT     = '#1F1D1A'
const TEXT2    = '#3A372F'
const DIM      = '#6E6A60'
const HAIRLINE = '#D9CFB9'
const D = 'var(--font-display)'
const U = 'var(--font-ui)'
const B = 'var(--font-body)'

function LoginForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const linkExpired = searchParams.get('error') === 'link-expired'
  const [mode, setMode] = useState<'signin' | 'forgot'>(linkExpired ? 'forgot' : 'signin')
  const [error, setError] = useState<string | null>(
    linkExpired ? 'That link has expired. Enter your email to request a new one.' : null
  )
  const [loading, setLoading] = useState(false)
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
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (data.error) { setError(data.error); return }
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
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: CREAM }}>
      <div style={{ width: '100%', maxWidth: 400 }}>

        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
            <span style={{ display: 'block', fontFamily: U, fontWeight: 700, fontSize: '0.58rem', letterSpacing: '.22em', textTransform: 'uppercase', color: DIM, lineHeight: 1, marginBottom: 4 }}>
              Reimagine
            </span>
            <span style={{ display: 'block', fontFamily: D, fontWeight: 700, fontSize: '1.6rem', color: TEXT, lineHeight: 1, paddingLeft: 14 }}>
              Parenting
            </span>
          </Link>
        </div>

        {/* Card */}
        <div style={{ background: '#fff', borderRadius: 20, border: `1px solid ${HAIRLINE}`, boxShadow: '0 2px 16px rgba(0,0,0,0.06)', overflow: 'hidden' }}>

          {resetSent ? (
            <div style={{ padding: '40px 32px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={NAVY} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.4rem', color: TEXT, margin: '0 0 10px' }}>Check your email</h2>
              <p style={{ fontFamily: B, fontSize: '0.9rem', color: TEXT2, lineHeight: 1.55, margin: '0 0 20px' }}>
                If that email has an account, we sent a password reset link. Check your inbox.
              </p>
              <button
                type="button"
                onClick={() => { setResetSent(false); setMode('signin') }}
                style={{ fontFamily: U, fontWeight: 600, fontSize: '0.78rem', letterSpacing: '.12em', textTransform: 'uppercase', color: NAVY, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ← Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ padding: '36px 32px' }}>
              <h2 style={{ fontFamily: D, fontWeight: 700, fontSize: '1.5rem', color: TEXT, margin: '0 0 6px' }}>
                {mode === 'signin' ? 'Welcome back' : 'Reset password'}
              </h2>
              <p style={{ fontFamily: B, fontSize: '0.88rem', color: DIM, margin: '0 0 24px', lineHeight: 1.5 }}>
                {mode === 'signin'
                  ? 'Sign in to access your portal.'
                  : 'Enter your email and we\'ll send a reset link.'}
              </p>

              {error && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', marginBottom: 18, fontSize: '0.85rem', color: '#DC2626', fontFamily: B }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <Label htmlFor="email" style={{ fontFamily: U, fontWeight: 600, fontSize: '0.75rem', letterSpacing: '.08em', color: TEXT }}>Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  style={{ marginTop: 6, borderColor: HAIRLINE }}
                  className="focus-visible:ring-[#4A5F7F]"
                />
              </div>

              {mode === 'signin' && (
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Label htmlFor="password" style={{ fontFamily: U, fontWeight: 600, fontSize: '0.75rem', letterSpacing: '.08em', color: TEXT }}>Password</Label>
                    <button
                      type="button"
                      onClick={() => { setMode('forgot'); setError(null) }}
                      style={{ fontFamily: U, fontSize: '0.72rem', color: DIM, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    style={{ borderColor: HAIRLINE }}
                    className="focus-visible:ring-[#4A5F7F]"
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: '13px 24px', background: NAVY, color: '#FAF5EA',
                  borderRadius: 999, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: U, fontWeight: 600, fontSize: '0.82rem', letterSpacing: '.14em',
                  textTransform: 'uppercase', opacity: loading ? 0.65 : 1, transition: 'opacity .15s',
                }}
              >
                {loading
                  ? (mode === 'signin' ? 'Signing in…' : 'Sending…')
                  : (mode === 'signin' ? 'Sign In' : 'Send Reset Link')}
              </button>

              {mode === 'forgot' && (
                <p style={{ textAlign: 'center', marginTop: 18, fontFamily: U, fontSize: '0.75rem', color: DIM }}>
                  <button type="button" onClick={() => { setMode('signin'); setError(null) }} style={{ color: NAVY, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                    ← Back to sign in
                  </button>
                </p>
              )}
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', marginTop: 20, fontFamily: U, fontSize: '0.72rem', color: DIM }}>
          Need access?{' '}
          <a href="mailto:parentcoachwithmarissa@gmail.com" style={{ color: NAVY, textDecoration: 'none', fontWeight: 600 }}>
            Contact Marissa
          </a>
        </p>

      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#F5EFE2' }} />}>
      <LoginForm />
    </Suspense>
  )
}
