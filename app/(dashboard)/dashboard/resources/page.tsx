import { createClient } from '@/lib/supabase/server'
import { ResourceLibrary } from '@/components/dashboard/resource-library'

export default async function DashboardResourcesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: resources }, { data: clients }] = await Promise.all([
    supabase
      .from('resources')
      .select('id, title, description, file_url, tags, is_public, created_at')
      .order('created_at', { ascending: false }),
    supabase
      .from('clients')
      .select('id, profiles:profile_id (full_name)')
      .eq('coach_id', user!.id)
      .eq('status', 'active'),
  ])

  const typedClients = (clients ?? []).map((c) => ({
    ...c,
    profiles: Array.isArray(c.profiles) ? c.profiles[0] ?? null : c.profiles,
  }))

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1F1D1A]">Resources</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and assign resources to your clients.
        </p>
      </div>

      <ResourceLibrary resources={resources ?? []} clients={typedClients} />
    </div>
  )
}
