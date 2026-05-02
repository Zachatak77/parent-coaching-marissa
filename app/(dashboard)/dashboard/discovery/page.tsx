import { createClient } from '@/lib/supabase/server'
import { PhoneCall } from 'lucide-react'
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
          Leads who have submitted the booking form
        </p>
      </div>

      {!calls?.length ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[#D9CFB9] rounded-lg bg-white">
          <PhoneCall className="w-10 h-10 text-[#1F1D1A]/30 mb-4" />
          <p className="text-base font-medium text-[#6E6A60] mb-1">No discovery calls yet</p>
          <p className="text-sm text-muted-foreground max-w-xs">
            Submissions from the booking form will appear here.
          </p>
        </div>
      ) : (
        <DiscoveryTable calls={calls} coachId={user!.id} />
      )}
    </div>
  )
}
