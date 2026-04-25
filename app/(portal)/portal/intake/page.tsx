import { createClient } from '@/lib/supabase/server'
import { getClientForUser } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { IntakeForm } from '@/components/portal/intake-form'

export const metadata = { title: 'Intake Form — Parent Portal' }

export default async function IntakePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const client = await getClientForUser(supabase, user.id)
  if (!client) redirect('/portal')

  const { data: profile } = await supabase
    .from('profiles').select('full_name').eq('id', user.id).single()

  const firstName = profile?.full_name?.split(' ')[0] ?? 'there'
  const fullName = profile?.full_name ?? ''

  const { data: intake } = await supabase
    .from('intake_forms')
    .select('id, responses, submitted_at')
    .eq('client_id', client.id)
    .maybeSingle()

  if (intake) {
    const responses = intake.responses as Record<string, unknown>
    const children = responses.children as Array<{ name: string; age: string }> | undefined

    const qaFields = [
      { q: 'Parent name(s)', k: 'parent_name' },
      { q: 'Family structure', k: 'family_structure' },
      { q: 'Main challenge', k: 'main_challenge' },
      { q: 'How long has this been a concern?', k: 'how_long' },
      { q: 'Strategies tried', k: 'strategies_tried' },
      { q: 'What success looks like', k: 'success_looks_like' },
      { q: 'Child temperament', k: 'child_temperament' },
      { q: 'Diagnoses or evaluations', k: 'diagnoses' },
      { q: 'What the child responds well to', k: 'responds_well' },
      { q: 'What escalates situations', k: 'escalates' },
      { q: 'Current parenting approach', k: 'parenting_approach' },
      { q: 'Biggest strengths as a parent', k: 'strengths' },
      { q: 'Where support is needed most', k: 'needs_support' },
      { q: 'Preferred contact method', k: 'contact_method' },
      { q: 'Best time to reach you', k: 'best_time' },
      { q: 'Anything else', k: 'anything_else' },
    ]

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#2D5016]">Your Intake Form</h1>
          <p className="text-sm text-[#2D5016]/55 mt-1">
            Submitted on {format(new Date(intake.submitted_at), 'MMMM d, yyyy')}
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-6 shadow-sm space-y-5">
          {children && children.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-semibold text-[#2D5016]/50 uppercase tracking-wide">Children</p>
              <ul className="text-sm text-[#2D5016]/80 space-y-0.5">
                {children.map((c, i) => (
                  <li key={i}>{c.name}, age {c.age}</li>
                ))}
              </ul>
            </div>
          )}
          {qaFields.map(({ q, k }) => {
            const val = responses[k]
            if (!val || (typeof val === 'string' && !val.trim())) return null
            return (
              <div key={k} className="space-y-1">
                <p className="text-xs font-semibold text-[#2D5016]/50 uppercase tracking-wide">{q}</p>
                <p className="text-sm text-[#2D5016]/80 leading-relaxed whitespace-pre-wrap">{String(val)}</p>
              </div>
            )
          })}
        </div>

        <p className="text-xs text-[#2D5016]/45 text-center">
          Need to update something?{' '}
          <a href="mailto:parentcoachwithmarissa@gmail.com" className="text-[#2D5016] hover:underline">
            Email your coach
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#2D5016]">Tell us about your family.</h1>
        <p className="text-sm text-[#2D5016]/60 mt-1 max-w-lg">
          This helps your coach understand your situation before your first session. It only takes a few minutes.
        </p>
      </div>
      <IntakeForm clientId={client.id} firstName={firstName} defaultName={fullName} />
    </div>
  )
}
