import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/dashboard/sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'parent') redirect('/portal')

  const isAdmin = profile?.role === 'admin'
  const { count: discoveryCount } = await (isAdmin
    ? supabase.from('discovery_calls').select('*', { count: 'exact', head: true }).eq('status', 'new')
    : supabase.from('discovery_calls').select('*', { count: 'exact', head: true }).eq('status', 'new').eq('coach_id', user.id)
  )

  return (
    <div className="min-h-screen flex bg-white">
      <Sidebar
        fullName={profile?.full_name ?? null}
        role={profile?.role ?? null}
        discoveryCount={discoveryCount ?? 0}
      />
      <main className="flex-1 overflow-auto md:pt-0 pt-14">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
