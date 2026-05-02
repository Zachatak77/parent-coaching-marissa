import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, PhoneCall, CalendarDays, ArrowRight, Plus } from 'lucide-react'
import { NewClientButton } from '@/components/dashboard/new-client-button'

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
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Coach'

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  // Stats
  const [
    { count: activeClients },
    { count: newDiscovery },
    { count: sessionsThisMonth },
    { count: upcomingSessions },
  ] = await Promise.all([
    supabase
      .from('clients')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .eq('coach_id', user!.id),
    supabase
      .from('discovery_calls')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),
    supabase
      .from('sessions')
      .select('*, clients!inner(coach_id)', { count: 'exact', head: true })
      .eq('clients.coach_id', user!.id)
      .gte('session_date', monthStart)
      .lte('session_date', monthEnd),
    supabase
      .from('sessions')
      .select('*, clients!inner(coach_id)', { count: 'exact', head: true })
      .eq('clients.coach_id', user!.id)
      .gt('session_date', now.toISOString()),
  ])

  // Recent activity
  const { data: recentDiscovery } = await supabase
    .from('discovery_calls')
    .select('id, name, submitted_at, status')
    .order('submitted_at', { ascending: false })
    .limit(5)

  const { data: recentSessions } = await supabase
    .from('sessions')
    .select('id, session_date, shared_with_parent, clients!inner(coach_id, profiles(full_name))')
    .eq('clients.coach_id', user!.id)
    .order('session_date', { ascending: false })
    .limit(5)

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F1D1A]">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Here&apos;s an overview of your coaching practice.
          </p>
        </div>
        <div className="flex gap-2">
          <NewClientButton coachId={user!.id} />
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/discovery" className="flex items-center gap-1.5">
              View Discovery Queue
              {(newDiscovery ?? 0) > 0 && (
                <span className="flex items-center justify-center w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] font-bold">
                  {newDiscovery}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Active Clients', value: activeClients ?? 0, icon: Users, href: '/dashboard/clients' },
          { label: 'New Discovery Calls', value: newDiscovery ?? 0, icon: PhoneCall, href: '/dashboard/discovery' },
          { label: 'Sessions This Month', value: sessionsThisMonth ?? 0, icon: CalendarDays, href: null },
          { label: 'Upcoming Sessions', value: upcomingSessions ?? 0, icon: CalendarDays, href: null },
        ].map(({ label, value, icon: Icon, href }) => (
          <Card key={label} className="border-[#D9CFB9]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{label}</p>
                <Icon className="w-4 h-4 text-[#6E6A60]" />
              </div>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <p className="text-2xl font-semibold text-[#1F1D1A]">{value}</p>
              {href && (
                <Link href={href} className="text-xs text-[#6E6A60] hover:text-[#1F1D1A] flex items-center gap-0.5">
                  View <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Activity feed */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="border-[#D9CFB9]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-[#1F1D1A]">
                Recent Discovery Calls
              </CardTitle>
              <Link href="/dashboard/discovery" className="text-xs text-[#6E6A60] hover:text-[#1F1D1A]">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
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
                    <Badge variant={statusColors[call.status] ?? 'gray'} className="flex-shrink-0 text-[10px]">
                      {call.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#D9CFB9]">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-[#1F1D1A]">
                Recent Sessions
              </CardTitle>
              <Link href="/dashboard/clients" className="text-xs text-[#6E6A60] hover:text-[#1F1D1A]">
                View clients
              </Link>
            </div>
          </CardHeader>
          <CardContent>
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
                        <p className="text-xs text-muted-foreground">
                          {new Date(session.session_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge
                        variant={session.shared_with_parent ? 'green' : 'gray'}
                        className="flex-shrink-0 text-[10px]"
                      >
                        {session.shared_with_parent ? 'Shared' : 'Private'}
                      </Badge>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
