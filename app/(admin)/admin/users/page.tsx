import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { UsersTable } from '@/components/admin/users-table'
import { Reveal } from '@/components/public/reveal'
import { PageHeader } from '@/components/dashboard/ui/page-header'

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
      <Reveal>
        <PageHeader
          eyebrow="People"
          title="Users"
          subtitle={`${users?.length ?? 0} total`}
        />
      </Reveal>

      <Reveal delay={80}>
        <Suspense>
          <UsersTable users={users ?? []} coaches={coaches ?? []} />
        </Suspense>
      </Reveal>
    </div>
  )
}
