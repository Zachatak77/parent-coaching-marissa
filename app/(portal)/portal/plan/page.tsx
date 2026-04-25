import { createClient } from '@/lib/supabase/server'
import { getClientForUser } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { BookOpen } from 'lucide-react'
import { PrintButton } from '@/components/portal/print-button'

export const metadata = { title: 'My Plan — Parent Portal' }

type Objective = {
  objective: string
  actionSteps: string
  timeline: string
  successIndicators: string
}

type PlanContent = {
  body?: string
  objectives?: Objective[]
}

export default async function PlanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const client = await getClientForUser(supabase, user.id)
  if (!client) redirect('/portal')

  const { data: plan } = await supabase
    .from('coaching_plans')
    .select('id, title, content, is_published, created_at, updated_at')
    .eq('client_id', client.id)
    .maybeSingle()

  if (!plan || !plan.is_published) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-[#2D5016]">My Plan</h1>
        <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-10 shadow-sm text-center space-y-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#2D5016]/10 mx-auto">
            <BookOpen className="w-8 h-8 text-[#2D5016]/50" />
          </div>
          <h2 className="text-lg font-semibold text-[#2D5016]">Your plan is on its way.</h2>
          <p className="text-sm text-[#2D5016]/60 max-w-sm mx-auto leading-relaxed">
            Your coach is putting together a personalized plan based on your family&rsquo;s goals. It will appear here after your first session.
          </p>
          <a
            href="mailto:parentcoachwithmarissa@gmail.com"
            className="inline-flex items-center gap-1 text-sm font-medium text-[#2D5016] hover:underline"
          >
            Have questions? Reach out →
          </a>
        </div>
      </div>
    )
  }

  const content = plan.content as PlanContent
  const body = content?.body ?? ''
  const objectives = content?.objectives ?? []
  const publishedDate = plan.updated_at ?? plan.created_at

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#2D5016]">{plan.title}</h1>
          <p className="text-sm text-[#2D5016]/55 mt-1">
            Created by Marissa · Published {format(new Date(publishedDate), 'MMMM d, yyyy')}
          </p>
        </div>
        <PrintButton />
      </div>

      {/* Plan body */}
      {body && (
        <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-6 shadow-sm print:border print:shadow-none">
          <p className="text-sm text-[#2D5016]/80 leading-7 whitespace-pre-wrap">{body}</p>
        </div>
      )}

      {/* Objectives table */}
      {objectives.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#2D5016]/10 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-[#2D5016]/10">
            <h2 className="text-sm font-semibold text-[#2D5016]">Key Objectives</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#2D5016] text-white">
                  {['Objective', 'Action Steps', 'Timeline', 'Success Indicators'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {objectives.map((obj, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-[#F5F0E8]/50'}>
                    <td className="px-4 py-3 text-[#2D5016] font-medium align-top">{obj.objective}</td>
                    <td className="px-4 py-3 text-[#2D5016]/75 align-top">{obj.actionSteps}</td>
                    <td className="px-4 py-3 text-[#2D5016]/75 align-top whitespace-nowrap">{obj.timeline}</td>
                    <td className="px-4 py-3 text-[#2D5016]/75 align-top">{obj.successIndicators}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
