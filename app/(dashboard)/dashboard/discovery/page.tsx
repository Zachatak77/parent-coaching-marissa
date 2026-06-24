import { createClient } from '@/lib/supabase/server'
import { PhoneCall } from 'lucide-react'
import { DiscoveryTable, AddLeadButton } from '@/components/dashboard/discovery-table'
import { AdminDiscoveryTable } from '@/components/dashboard/admin-discovery-table'
import { Reveal } from '@/components/public/reveal'
import { PageHeader } from '@/components/dashboard/ui/page-header'
import { LiftCard } from '@/components/dashboard/ui/lift-card'

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
        <Reveal>
          <PageHeader
            eyebrow="Pipeline"
            title="All Discovery Leads"
            subtitle="All submissions — assign coaches and track progress"
          />
        </Reveal>
        <Reveal delay={80}>
          <AdminDiscoveryTable calls={calls ?? []} coaches={coaches ?? []} />
        </Reveal>
      </div>
    )
  }

  const { data: calls } = await supabase
    .from('discovery_calls')
    .select('id, name, email, phone, child_ages, main_concern, how_they_heard, submitted_at, scheduled_at, status, notes')
    .eq('coach_id', user!.id)
    .order('submitted_at', { ascending: false })

  const leadCount = calls?.length ?? 0

  return (
    <div>
      <Reveal>
        <PageHeader
          eyebrow="Pipeline"
          title="Discovery Calls"
          subtitle={`${leadCount} lead${leadCount !== 1 ? 's' : ''} assigned to you`}
          actions={<AddLeadButton />}
        />
      </Reveal>

      <Reveal delay={80}>
        {!calls?.length ? (
          <LiftCard interactive={false} className="border-dashed">
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <PhoneCall className="w-10 h-10 text-[#1F1D1A]/30 mb-4" />
              <p className="font-cormorant text-2xl font-semibold text-[#1F1D1A] mb-1">No discovery calls yet</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Leads assigned to you will appear here. You can also add leads manually.
              </p>
              <AddLeadButton />
            </div>
          </LiftCard>
        ) : (
          <DiscoveryTable calls={calls} coachId={user!.id} />
        )}
      </Reveal>
    </div>
  )
}
