import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ClientNotesEditor } from '@/components/dashboard/client-notes-editor'
import { CoachingPlanEditor } from '@/components/dashboard/coaching-plan-editor'
import { SessionsList } from '@/components/dashboard/log-session-form'
import { ClientResourcesTab } from '@/components/dashboard/client-resources-tab'
import { CopyIntakeLinkButton } from '@/components/dashboard/copy-intake-link'
import { ArrowLeft, Calendar, BarChart2, BookOpen } from 'lucide-react'

const statusVariants: Record<string, 'green' | 'yellow' | 'blue' | 'gray'> = {
  active: 'green',
  paused: 'yellow',
  discovery: 'blue',
  completed: 'gray',
}

const packageLabels: Record<string, string> = {
  confident_parent: 'Confident Parent Program',
  partnership: 'Parent Coaching Partnership',
  ongoing: 'Ongoing Support',
}

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: client } = await supabase
    .from('clients')
    .select(`
      id,
      status,
      package,
      start_date,
      notes,
      coach_id,
      profiles:profile_id (full_name, email, id)
    `)
    .eq('id', params.id)
    .single()

  if (!client || client.coach_id !== user?.id) notFound()

  const profileData = Array.isArray(client.profiles) ? client.profiles[0] : client.profiles
  const clientName = profileData?.full_name ?? 'Client'
  const clientEmail = profileData?.email ?? ''
  const profileId = profileData?.id

  const [
    { data: sessions },
    { data: plan },
    { data: assignments },
    { data: allResources },
    { data: intakeForm },
  ] = await Promise.all([
    supabase
      .from('sessions')
      .select('id, session_date, session_notes, action_items, shared_with_parent, created_at')
      .eq('client_id', params.id)
      .order('session_date', { ascending: false }),
    supabase
      .from('coaching_plans')
      .select('id, title, content, is_published, updated_at')
      .eq('client_id', params.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('client_resources')
      .select('id, resource_id, resources (id, title, description, file_url, tags, is_public)')
      .eq('client_id', params.id),
    supabase
      .from('resources')
      .select('id, title, description, file_url, tags, is_public')
      .order('created_at', { ascending: false }),
    supabase
      .from('intake_forms')
      .select('submitted_at')
      .eq('client_id', params.id)
      .maybeSingle(),
  ])

  const lastSession = sessions?.[0]?.session_date

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/clients" className="text-sm text-muted-foreground hover:text-[#2D5016] flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Clients
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium text-[#2D5016]">{clientName}</span>
      </div>

      {/* Client header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#2D5016]">{clientName}</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{clientEmail}</p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={statusVariants[client.status] ?? 'gray'}>{client.status}</Badge>
            <Badge variant="secondary">{packageLabels[client.package] ?? client.package}</Badge>
          </div>
        </div>

        <div className="flex gap-6 text-center">
          <div>
            <p className="text-2xl font-semibold text-[#2D5016]">{sessions?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Total sessions</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#2D5016]">
              {lastSession ? new Date(lastSession).toLocaleDateString() : '—'}
            </p>
            <p className="text-xs text-muted-foreground">Last session</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-[#2D5016]">{assignments?.length ?? 0}</p>
            <p className="text-xs text-muted-foreground">Resources</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plan">Coaching Plan</TabsTrigger>
          <TabsTrigger value="sessions">Sessions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Tab 1: Overview */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card className="border-[#2D5016]/15">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2D5016]/60" />
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Start Date</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm font-medium">
                  {client.start_date ? new Date(client.start_date).toLocaleDateString() : '—'}
                </p>
              </CardContent>
            </Card>

            <Card className="border-[#2D5016]/15">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#2D5016]/60" />
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Intake Form</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {intakeForm ? (
                  <p className="text-sm font-medium">
                    Submitted {new Date(intakeForm.submitted_at).toLocaleDateString()}
                  </p>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">Not yet submitted</p>
                    <CopyIntakeLinkButton />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-[#2D5016]/15">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-[#2D5016]/60" />
                  <CardTitle className="text-xs text-muted-foreground uppercase tracking-wide">Coaching Plan</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                {plan ? (
                  <Badge variant={plan.is_published ? 'green' : 'gray'}>
                    {plan.is_published ? 'Published' : 'Draft'}
                  </Badge>
                ) : (
                  <p className="text-sm text-muted-foreground">No plan yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          <ClientNotesEditor clientId={params.id} initialNotes={client.notes} />
        </TabsContent>

        {/* Tab 2: Coaching Plan */}
        <TabsContent value="plan">
          {plan === null && !plan ? (
            <CoachingPlanEditor clientId={params.id} plan={null} />
          ) : (
            <CoachingPlanEditor clientId={params.id} plan={plan} />
          )}
        </TabsContent>

        {/* Tab 3: Sessions */}
        <TabsContent value="sessions">
          <SessionsList
            clientId={params.id}
            sessions={(sessions ?? []).map((s) => ({
              ...s,
              action_items: Array.isArray(s.action_items) ? s.action_items as string[] : [],
            }))}
          />
        </TabsContent>

        {/* Tab 4: Resources */}
        <TabsContent value="resources">
          <ClientResourcesTab
            clientId={params.id}
            assignments={(assignments ?? []).map((a) => ({
              ...a,
              resources: Array.isArray(a.resources) ? a.resources[0] : a.resources as any,
            }))}
            allResources={allResources ?? []}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
