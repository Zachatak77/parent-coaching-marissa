import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, PhoneCall, CalendarDays, ArrowRight, UserCheck } from 'lucide-react'
import { NewClientButton } from '@/components/dashboard/new-client-button'
import { Reveal } from '@/components/public/reveal'
import { PageHeader } from '@/components/dashboard/ui/page-header'
import { StatCard } from '@/components/dashboard/ui/stat-card'
import { LiftCard, LiftCardContent, LiftCardHeader, LiftCardTitle } from '@/components/dashboard/ui/lift-card'

const ACCENTS = ['var(--navy)', 'var(--sage)', 'var(--peach)', 'var(--straw)']

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

const statusColors: Record<string, 'blue' | 'yellow' | 'green' | 'darkgreen' | 'gray'> = {
  new: 'blue',
  contacted: 'yellow',
  booked: 'green',
  converted: 'darkgreen',
  closed: 'gray',
}

export default async function DashboardOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user!.id)
    .single()

  const isAdmin = profile?.role === 'admin'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Coach'
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (isAdmin) {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

    const [
      { count: totalClients },
      { count: totalCoaches },
      { count: newLeads },
      { count: totalLeads },
      { count: convertedLeads },
      { count: sessionsThisMonth },
      { data: recentLeads },
    ] = await Promise.all([
      supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'coach'),
      supabase.from('discovery_calls').select('*', { count: 'exact', head: true }).eq('status', 'new'),
      supabase.from('discovery_calls').select('*', { count: 'exact', head: true }),
      supabase.from('discovery_calls').select('*', { count: 'exact', head: true }).eq('status', 'converted'),
      supabase.from('sessions').select('*', { count: 'exact', head: true }).gte('session_date', monthStart).lte('session_date', monthEnd),
      supabase.from('discovery_calls')
        .select('id, name, submitted_at, status, coach_id')
        .order('submitted_at', { ascending: false })
        .limit(8),
    ])

    const conversionRate = (totalLeads ?? 0) > 0
      ? Math.round(((convertedLeads ?? 0) / (totalLeads ?? 1)) * 100)
      : 0

    return (
      <div>
        <Reveal>
          <PageHeader
            eyebrow="Admin"
            title={`${greeting}, ${firstName}`}
            subtitle="Admin overview"
            actions={
              <Button asChild className="bg-[#5F728D] hover:bg-[#54647C] text-white rounded-full text-sm">
                <Link href="/dashboard/discovery">Manage All Leads</Link>
              </Button>
            }
          />
        </Reveal>

        <Reveal delay={80}>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Active Clients', value: totalClients ?? 0, icon: Users, href: '/dashboard/clients' },
              { label: 'Total Coaches', value: totalCoaches ?? 0, icon: UserCheck, href: null },
              { label: 'New Leads', value: newLeads ?? 0, icon: PhoneCall, href: '/dashboard/discovery' },
              { label: 'Sessions This Month', value: sessionsThisMonth ?? 0, icon: CalendarDays, href: null },
            ].map(({ label, value, icon, href }, i) => (
              <StatCard key={label} label={label} value={value} icon={icon} href={href} accent={ACCENTS[i % ACCENTS.length]} />
            ))}
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 gap-6 mb-6">
          <Reveal delay={160}>
            <LiftCard accent="var(--navy)" interactive={false}>
              <LiftCardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <LiftCardTitle className="flex items-center gap-2 text-lg">
                    <PhoneCall className="w-4 h-4 text-[#6E6A60]" /> Discovery Funnel
                  </LiftCardTitle>
                  <span className="text-xs text-[#6E6A60]">{conversionRate}% conversion</span>
                </div>
              </LiftCardHeader>
              <LiftCardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'New', status: 'new' },
                    { label: 'Contacted', status: 'contacted' },
                    { label: 'Booked', status: 'booked' },
                    { label: 'Converted', status: 'converted' },
                    { label: 'Closed', status: 'closed' },
                  ].map(({ label, status }) => (
                    <div key={status} className="flex items-center gap-1.5 bg-[#F7F7F5] rounded-lg px-3 py-2">
                      <Badge variant={statusColors[status] ?? 'gray'}>{label}</Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Link href="/dashboard/discovery" className="text-xs font-medium text-[#5F728D] hover:underline flex items-center gap-1">
                    View all leads & assign coaches <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </LiftCardContent>
            </LiftCard>
          </Reveal>

          <Reveal delay={240}>
            <LiftCard accent="var(--peach)" interactive={false}>
              <LiftCardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <LiftCardTitle className="text-lg">Recent Leads</LiftCardTitle>
                  <Link href="/dashboard/discovery" className="text-xs text-[#6E6A60] hover:text-[#1F1D1A]">
                    Manage all
                  </Link>
                </div>
              </LiftCardHeader>
              <LiftCardContent>
                {!recentLeads?.length ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No leads yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {recentLeads.map((call) => (
                      <li key={call.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1F1D1A] truncate">{call.name}</p>
                          <p className="text-xs text-muted-foreground">{formatRelative(call.submitted_at)}</p>
                        </div>
                        <Badge variant={statusColors[call.status] ?? 'gray'} className="flex-shrink-0">
                          {call.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </LiftCardContent>
            </LiftCard>
          </Reveal>
        </div>
      </div>
    )
  }

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const [
    { count: activeClients },
    { count: newDiscovery },
    { count: sessionsThisMonth },
    { count: upcomingSessions },
  ] = await Promise.all([
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active').eq('coach_id', user!.id),
    supabase.from('discovery_calls').select('*', { count: 'exact', head: true }).eq('status', 'new').eq('coach_id', user!.id),
    supabase.from('sessions').select('*, clients!inner(coach_id)', { count: 'exact', head: true }).eq('clients.coach_id', user!.id).gte('session_date', monthStart).lte('session_date', monthEnd),
    supabase.from('sessions').select('*, clients!inner(coach_id)', { count: 'exact', head: true }).eq('clients.coach_id', user!.id).gt('session_date', now.toISOString()),
  ])

  const { data: recentDiscovery } = await supabase
    .from('discovery_calls')
    .select('id, name, submitted_at, status')
    .eq('coach_id', user!.id)
    .order('submitted_at', { ascending: false })
    .limit(5)

  const { data: recentSessions } = await supabase
    .from('sessions')
    .select('id, session_date, shared_with_parent, clients!inner(coach_id, profiles(full_name))')
    .eq('clients.coach_id', user!.id)
    .order('session_date', { ascending: false })
    .limit(5)

  return (
    <div>
      <Reveal>
        <PageHeader
          eyebrow="Your practice"
          title={`${greeting}, ${firstName}`}
          subtitle="Here's an overview of your coaching practice."
          actions={
            <>
              <NewClientButton coachId={user!.id} />
              <Button variant="outline" size="sm" asChild className="rounded-full">
                <Link href="/dashboard/discovery" className="flex items-center gap-1.5">
                  Discovery Queue
                  {(newDiscovery ?? 0) > 0 && (
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-[#5F728D] text-white text-[9px] font-bold">
                      {newDiscovery}
                    </span>
                  )}
                </Link>
              </Button>
            </>
          }
        />
      </Reveal>

      <Reveal delay={80}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Active Clients', value: activeClients ?? 0, icon: Users, href: '/dashboard/clients' },
            { label: 'New Discovery Calls', value: newDiscovery ?? 0, icon: PhoneCall, href: '/dashboard/discovery' },
            { label: 'Sessions This Month', value: sessionsThisMonth ?? 0, icon: CalendarDays, href: null },
            { label: 'Upcoming Sessions', value: upcomingSessions ?? 0, icon: CalendarDays, href: null },
          ].map(({ label, value, icon, href }, i) => (
            <StatCard key={label} label={label} value={value} icon={icon} href={href} accent={ACCENTS[i % ACCENTS.length]} />
          ))}
        </div>
      </Reveal>

      <div className="grid sm:grid-cols-2 gap-6">
        <Reveal delay={160}>
          <LiftCard accent="var(--navy)" interactive={false}>
            <LiftCardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <LiftCardTitle className="text-lg">Recent Discovery Calls</LiftCardTitle>
                <Link href="/dashboard/discovery" className="text-xs text-[#6E6A60] hover:text-[#1F1D1A]">View all</Link>
              </div>
            </LiftCardHeader>
            <LiftCardContent>
              {!recentDiscovery?.length ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No discovery calls yet.</p>
              ) : (
                <ul className="space-y-3">
                  {recentDiscovery.map((call) => (
                    <li key={call.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-[#1F1D1A] truncate">{call.name}</p>
                        <p className="text-xs text-muted-foreground">{formatRelative(call.submitted_at)}</p>
                      </div>
                      <Badge variant={statusColors[call.status] ?? 'gray'} className="flex-shrink-0">{call.status}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </LiftCardContent>
          </LiftCard>
        </Reveal>

        <Reveal delay={240}>
          <LiftCard accent="var(--sage)" interactive={false}>
            <LiftCardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <LiftCardTitle className="text-lg">Recent Sessions</LiftCardTitle>
                <Link href="/dashboard/clients" className="text-xs text-[#6E6A60] hover:text-[#1F1D1A]">View clients</Link>
              </div>
            </LiftCardHeader>
            <LiftCardContent>
              {!recentSessions?.length ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No sessions logged yet.</p>
              ) : (
                <ul className="space-y-3">
                  {recentSessions.map((session) => {
                    const clientName = (session.clients as any)?.profiles?.full_name ?? 'Client'
                    return (
                      <li key={session.id} className="flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-[#1F1D1A] truncate">{clientName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(session.session_date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={session.shared_with_parent ? 'green' : 'gray'} className="flex-shrink-0">
                          {session.shared_with_parent ? 'Shared' : 'Private'}
                        </Badge>
                      </li>
                    )
                  })}
                </ul>
              )}
            </LiftCardContent>
          </LiftCard>
        </Reveal>
      </div>
    </div>
  )
}
