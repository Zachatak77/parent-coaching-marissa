'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { getResend, FROM } from '@/lib/email/resend'
import { render } from '@react-email/render'
import { SessionShared } from '@/lib/email/templates/session-shared'
import { format } from 'date-fns'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://parentcoaching.vercel.app'

const LogSessionSchema = z.object({
  client_id: z.string().uuid(),
  session_date: z.string().min(1, 'Date is required'),
  session_notes: z.string().optional(),
  action_items: z.array(z.string()).optional(),
  shared_with_parent: z.boolean().optional(),
})

export async function logSessionAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const actionItemsRaw = formData.get('action_items') as string
  const actionItems = actionItemsRaw
    ? JSON.parse(actionItemsRaw).filter((i: string) => i.trim())
    : []

  const raw = {
    client_id: formData.get('client_id') as string,
    session_date: formData.get('session_date') as string,
    session_notes: (formData.get('session_notes') as string) || undefined,
    action_items: actionItems,
    shared_with_parent: formData.get('shared_with_parent') === 'true',
  }

  const parsed = LogSessionSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const { error } = await supabase.from('sessions').insert({
    client_id: parsed.data.client_id,
    session_date: parsed.data.session_date,
    session_notes: parsed.data.session_notes || null,
    action_items: parsed.data.action_items || [],
    shared_with_parent: parsed.data.shared_with_parent ?? false,
  })

  if (error) return { error: error.message }

  if (parsed.data.shared_with_parent) {
    await sendSessionSharedEmail(supabase, parsed.data.client_id, parsed.data.session_date, parsed.data.action_items?.length ?? 0)
  }

  revalidatePath(`/dashboard/clients/${parsed.data.client_id}`)
  return { success: true }
}

export async function updateSessionAction(
  sessionId: string,
  clientId: string,
  data: { session_notes?: string; action_items?: string[]; shared_with_parent?: boolean }
) {
  const supabase = await createClient()

  // Check if we're newly sharing this session
  let sendEmail = false
  if (data.shared_with_parent === true) {
    const { data: existing } = await supabase
      .from('sessions')
      .select('shared_with_parent, session_date, action_items')
      .eq('id', sessionId)
      .single()
    sendEmail = !(existing?.shared_with_parent ?? false)
    if (sendEmail) {
      const actionItems = (data.action_items ?? existing?.action_items ?? []) as string[]
      await sendSessionSharedEmail(supabase, clientId, existing?.session_date ?? '', actionItems.length)
    }
  }

  const { error } = await supabase
    .from('sessions')
    .update(data)
    .eq('id', sessionId)
  if (error) return { error: error.message }

  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

export async function deleteSessionAction(sessionId: string, clientId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('sessions').delete().eq('id', sessionId)
  if (error) return { error: error.message }
  revalidatePath(`/dashboard/clients/${clientId}`)
  return { success: true }
}

async function sendSessionSharedEmail(
  supabase: ReturnType<typeof createClient> extends Promise<infer T> ? T : never,
  clientId: string,
  sessionDate: string,
  actionItemCount: number
) {
  try {
    const { data: client } = await supabase
      .from('clients')
      .select('profiles(full_name, email)')
      .eq('id', clientId)
      .single()

    const profile = client?.profiles as unknown as { full_name: string | null; email: string | null } | null
    if (!profile?.email) return

    const formattedDate = sessionDate
      ? format(new Date(sessionDate), 'MMMM d, yyyy')
      : 'your last session'

    const html = await render(SessionShared({
      clientName: profile.full_name ?? 'there',
      sessionDate: formattedDate,
      actionItemCount,
      portalUrl: `${SITE_URL}/portal/sessions`,
    }))
    await getResend().emails.send({
      from: FROM,
      to: profile.email,
      subject: `Your session recap is ready — ${formattedDate}`,
      html,
    })
  } catch {
    // Non-fatal
  }
}
