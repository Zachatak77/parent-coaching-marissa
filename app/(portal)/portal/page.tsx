import { createClient } from '@/lib/supabase/server'
import { getClientForUser } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { ArrowRight, BookOpen, CalendarDays, Library, CheckCircle2 } from 'lucide-react'

export const metadata = { title: 'Dashboard — Parent Portal' }

const packageInfo: Record<string, { label: string; detail: string }> = {
  confident_parent: { label: 'Confident Parent Program', detail: '2 Week Journey' },
  partnership: { label: 'Parent Coaching Partnership', detail: '4 Week Journey' },
  ongoing: { label: 'Ongoing Support Plan', detail: '' },
}

const SAGE_LIGHT = '#9EAF98'
const PEACH      = '#F8B29A'
const STRAW      = '#F2CE84'

export default async function PortalDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const client = await getClientForUser(supabase, user.id)
  if (!client) redirect('/portal')

  const { data: profile } = await supabase
    .from('profiles').select('full_name').eq('id', user.id).single()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const pkg = packageInfo[client.package] ?? { label: client.package, detail: '' }

  const [
    { count: sessionsCount },
    { count: resourcesCount },
    { data: plan },
    { data: recentSessions },
    { data: clientResources },
  ] = await Promise.all([
    supabase.from('sessions').select('*', { count: 'exact', head: true })
      .eq('client_id', client.id).eq('shared_with_parent', true),
    supabase.from('client_resources').select('*', { count: 'exact', head: true })
      .eq('client_id', client.id),
    supabase.from('coaching_plans').select('id, title, content, is_published, created_at')
      .eq('client_id', client.id).eq('is_published', true).maybeSingle(),
    supabase.from('sessions').select('id, session_date, session_notes, action_items')
      .eq('client_id', client.id).eq('shared_with_parent', true)
      .order('session_date', { ascending: false }).limit(2),
    supabase.from('client_resources')
      .select('id, resources(id, title, description, file_url)')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false }).limit(3),
  ])

  const planPreview = plan?.content as { body?: string } | null

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="bg-white rounded-2xl border border-[#D9CFB9] p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-[#1F1D1A] mb-1">Welcome back, {firstName}.</h1>
        <p className="text-sm text-[#3A372F]">
          You&rsquo;re on the <strong>{pkg.label}</strong>
          {pkg.detail && <> &middot; {pkg.detail}</>}
        </p>
      </div>

      {/* Stats row — 2 cols on mobile, 3 on sm+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { icon: CalendarDays, label: 'Sessions Completed', value: sessionsCount ?? 0, accentBg: SAGE_LIGHT },
          { icon: Library, label: 'Resources Shared', value: resourcesCount ?? 0, accentBg: PEACH },
          {
            icon: CheckCircle2,
            label: 'Plan Status',
            value: plan ? 'Active' : 'Pending',
            green: !!plan,
            accentBg: STRAW,
          },
        ].map(({ icon: Icon, label, value, green, accentBg }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#D9CFB9] p-5 shadow-sm">
            <div className="w-9 h-9 rounded-full flex items-center justify-center mb-3" style={{ background: accentBg }}>
              <Icon className="w-4 h-4 text-[#1F1D1A]" />
            </div>
            {typeof value === 'number' && <p className="text-2xl font-bold text-[#1F1D1A]">{value}</p>}
            <p className="text-xs text-[#6E6A60] mt-0.5">{label}</p>
            {typeof green === 'boolean' && (
              <span className={`inline-flex items-center mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold ${green ? 'bg-[#9EAF98]/30 text-[#1F1D1A]' : 'bg-[#F5EFE2] text-[#6E6A60]'}`}>
                {green ? 'Active' : 'Pending'}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Plan preview */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1F1D1A] flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> My Coaching Plan
          </h2>
          {plan && (
            <Link href="/portal/plan" className="text-xs text-[#1F1D1A] font-medium hover:underline flex items-center gap-1">
              View full plan <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <div className="bg-white rounded-2xl border border-[#D9CFB9] p-5 shadow-sm">
          {plan ? (
            <>
              <p className="text-sm font-semibold text-[#1F1D1A] mb-2">{plan.title}</p>
              <p className="text-sm text-[#3A372F] leading-relaxed line-clamp-3">
                {planPreview?.body ?? 'Your plan has been shared. Click to read it.'}
              </p>
            </>
          ) : (
            <p className="text-sm text-[#6E6A60] leading-relaxed">
              Your personalized coaching plan will appear here once your coach has shared it. Check back after your first session.
            </p>
          )}
        </div>
      </section>

      {/* Recent sessions */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1F1D1A] flex items-center gap-2">
            <CalendarDays className="w-4 h-4" /> Recent Sessions
          </h2>
          {(recentSessions?.length ?? 0) > 0 && (
            <Link href="/portal/sessions" className="text-xs text-[#1F1D1A] font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        {(recentSessions?.length ?? 0) === 0 ? (
          <div className="bg-white rounded-2xl border border-[#D9CFB9] p-5 shadow-sm">
            <p className="text-sm text-[#6E6A60]">Your session recaps will appear here after your coach shares them.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSessions!.map((s) => (
              <div key={s.id} className="bg-white rounded-2xl border border-[#D9CFB9] p-5 shadow-sm">
                <p className="text-xs font-semibold text-[#6E6A60] mb-1 uppercase tracking-wide">
                  {format(new Date(s.session_date), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm text-[#3A372F] line-clamp-2">{s.session_notes ?? 'Session notes will appear here.'}</p>
                {(s.action_items as string[] | null)?.length ? (
                  <p className="text-xs text-[#6E6A60] mt-2">
                    {(s.action_items as string[]).length} action {(s.action_items as string[]).length === 1 ? 'item' : 'items'}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent resources */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-[#1F1D1A] flex items-center gap-2">
            <Library className="w-4 h-4" /> Recent Resources
          </h2>
          {(clientResources?.length ?? 0) > 0 && (
            <Link href="/portal/resources" className="text-xs text-[#1F1D1A] font-medium hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        {(clientResources?.length ?? 0) === 0 ? (
          <div className="bg-white rounded-2xl border border-[#D9CFB9] p-5 shadow-sm">
            <p className="text-sm text-[#6E6A60]">Resources and tools from your coach will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {clientResources!.map((cr) => {
              const r = cr.resources as unknown as { id: string; title: string; description: string; file_url: string } | null
              if (!r) return null
              return (
                <div key={cr.id} className="bg-white rounded-2xl border border-[#D9CFB9] p-5 shadow-sm">
                  <p className="text-sm font-semibold text-[#1F1D1A] mb-1">{r.title}</p>
                  {r.description && <p className="text-xs text-[#6E6A60] line-clamp-2">{r.description}</p>}
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
