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
      <body style={{ backgroundColor: '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', margin: 0, fontFamily: 'Inter, sans-serif' }}>
        <div style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '400px' }}>
          <h1 style={{ color: '#2D5016', fontSize: '22px', fontWeight: '700', marginBottom: '12px' }}>Something went wrong.</h1>
          <p style={{ color: '#2D5016', opacity: 0.6, fontSize: '15px', marginBottom: '24px' }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{ backgroundColor: '#2D5016', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  )
}
