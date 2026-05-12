import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ProfileForm, PasswordForm, NotificationPreferences, CalendarIntegration } from '@/components/dashboard/settings-forms'
import { User, Lock, Bell, Calendar } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role, google_calendar_email')
    .eq('id', user!.id)
    .single()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1F1D1A]">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and preferences.
        </p>
      </div>

      <div className="max-w-xl space-y-6">
        {/* Profile Settings */}
        <Card className="border-[#D9CFB9]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#1F1D1A]" />
              <CardTitle className="text-base font-semibold text-[#1F1D1A]">Profile</CardTitle>
            </div>
            <CardDescription>Update your display name and view account info.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
          </CardContent>
        </Card>

        {/* Password */}
        <Card className="border-[#D9CFB9]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#1F1D1A]" />
              <CardTitle className="text-base font-semibold text-[#1F1D1A]">Change Password</CardTitle>
            </div>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-[#D9CFB9]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#1F1D1A]" />
              <CardTitle className="text-base font-semibold text-[#1F1D1A]">Notifications</CardTitle>
            </div>
            <CardDescription>Configure email notification preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationPreferences />
          </CardContent>
        </Card>

        {/* Google Calendar */}
        <Card className="border-[#D9CFB9]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1F1D1A]" />
              <CardTitle className="text-base font-semibold text-[#1F1D1A]">Google Calendar</CardTitle>
            </div>
            <CardDescription>
              Auto-create leads when consults are booked directly in your Google Calendar.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarIntegration connectedEmail={profile?.google_calendar_email ?? null} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
