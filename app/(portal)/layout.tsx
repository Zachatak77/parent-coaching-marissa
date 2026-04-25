import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getClientForUser } from '@/lib/supabase/queries'
import { PortalSidebar, PortalMobileTabs } from '@/components/portal/portal-sidebar'
import { Leaf } from 'lucide-react'

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
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center p-6">
        <div className="max-w-md text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#2D5016]/10 mx-auto">
            <Leaf className="w-8 h-8 text-[#2D5016]" />
          </div>
          <h1 className="text-xl font-semibold text-[#2D5016]">Your account is being set up.</h1>
          <p className="text-sm text-[#2D5016]/65 leading-relaxed">
            You&rsquo;ll hear from Marissa shortly with next steps. In the meantime, feel free to reach out.
          </p>
          <a
            href="mailto:parentcoachwithmarissa@gmail.com"
            className="inline-flex items-center gap-2 text-sm font-medium text-[#2D5016] hover:underline"
          >
            parentcoachwithmarissa@gmail.com
          </a>
          <div className="pt-4">
            <form action="/auth/signout" method="post">
              <button type="submit" className="text-xs text-[#2D5016]/45 hover:text-[#2D5016] hover:underline">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] lg:flex">
      <PortalSidebar firstName={firstName} initials={initials} />

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Desktop top bar */}
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-white border-b border-[#2D5016]/10">
          <span />
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#2D5016] flex items-center justify-center text-xs font-bold text-white">
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
