import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'parent') redirect('/portal')
  if (profile?.role === 'coach') redirect('/dashboard')
  if (profile?.role !== 'admin') redirect('/login')

  return (
    <div className="min-h-screen flex bg-[#F5EFE2]">
      <AdminSidebar fullName={profile.full_name ?? null} />
      <main className="flex-1 overflow-auto md:pt-0 pt-14">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
