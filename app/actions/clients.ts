'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'
import { getResend, FROM } from '@/lib/email/resend'
import { render } from '@react-email/render'
import { ClientWelcome } from '@/lib/email/templates/client-welcome'

const packageLabels: Record<string, string> = {
  confident_parent: 'Confident Parent Program',
  partnership: 'Parent Coaching Partnership',
  ongoing: 'Ongoing Support Plan',
}

const CreateClientSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email required'),
  package: z.enum(['confident_parent', 'partnership', 'ongoing']),
  start_date: z.string().optional(),
  notes: z.string().optional(),
})

export async function createClientAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const raw = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    package: formData.get('package') as string,
    start_date: formData.get('start_date') as string || undefined,
    notes: formData.get('notes') as string || undefined,
  }

  const parsed = CreateClientSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const admin = createAdminClient()

  const { data: newUser, error: authError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    email_confirm: false,
    user_metadata: { full_name: parsed.data.full_name, role: 'parent' },
  })
  if (authError) return { error: authError.message }

  // Generate password reset link for welcome email
  const { data: linkData } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email: parsed.data.email,
  })

  await supabase
    .from('profiles')
    .upsert({
      id: newUser.user.id,
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      role: 'parent',
      coach_id: user.id,
    })

  const { data: client, error: clientError } = await supabase
    .from('clients')
    .insert({
      profile_id: newUser.user.id,
      coach_id: user.id,
      package: parsed.data.package,
      status: 'active',
      start_date: parsed.data.start_date || null,
      notes: parsed.data.notes || null,
    })
    .select()
    .single()

  if (clientError) return { error: clientError.message }

  // Send welcome email with set-password link
  try {
    const setPasswordUrl = linkData?.properties?.action_link ?? `${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://parentcoaching.vercel.app'}/login`
    const html = await render(ClientWelcome({
      clientName: parsed.data.full_name,
      setPasswordUrl,
      packageLabel: packageLabels[parsed.data.package] ?? parsed.data.package,
    }))
    await getResend().emails.send({
      from: FROM,
      to: parsed.data.email,
      subject: 'Welcome to Parent Coaching with Marissa — set up your account',
      html,
    })
  } catch {
    // Email failure is non-fatal
  }

  revalidatePath('/dashboard/clients')
  return { success: true, clientId: client.id, email: parsed.data.email }
}

export async function updateClientNotesAction(clientId: string, notes: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('clients')
    .update({ notes })
    .eq('id', clientId)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

export async function updateClientStatusAction(clientId: string, status: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('clients')
    .update({ status })
    .eq('id', clientId)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/clients')
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}
