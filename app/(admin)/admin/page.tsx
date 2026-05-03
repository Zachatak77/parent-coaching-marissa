import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, UserCheck, PhoneCall, CalendarDays, Package } from 'lucide-react'

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

const packageLabels: Record<string, string> = {
  confident_parent: 'Confident Parent',
  partnership: 'Partnership',
  ongoing: 'Ongoing',
}

export default async function AdminOverviewPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const [
    { count: totalParents },
    { count: totalCoaches },
    { count: totalAdmins },
    { count: activeClients },
    { count: discoveryNew },
    { count: discoveryContacted },
    { count: discoveryBooked },
    { count: discoveryConverted },
    { count: discoveryClosed },
    { count: sessionsThisMonth },
    { count: pkgConfident },
    { count: pkgPartnership },
    { count: pkgOngoing },
    { count: totalResources },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'parent'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'coach'),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('discovery_calls').select('*', { count: 'exact', head: true }).eq('status', 'new'),
    supabase.from('discovery_calls').select('*', { count: 'exact', head: true }).eq('status', 'contacted'),
    supabase.from('discovery_calls').select('*', { count: 'exact', head: true }).eq('status', 'booked'),
    supabase.from('discovery_calls').select('*', { count: 'exact', head: true }).eq('status', 'converted'),
    supabase.from('discovery_calls').select('*', { count: 'exact', head: true }).eq('status', 'closed'),
    supabase.from('sessions').select('*', { count: 'exact', head: true }).gte('session_date', monthStart).lte('session_date', monthEnd),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('package', 'confident_parent'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('package', 'partnership'),
    supabase.from('clients').select('*', { count: 'exact', head: true }).eq('package', 'ongoing'),
    supabase.from('resources').select('*', { count: 'exact', head: true }),
  ])

  const { data: recentDiscovery } = await supabase
    .from('discovery_calls')
    .select('id, name, email, submitted_at, status')
    .order('submitted_at', { ascending: false })
    .limit(5)

  const { data: recentSessions } = await supabase
    .from('sessions')
    .select('id, session_date, clients(profiles(full_name), coach_id)')
    .order('session_date', { ascending: false })
    .limit(5)

  const totalDiscovery = (discoveryNew ?? 0) + (discoveryContacted ?? 0) + (discoveryBooked ?? 0) + (discoveryConverted ?? 0) + (discoveryClosed ?? 0)
  const conversionRate = totalDiscovery > 0
    ? Math.round(((discoveryConverted ?? 0) / totalDiscovery) * 100)
    : 0

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Admin'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1F1D1A]">{greeting}, {firstName}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* User counts */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Parents', value: totalParents ?? 0, icon: Users },
          { label: 'Total Coaches', value: totalCoaches ?? 0, icon: UserCheck },
          { label: 'Active Clients', value: activeClients ?? 0, icon: UserCheck },
        ].map(({ label, value, icon: Icon }) => (
          <Card key={label} className="border-[#D9CFB9]">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{label}</p>
                <Icon className="w-4 h-4 text-[#6E6A60]" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-[#1F1D1A]">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Discovery funnel */}
      <Card className="border-[#D9CFB9] mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-[#1F1D1A] flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-[#6E6A60]" />
              Discovery Call Funnel
            </CardTitle>
            <span className="text-xs text-[#6E6A60]">{conversionRate}% conversion rate</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'New', count: discoveryNew ?? 0, status: 'new' },
              { label: 'Contacted', count: discoveryContacted ?? 0, status: 'contacted' },
              { label: 'Booked', count: discoveryBooked ?? 0, status: 'booked' },
              { label: 'Converted', count: discoveryConverted ?? 0, status: 'converted' },
              { label: 'Closed', count: discoveryClosed ?? 0, status: 'closed' },
            ].map(({ label, count, status }) => (
              <div key={status} className="flex items-center gap-2 bg-[#F5EFE2] rounded-lg px-3 py-2">
                <Badge variant={statusColors[status] ?? 'gray'} className="text-[10px]">{label}</Badge>
                <span className="text-sm font-semibold text-[#1F1D1A]">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Operational stats */}
      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <Card className="border-[#D9CFB9]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Sessions This Month</p>
              <CalendarDays className="w-4 h-4 text-[#6E6A60]" />
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-[#1F1D1A]">{sessionsThisMonth ?? 0}</p>
          </CardContent>
        </Card>

        <Card className="border-[#D9CFB9]">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Package Distribution</p>
              <Package className="w-4 h-4 text-[#6E6A60]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { key: 'confident_parent', count: pkgConfident ?? 0 },
              { key: 'partnership', count: pkgPartnership ?? 0 },
              { key: 'ongoing', count: pkgOngoing ?? 0 },
            ].map(({ key, count }) => (
              <div key={key} className="flex items-center justify-between text-xs">
                <span className="text-[#3A372F]">{packageLabels[key]}</span>
                <span className="font-semibold text-[#1F1D1A]">{count}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#D9CFB9]">
          <CardHeader className="pb-2">
            <p className="text-xs text-muted-foreground">Admins</p>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-[#1F1D1A]">{totalAdmins ?? 0}</p>
            <p className="text-xs text-[#6E6A60] mt-1">{totalResources ?? 0} resources in library</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent activity */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Card className="border-[#D9CFB9]">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-[#1F1D1A]">Recent Discovery Calls</CardTitle>
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
                      <p className="text-xs text-muted-foreground">{call.email} · {formatRelative(call.submitted_at)}</p>
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
            <CardTitle className="text-sm font-medium text-[#1F1D1A]">Recent Sessions</CardTitle>
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
