import Link from 'next/link'
import { PublicNav } from '@/components/public/public-nav'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5EFE2' }}>
      <PublicNav />
      <main className="flex-1">{children}</main>
      <footer>

        {/* Portal access strip */}
        <div style={{ borderTop: '1px solid #D9CFB9', backgroundColor: '#F5EFE2' }} className="py-6">
          <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '.10em', textTransform: 'uppercase', color: '#6E6A60' }} className="mr-2">Portal access</p>
            {[
              { href: '/login?role=coach', label: 'Coach Login' },
              { href: '/login?role=parent', label: 'Parent Login' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                style={{ fontFamily: 'var(--font-ui)', fontSize: '0.74rem', color: '#3A372F', border: '1px solid #D9CFB9', borderRadius: 6, padding: '6px 14px', textDecoration: 'none' }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Main footer */}
        <div style={{ backgroundColor: '#2C2A28', color: '#C9BFAA' }} className="py-10 px-6 sm:px-10 lg:px-16">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', color: '#FAF5EA' }}>
              REIMAGINE Parenting
            </div>
            <div className="flex flex-col sm:items-end gap-1 text-center sm:text-right">
              <a
                href="mailto:parentcoachwithmarissa@gmail.com"
                style={{ fontFamily: 'var(--font-ui)', fontSize: '0.8rem', color: '#C9BFAA', textDecoration: 'none' }}
              >
                parentcoachwithmarissa@gmail.com
              </a>
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.72rem', letterSpacing: '.10em', textTransform: 'uppercase', color: '#6E6A60' }}>
                reimagineparenting.co · © {new Date().getFullYear()}
              </p>
            </div>
          </div>
        </div>

      </footer>
    </div>
  )
}
