import { PublicNav } from '@/components/public/public-nav'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F0E8' }}>
      <PublicNav />
      <main className="flex-1">{children}</main>
      <footer className="border-t border-[#2D5016]/15 py-10 bg-[#F5F0E8]">
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
      </footer>
    </div>
  )
}
