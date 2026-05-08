import { createClient } from '@/lib/supabase/server'
import { DiscoveryTable } from '@/components/dashboard/discovery-table'

export default async function DiscoveryCallsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: calls } = await supabase
    .from('discovery_calls')
    .select('id, name, email, phone, child_ages, main_concern, how_they_heard, submitted_at, status, notes')
    .order('submitted_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1F1D1A]">Discovery Calls</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Leads from the booking form and manual entries
        </p>
      </div>
      <DiscoveryTable calls={calls ?? []} coachId={user!.id} />
    </div>
  )
}
