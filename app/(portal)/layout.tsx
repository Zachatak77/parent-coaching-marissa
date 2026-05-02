import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClientForUser } from '@/lib/supabase/queries'
import { PortalSidebar, PortalMobileTabs } from '@/components/portal/portal-sidebar'

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: profile }, client] = await Promise.all([
    supabase.from('profiles').select('full_name, email, role').eq('id', user.id).single(),
    getClientForUser(supabase, user.id),
  ])

  if (profile?.role === 'coach' || profile?.role === 'admin') redirect('/dashboard')

  const fullName = profile?.full_name ?? user.email ?? 'there'
  const firstName = fullName.split(' ')[0]
  const initials = fullName
    .split(' ')
    .map((w: string) => w[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (!client) {
    return (
      <div className="min-h-screen bg-[#F5EFE2] flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#C8D1DF]/40 mx-auto">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="#4A5F7F">
              <path d="M12 21s-7.5-4.6-9.5-10.2C1.2 7.4 3.7 4 7.1 4c2 0 3.6 1 4.9 2.6C13.3 5 14.9 4 16.9 4c3.4 0 5.9 3.4 4.6 6.8C19.5 16.4 12 21 12 21z"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-[#1F1D1A]">Your account is being set up.</h1>
          <p className="text-sm text-[#3A372F] leading-relaxed">
            You&rsquo;ll hear from Marissa shortly with next steps. In the meantime, feel free to reach out.
          </p>
          <a
            href="mailto:parentcoachwithmarissa@gmail.com"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#4A5F7F] hover:underline"
          >
            parentcoachwithmarissa@gmail.com
          </a>
          <div className="pt-4">
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-xs text-[#6E6A60] hover:text-[#1F1D1A] hover:underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5EFE2] lg:flex">
      <PortalSidebar firstName={firstName} initials={initials} />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Desktop top bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-[#FAF5EA] border-b border-[#D9CFB9]">
          <span />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#4A5F7F] flex items-center justify-center text-xs font-bold text-white">
              {initials}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 px-4 py-6 pt-28 lg:pt-6 lg:px-8 pb-28 lg:pb-10 overflow-auto">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <PortalMobileTabs />
    </div>
  )
}
