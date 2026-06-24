import { createClient } from '@/lib/supabase/server'
import { ProfileForm, PasswordForm, NotificationPreferences, CalendarIntegration } from '@/components/dashboard/settings-forms'
import { User, Lock, Bell, Calendar } from 'lucide-react'
import { Reveal } from '@/components/public/reveal'
import { PageHeader } from '@/components/dashboard/ui/page-header'
import { LiftCard, LiftCardContent, LiftCardHeader, LiftCardTitle } from '@/components/dashboard/ui/lift-card'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role, google_calendar_email, google_refresh_token')
    .eq('id', user!.id)
    .single()

  return (
    <div>
      <Reveal>
        <PageHeader
          eyebrow="Account"
          title="Settings"
          subtitle="Manage your account and preferences."
        />
      </Reveal>

      <div className="max-w-xl space-y-6">
        {/* Profile Settings */}
        <Reveal delay={80}>
          <LiftCard accent="var(--navy)" interactive={false}>
            <LiftCardHeader>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#1F1D1A]" />
                <LiftCardTitle className="text-lg">Profile</LiftCardTitle>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Update your display name and view account info.</p>
            </LiftCardHeader>
            <LiftCardContent className="space-y-4">
              <ProfileForm initialName={profile?.full_name ?? ''} />
              <div className="pt-2 border-t space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                  <p className="text-sm font-medium">{profile?.email ?? user?.email ?? '—'}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Email cannot be changed here.</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Role</p>
                  <p className="text-sm font-medium capitalize">{profile?.role ?? '—'}</p>
                </div>
              </div>
            </LiftCardContent>
          </LiftCard>
        </Reveal>

        {/* Password */}
        <Reveal delay={160}>
          <LiftCard accent="var(--sage)" interactive={false}>
            <LiftCardHeader>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-[#1F1D1A]" />
                <LiftCardTitle className="text-lg">Change Password</LiftCardTitle>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Update your account password.</p>
            </LiftCardHeader>
            <LiftCardContent>
              <PasswordForm />
            </LiftCardContent>
          </LiftCard>
        </Reveal>

        {/* Notifications */}
        <Reveal delay={240}>
          <LiftCard accent="var(--peach)" interactive={false}>
            <LiftCardHeader>
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1F1D1A]" />
                <LiftCardTitle className="text-lg">Notifications</LiftCardTitle>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Configure email notification preferences.</p>
            </LiftCardHeader>
            <LiftCardContent>
              <NotificationPreferences />
            </LiftCardContent>
          </LiftCard>
        </Reveal>

        {/* Google Calendar */}
        <Reveal delay={320}>
          <LiftCard accent="var(--straw)" interactive={false}>
            <LiftCardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#1F1D1A]" />
                <LiftCardTitle className="text-lg">Google Calendar</LiftCardTitle>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Auto-create leads when consults are booked directly in your Google Calendar.
              </p>
            </LiftCardHeader>
            <LiftCardContent>
              <CalendarIntegration
                connectedEmail={profile?.google_calendar_email ?? null}
                isConnected={!!profile?.google_refresh_token}
              />
            </LiftCardContent>
          </LiftCard>
        </Reveal>
      </div>
    </div>
  )
}
