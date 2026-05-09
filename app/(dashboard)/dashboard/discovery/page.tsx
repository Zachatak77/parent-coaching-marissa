import { createClient } from '@/lib/supabase/server'
import { PhoneCall } from 'lucide-react'
import { DiscoveryTable, AddLeadButton } from '@/components/dashboard/discovery-table'
import { AdminDiscoveryTable } from '@/components/dashboard/admin-discovery-table'

export default async function DiscoveryCallsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user!.id)
    .single()

  const isAdmin = profile?.role === 'admin'

  if (isAdmin) {
    const [{ data: calls }, { data: coaches }] = await Promise.all([
      supabase
        .from('discovery_calls')
        .select('id, name, email, phone, child_ages, main_concern, how_they_heard, submitted_at, status, notes, coach_id')
        .order('submitted_at', { ascending: false }),
      supabase
        .from('profiles')
        .select('id, full_name, email')
        .eq('role', 'coach')
        .order('full_name'),
    ])

    return (
      <div>
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-[#1F1D1A]">All Discovery Leads</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All submissions — assign coaches and track progress
          </p>
        </div>
        <AdminDiscoveryTable calls={calls ?? []} coaches={coaches ?? []} />
      </div>
    )
  }

  const { data: calls } = await supabase
    .from('discovery_calls')
    .select('id, name, email, phone, child_ages, main_concern, how_they_heard, submitted_at, status, notes')
    .eq('coach_id', user!.id)
    .order('submitted_at', { ascending: false })

  const leadCount = calls?.length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F1D1A]">Discovery Calls</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {leadCount} lead{leadCount !== 1 ? 's' : ''} assigned to you
          </p>
        </div>
        <AddLeadButton />
      </div>

      {!calls?.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[#D9CFB9] rounded-lg bg-white">
          <PhoneCall className="w-10 h-10 text-[#1F1D1A]/30 mb-4" />
          <p className="text-base font-medium text-[#6E6A60] mb-1">No discovery calls yet</p>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Leads assigned to you will appear here. You can also add leads manually.
          </p>
          <AddLeadButton />
        </div>
      ) : (
        <DiscoveryTable calls={calls} coachId={user!.id} />
      )}
    </div>
  )
}
