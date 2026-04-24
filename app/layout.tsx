import type { Metadata } from 'next'
import { Inter, Nunito } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const nunito = Nunito({ subsets: ['latin'], variable: '--font-nunito', weight: ['400', '600', '700', '800'] })

export const metadata: Metadata = {
  title: 'Parent Coaching with Marissa',
  description: 'Empowering parents with expert coaching and compassionate support.',
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
