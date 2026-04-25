'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { getResend, FROM, COACH_EMAIL } from '@/lib/email/resend'
import { render } from '@react-email/render'
import { IntakeSubmittedAlert } from '@/lib/email/templates/intake-submitted-alert'

export async function updateProfileAction(fullName: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/portal/profile')
  return { success: true }
}

export async function updatePasswordAction(password: string) {
  const supabase = await createClient()
  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }
  return { success: true }
}

export async function submitIntakeAction(clientId: string, responses: Record<string, unknown>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { error } = await supabase.from('intake_forms').insert({
    client_id: clientId,
    responses,
    submitted_at: new Date().toISOString(),
  })

  if (error) return { error: error.message }

  if (responses.phone) {
    await supabase.from('profiles').update({ phone: String(responses.phone) }).eq('id', user.id)
  }

  // Notify coach
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email')
      .eq('id', user.id)
      .single()

    const clientName = profile?.full_name ?? 'Your client'
    const clientEmail = profile?.email ?? ''
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://parentcoaching.vercel.app'
    const dashboardUrl = `${siteUrl}/dashboard/clients/${clientId}`

    const html = await render(IntakeSubmittedAlert({ clientName, clientEmail, dashboardUrl }))
    await getResend().emails.send({
      from: FROM,
      to: COACH_EMAIL,
      subject: `Intake form submitted — ${clientName}`,
      html,
    })
  } catch {
    // Email failure is non-fatal
  }

  revalidatePath('/portal/intake')
  return { success: true }
}

export async function getSignedResourceUrl(fileUrl: string): Promise<string> {
  if (!fileUrl) return fileUrl
  try {
    const supabase = await createClient()
    const match = fileUrl.match(/\/storage\/v1\/object\/(?:public\/)?resources\/(.+)/)
    if (!match) return fileUrl
    const path = match[1]
    const { data } = await supabase.storage.from('resources').createSignedUrl(path, 3600)
    return data?.signedUrl ?? fileUrl
  } catch {
    return fileUrl
  }
}
