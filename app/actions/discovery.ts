'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['new', 'contacted', 'booked', 'converted', 'closed'] as const
type DiscoveryStatus = typeof VALID_STATUSES[number]

export async function updateDiscoveryStatusAction(id: string, status: DiscoveryStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('discovery_calls')
    .update({ status })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/discovery')
  return { success: true }
}

export async function updateDiscoveryNotesAction(id: string, notes: string) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('discovery_calls')
    .update({ notes })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/discovery')
  return { success: true }
}
