import type { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', weight: ['400', '600', '700', '800'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://parentcoaching.vercel.app'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Parent Coaching with Marissa',
    template: '%s — Parent Coaching with Marissa',
  },
  description: 'Compassionate, practical parent coaching to help you raise confident, connected kids. Work with Marissa Schattner — parent coach specializing in challenging behavior and family dynamics.',
  keywords: ['parent coaching', 'parenting support', 'child behavior', 'family coaching', 'Marissa Schattner'],
  authors: [{ name: 'Marissa Schattner' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Parent Coaching with Marissa',
    title: 'Parent Coaching with Marissa',
    description: 'Compassionate, practical parent coaching to help you raise confident, connected kids.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Parent Coaching with Marissa',
    description: 'Compassionate, practical parent coaching to help you raise confident, connected kids.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable}`}>
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
