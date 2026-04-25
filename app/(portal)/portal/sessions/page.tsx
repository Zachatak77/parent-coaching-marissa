import { createClient } from '@/lib/supabase/server'
import { getClientForUser } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import { CalendarDays } from 'lucide-react'
import { SessionCard } from '@/components/portal/session-card'

export const metadata = { title: 'Sessions — Parent Portal' }

export default async function SessionsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const client = await getClientForUser(supabase, user.id)
  if (!client) redirect('/portal')

  const { data: sessions } = await supabase
    .from('sessions')
    .select('id, session_date, session_notes, action_items')
    .eq('client_id', client.id)
    .eq('shared_with_parent', true)
    .order('session_date', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#2D5016]">Session Recaps</h1>
        <p className="text-sm text-[#2D5016]/55 mt-1">Notes and action steps from your coaching sessions.</p>
      </div>

      {!sessions || sessions.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#2D5016]/10 p-10 shadow-sm text-center space-y-3">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2D5016]/10 mx-auto">
            <CalendarDays className="w-7 h-7 text-[#2D5016]/50" />
          </div>
          <p className="text-sm text-[#2D5016]/60 max-w-sm mx-auto leading-relaxed">
            Your coach will share session recaps here after each session. They&rsquo;ll include key takeaways and your action steps for the week.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sessions.map((s, i) => (
            <div key={s.id}>
              <SessionCard
                sessionDate={s.session_date}
                sessionNotes={s.session_notes}
                actionItems={s.action_items as string[] | null}
              />
              {i < sessions.length - 1 && <div className="border-b border-[#2D5016]/8 mt-4" />}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
