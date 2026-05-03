import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { UsersTable } from '@/components/admin/users-table'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>
}) {
  const { role } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('profiles')
    .select('id, full_name, email, role, coach_id, created_at')
    .order('created_at', { ascending: false })

  if (role && ['admin', 'coach', 'parent'].includes(role)) {
    query = query.eq('role', role)
  }

  const [{ data: users }, { data: coaches }] = await Promise.all([
    query,
    supabase
      .from('profiles')
      .select('id, full_name')
      .eq('role', 'coach')
      .order('full_name'),
  ])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F1D1A]">Users</h1>
          <p className="text-sm text-muted-foreground mt-1">{users?.length ?? 0} total</p>
        </div>
      </div>

      <Suspense>
        <UsersTable users={users ?? []} coaches={coaches ?? []} />
      </Suspense>
    </div>
  )
}
