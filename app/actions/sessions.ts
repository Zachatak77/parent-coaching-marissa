'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

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

  revalidatePath(`/dashboard/clients/${parsed.data.client_id}`)
  return { success: true }
}

export async function updateSessionAction(
  sessionId: string,
  clientId: string,
  data: { session_notes?: string; action_items?: string[]; shared_with_parent?: boolean }
) {
  const supabase = await createClient()
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
