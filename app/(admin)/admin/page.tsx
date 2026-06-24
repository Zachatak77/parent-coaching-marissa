import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, UserCheck, PhoneCall, CalendarDays, Package, BookOpen, Pencil, Eye } from 'lucide-react'
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

  // Blog stats — gracefully degrade if DB not available
  let blogCounts = { published: 0, draft: 0, archived: 0 }
  let recentPosts: Array<{
    id: string; title: string; slug: string
    status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
    publishedAt: Date | null; createdAt: Date
    author: { fullName: string | null }
  }> = []
  try {
    const [published, draft, archived, posts] = await Promise.all([
      prisma.blogPost.count({ where: { status: 'PUBLISHED' } }),
      prisma.blogPost.count({ where: { status: 'DRAFT' } }),
      prisma.blogPost.count({ where: { status: 'ARCHIVED' } }),
      prisma.blogPost.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true, title: true, slug: true, status: true,
          publishedAt: true, createdAt: true,
          author: { select: { fullName: true } },
        },
      }),
    ])
    blogCounts = { published, draft, archived }
    recentPosts = posts as typeof recentPosts
  } catch { /* DB unavailable — show zeros */ }

  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const firstName = profile?.full_name?.split(' ')[0] ?? 'Admin'

  return (
    <div>
      <Reveal>
        <PageHeader
          eyebrow="Admin"
          title={`${greeting}, ${firstName}`}
          subtitle={now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          actions={
            <Button asChild className="bg-[#5F728D] hover:bg-[#54647C] text-white rounded-full text-sm">
              <Link href="/dashboard/discovery">Manage Leads</Link>
            </Button>
          }
        />
      </Reveal>

      {/* User counts */}
      <Reveal delay={80}>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total Parents', value: totalParents ?? 0, icon: Users },
            { label: 'Total Coaches', value: totalCoaches ?? 0, icon: UserCheck },
            { label: 'Active Clients', value: activeClients ?? 0, icon: UserCheck },
          ].map(({ label, value, icon }, i) => (
            <StatCard key={label} label={label} value={value} icon={icon} accent={ACCENTS[i % ACCENTS.length]} />
          ))}
        </div>
      </Reveal>

      {/* Discovery funnel */}
      <Reveal delay={160}>
        <LiftCard accent="var(--navy)" interactive={false} className="mb-6">
          <LiftCardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <LiftCardTitle className="flex items-center gap-2 text-lg">
                <PhoneCall className="w-4 h-4 text-[#6E6A60]" />
                Discovery Call Funnel
              </LiftCardTitle>
              <span className="text-xs text-[#6E6A60]">{conversionRate}% conversion rate</span>
            </div>
          </LiftCardHeader>
          <LiftCardContent>
            <div className="flex flex-wrap gap-3">
              {[
                { label: 'New', count: discoveryNew ?? 0, status: 'new' },
                { label: 'Contacted', count: discoveryContacted ?? 0, status: 'contacted' },
                { label: 'Booked', count: discoveryBooked ?? 0, status: 'booked' },
                { label: 'Converted', count: discoveryConverted ?? 0, status: 'converted' },
                { label: 'Closed', count: discoveryClosed ?? 0, status: 'closed' },
              ].map(({ label, count, status }) => (
                <div key={status} className="flex items-center gap-2 bg-[#F7F7F5] rounded-lg px-3 py-2">
                  <Badge variant={statusColors[status] ?? 'gray'}>{label}</Badge>
                  <span className="text-sm font-semibold text-[#1F1D1A]">{count}</span>
                </div>
              ))}
            </div>
          </LiftCardContent>
        </LiftCard>
      </Reveal>

      {/* Operational stats */}
      <Reveal delay={160}>
        <div className="grid sm:grid-cols-3 gap-4 mb-6">
          <StatCard label="Sessions This Month" value={sessionsThisMonth ?? 0} icon={CalendarDays} accent="var(--sage)" />

          <LiftCard accent="var(--peach)" interactive={false}>
            <LiftCardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">Package Distribution</p>
                <Package className="w-4 h-4 text-[#6E6A60]" />
              </div>
            </LiftCardHeader>
            <LiftCardContent className="space-y-1">
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
            </LiftCardContent>
          </LiftCard>

          <LiftCard accent="var(--straw)" interactive={false}>
            <LiftCardHeader className="pb-2">
              <p className="text-xs text-muted-foreground">Admins</p>
            </LiftCardHeader>
            <LiftCardContent>
              <p className="font-cormorant text-3xl font-semibold text-[#1F1D1A]">{totalAdmins ?? 0}</p>
              <p className="text-xs text-[#6E6A60] mt-1">{totalResources ?? 0} resources in library</p>
            </LiftCardContent>
          </LiftCard>
        </div>
      </Reveal>

      {/* Blog admin portal */}
      <Reveal delay={160}>
      <LiftCard accent="var(--navy)" interactive={false} className="mb-6">
        <LiftCardHeader className="pb-4 border-b border-[#D9CFB9]">
          <div className="flex items-center justify-between">
            <LiftCardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-4 h-4 text-[#5F728D]" />
              Blog Management
            </LiftCardTitle>
            <div className="flex gap-3">
              <Button asChild size="sm" variant="outline" className="rounded-full text-xs border-[#D9CFB9]">
                <Link href="/coach/blog/new">+ New Post</Link>
              </Button>
              <Button asChild size="sm" className="rounded-full text-xs bg-[#5F728D] hover:bg-[#54647C] text-white">
                <Link href="/admin/blog">Manage All</Link>
              </Button>
            </div>
          </div>
        </LiftCardHeader>
        <LiftCardContent className="pt-4">
          {/* Stat row */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Published', count: blogCounts.published, color: '#9BB39B' },
              { label: 'Drafts',    count: blogCounts.draft,      color: '#C8A96E' },
              { label: 'Archived', count: blogCounts.archived,   color: '#B0A898' },
            ].map(({ label, count, color }) => (
              <div key={label} className="text-center py-3 rounded-xl bg-[#F7F7F5] border border-[#D9CFB9]">
                <div className="text-2xl font-bold text-[#1F1D1A]">{count}</div>
                <div className="text-xs mt-0.5" style={{ color, fontFamily: 'Inter', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {label}
                </div>
              </div>
            ))}
          </div>

          {/* Recent posts list */}
          {recentPosts.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">No posts yet.</p>
          ) : (
            <ul className="divide-y divide-[#D9CFB9]">
              {recentPosts.map((post) => (
                <li key={post.id} className="flex items-center justify-between gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-[#1F1D1A] truncate">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.author.fullName ?? '—'}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant={post.status === 'PUBLISHED' ? 'green' : post.status === 'DRAFT' ? 'yellow' : 'gray'}>
                      {post.status.charAt(0) + post.status.slice(1).toLowerCase()}
                    </Badge>
                    <Link href={`/admin/blog/${post.id}/edit`} className="rounded p-1 hover:bg-[#F2EBDA] transition-colors">
                      <Pencil className="w-3.5 h-3.5 text-[#6E6A60]" />
                    </Link>
                    {post.status === 'PUBLISHED' && (
                      <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="rounded p-1 hover:bg-[#F2EBDA] transition-colors">
                        <Eye className="w-3.5 h-3.5 text-[#6E6A60]" />
                      </a>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </LiftCardContent>
      </LiftCard>
      </Reveal>

      {/* Recent activity */}
      <div className="grid sm:grid-cols-2 gap-6">
        <Reveal delay={160}>
          <LiftCard accent="var(--sage)" interactive={false}>
            <LiftCardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <LiftCardTitle className="text-lg">Recent Discovery Calls</LiftCardTitle>
                <Link href="/dashboard/discovery" className="text-xs text-[#6E6A60] hover:text-[#1F1D1A]">Manage all</Link>
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
                        <p className="text-xs text-muted-foreground">{call.email} · {formatRelative(call.submitted_at)}</p>
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

        <Reveal delay={240}>
          <LiftCard accent="var(--peach)" interactive={false}>
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
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.session_date).toLocaleDateString()}
                          </p>
                        </div>
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
