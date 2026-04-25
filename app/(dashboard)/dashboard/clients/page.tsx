import { createClient } from '@/lib/supabase/server'
import { Users } from 'lucide-react'
import { NewClientButton } from '@/components/dashboard/new-client-button'
import { ClientsTable } from '@/components/dashboard/clients-table'

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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#2D5016]">Clients</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {typedClients.length} client{typedClients.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <NewClientButton coachId={user!.id} />
      </div>

      {typedClients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-[#2D5016]/20 rounded-lg bg-white">
          <Users className="w-10 h-10 text-[#2D5016]/30 mb-4" />
          <p className="text-base font-medium text-[#2D5016]/60 mb-1">No clients yet</p>
          <p className="text-sm text-muted-foreground mb-6 max-w-xs">
            Add your first client to get started.
          </p>
          <NewClientButton coachId={user!.id} />
        </div>
      ) : (
        <ClientsTable clients={typedClients} />
      )}
    </div>
  )
}
