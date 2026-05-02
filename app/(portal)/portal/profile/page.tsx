import { createClient } from '@/lib/supabase/server'
import { getClientForUser } from '@/lib/supabase/queries'
import { redirect } from 'next/navigation'
import { format } from 'date-fns'
import { NameForm, PasswordForm } from '@/components/portal/profile-forms'

export const metadata = { title: 'Profile — Parent Portal' }

const packageNames: Record<string, string> = {
  confident_parent: 'Confident Parent Program',
  partnership: 'Parent Coaching Partnership',
  ongoing: 'Ongoing Support Plan',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const client = await getClientForUser(supabase, user.id)
  if (!client) redirect('/portal')

  const { data: profile } = await supabase
    .from('profiles').select('full_name, email').eq('id', user.id).single()

  const packageLabel = packageNames[client.package] ?? client.package

  return (
    <div className="space-y-8 max-w-xl">
      <h1 className="text-2xl font-semibold text-[#1F1D1A]">Profile</h1>

      {/* Profile settings */}
      <section className="bg-white rounded-2xl border border-[#D9CFB9] p-6 shadow-sm space-y-6">
        <h2 className="text-sm font-semibold text-[#1F1D1A]">Profile Settings</h2>

        <NameForm defaultName={profile?.full_name ?? ''} />

        <div className="space-y-1.5 pt-2 border-t border-[#D9CFB9]">
          <p className="text-xs font-semibold text-[#6E6A60] uppercase tracking-wide mt-4">Email</p>
          <p className="text-sm text-[#3A372F]">{profile?.email ?? user.email}</p>
          <p className="text-xs text-[#6E6A60]">Contact your coach to update your email address.</p>
        </div>
      </section>

      {/* Password */}
      <section className="bg-white rounded-2xl border border-[#D9CFB9] p-6 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-[#1F1D1A]">Change Password</h2>
        <PasswordForm />
      </section>

      {/* My Program */}
      <section className="bg-white rounded-2xl border border-[#D9CFB9] p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-semibold text-[#1F1D1A]">My Program</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-[#6E6A60]">Package</span>
            <span className="font-medium text-[#1F1D1A]">{packageLabel}</span>
          </div>
          {client.start_date && (
            <div className="flex justify-between items-center">
              <span className="text-[#6E6A60]">Start Date</span>
              <span className="font-medium text-[#1F1D1A]">
                {format(new Date(client.start_date), 'MMMM d, yyyy')}
              </span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-[#6E6A60]">Coach</span>
            <span className="font-medium text-[#1F1D1A]">Marissa Schattner</span>
          </div>
        </div>
      </section>

      {/* Support */}
      <section className="bg-white rounded-2xl border border-[#D9CFB9] p-6 shadow-sm space-y-2">
        <h2 className="text-sm font-semibold text-[#1F1D1A]">Support</h2>
        <p className="text-sm text-[#6E6A60]">Have a question about your program?</p>
        <a
          href="mailto:parentcoachwithmarissa@gmail.com"
          className="text-sm font-medium text-[#1F1D1A] hover:underline"
        >
          parentcoachwithmarissa@gmail.com
        </a>
      </section>
    </div>
  )
}
