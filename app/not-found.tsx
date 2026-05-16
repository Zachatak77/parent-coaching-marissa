import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: 'var(--cream)' }}>
      <div className="text-center space-y-4 max-w-md">
        <p style={{ fontSize: '4rem', fontWeight: 700, color: 'var(--navy-tint)', lineHeight: 1 }}>404</p>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.8rem', lineHeight: 1.05, color: 'var(--ds-text)' }}>
          Page not found.
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--ds-text-2)', lineHeight: 1.6 }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginTop: 8,
            padding: '13px 28px',
            background: 'var(--navy)',
            color: '#FFFFFF',
            borderRadius: 999,
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
            fontSize: '0.78rem',
            letterSpacing: '.14em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}
        >
          Go home
        </Link>
      </div>
    </div>
  )
}
