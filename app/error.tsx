'use client'

import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html>
      <body style={{ backgroundColor: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0 }}>
        <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '400px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.5rem', color: 'var(--ds-text)', marginBottom: 12 }}>
            Something went wrong.
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--ds-text-2)', lineHeight: 1.6, marginBottom: 28 }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: 'var(--navy)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: 999,
              padding: '13px 28px',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.78rem',
              fontWeight: 600,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
