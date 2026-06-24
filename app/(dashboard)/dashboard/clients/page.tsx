import { createClient } from '@/lib/supabase/server'
import { Users } from 'lucide-react'
import { NewClientButton } from '@/components/dashboard/new-client-button'
import { ClientsTable } from '@/components/dashboard/clients-table'
import { Reveal } from '@/components/public/reveal'
import { PageHeader } from '@/components/dashboard/ui/page-header'
import { LiftCard } from '@/components/dashboard/ui/lift-card'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: clients } = await supabase
    .from('clients')
    .select(`
      id,
      status,
      package,
      start_date,
      notes,
      profiles:profile_id (full_name, email, phone),
      sessions (session_date)
    `)
    .eq('coach_id', user!.id)
    .order('created_at', { ascending: false })

  const typedClients = (clients ?? []).map((c) => ({
    ...c,
    profiles: Array.isArray(c.profiles) ? c.profiles[0] ?? null : c.profiles,
    sessions: Array.isArray(c.sessions)
      ? [...c.sessions].sort((a, b) => new Date(b.session_date).getTime() - new Date(a.session_date).getTime())
      : [],
  }))

  return (
    <div>
      <Reveal>
        <PageHeader
          eyebrow="Roster"
          title="Clients"
          subtitle={`${typedClients.length} client${typedClients.length !== 1 ? 's' : ''} total`}
          actions={<NewClientButton coachId={user!.id} />}
        />
      </Reveal>

      <Reveal delay={80}>
        {typedClients.length === 0 ? (
          <LiftCard interactive={false} className="border-dashed">
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <Users className="w-10 h-10 text-[#1F1D1A]/30 mb-4" />
              <p className="font-cormorant text-2xl font-semibold text-[#1F1D1A] mb-1">No clients yet</p>
              <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                Add your first client to get started.
              </p>
              <NewClientButton coachId={user!.id} />
            </div>
          </LiftCard>
        ) : (
          <ClientsTable clients={typedClients} />
        )}
      </Reveal>
    </div>
  )
}
