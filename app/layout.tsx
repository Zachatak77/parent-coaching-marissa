import type { Metadata } from 'next'
import { Inter, Nunito, Playfair_Display } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', weight: ['400', '600', '700', '800'] })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', weight: ['400', '700', '900'] })

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://reimagineparenting.co'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Reimagine Parenting',
    template: '%s — Reimagine Parenting',
  },
  description: 'Compassionate, practical parent coaching to help you raise confident, connected kids. Work with Marissa Schattner — parent coach specializing in challenging behavior and family dynamics.',
  keywords: ['parent coaching', 'parenting support', 'child behavior', 'family coaching', 'Marissa Schattner', 'Reimagine Parenting'],
  authors: [{ name: 'Marissa Schattner' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'Reimagine Parenting',
    title: 'Reimagine Parenting',
    description: 'More calm. More confidence. More connection.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reimagine Parenting',
    description: 'More calm. More confidence. More connection.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${nunito.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
