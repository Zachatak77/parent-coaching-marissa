import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { BlobField } from '@/components/dashboard/ui/blob-field'

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
    <div className="min-h-screen flex bg-[#F7F7F5]">
      <AdminSidebar fullName={profile.full_name ?? null} />
      <main className="relative flex-1 overflow-x-hidden overflow-y-auto md:pt-0 pt-14">
        <BlobField />
        <div className="relative max-w-6xl mx-auto px-6 py-10">{children}</div>
      </main>
    </div>
  )
}
