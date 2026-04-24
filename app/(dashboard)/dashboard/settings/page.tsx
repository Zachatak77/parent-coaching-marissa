import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ProfileForm, PasswordForm, NotificationPreferences } from '@/components/dashboard/settings-forms'
import { User, Lock, Bell } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email, role')
    .eq('id', user!.id)
    .single()

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#2D5016]">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account and preferences.
        </p>
      </div>

      <div className="max-w-xl space-y-6">
        {/* Profile Settings */}
        <Card className="border-[#2D5016]/15">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#2D5016]" />
              <CardTitle className="text-base font-semibold text-[#2D5016]">Profile</CardTitle>
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
        <Card className="border-[#2D5016]/15">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[#2D5016]" />
              <CardTitle className="text-base font-semibold text-[#2D5016]">Change Password</CardTitle>
            </div>
            <CardDescription>Update your account password.</CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordForm />
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-[#2D5016]/15">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#2D5016]" />
              <CardTitle className="text-base font-semibold text-[#2D5016]">Notifications</CardTitle>
            </div>
            <CardDescription>Configure email notification preferences.</CardDescription>
          </CardHeader>
          <CardContent>
            <NotificationPreferences />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
