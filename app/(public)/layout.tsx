import Link from 'next/link'
import { PublicNav } from '@/components/public/public-nav'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F0E8' }}>
      <PublicNav />
      <main className="flex-1">{children}</main>
      <footer className="bg-[#F5F0E8]">

        {/* Portal access strip */}
        <div className="border-t border-[#2D5016]/10 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
            <p className="text-xs text-[#2D5016]/50 font-medium mr-2">Portal access:</p>
            <Link
              href="/login?role=coach"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#2D5016]/25 text-xs font-semibold text-[#2D5016] hover:bg-[#2D5016]/5 transition-colors"
            >
              Coach Login / Sign Up
            </Link>
            <Link
              href="/login?role=parent"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#2D5016]/25 text-xs font-semibold text-[#2D5016] hover:bg-[#2D5016]/5 transition-colors"
            >
              Parent Login / Sign Up
            </Link>
          </div>
        </div>

        {/* Main footer row */}
        <div className="border-t border-[#2D5016]/10 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#2D5016] text-sm">Parent Coaching with Marissa</p>
              <p className="text-xs text-[#2D5016]/60 mt-0.5">Supporting families across New Jersey</p>
            </div>
            <div className="flex flex-col sm:items-end gap-1 text-center sm:text-right">
              <a
                href="mailto:parentcoachwithmarissa@gmail.com"
                className="text-sm text-[#2D5016]/70 hover:text-[#2D5016] transition-colors"
              >
                parentcoachwithmarissa@gmail.com
              </a>
              <p className="text-xs text-[#2D5016]/50">© {new Date().getFullYear()} Parent Coaching with Marissa</p>
            </div>
          </div>
        </div>

      </footer>
    </div>
  )
}
