'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

const VALID_STATUSES = ['new', 'contacted', 'booked', 'converted', 'closed'] as const
type DiscoveryStatus = typeof VALID_STATUSES[number]

export async function createDiscoveryCallAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const name = (formData.get('name') as string).trim()
  const email = (formData.get('email') as string).trim()
  if (!name || !email) return { error: 'Name and email are required.' }

  const { error } = await supabase.from('discovery_calls').insert({
    name,
    email,
    phone: (formData.get('phone') as string).trim() || null,
    child_ages: (formData.get('child_ages') as string).trim() || null,
    main_concern: (formData.get('main_concern') as string).trim() || null,
    how_they_heard: (formData.get('how_they_heard') as string).trim() || null,
    status: 'new',
    coach_id: user.id,
  })

  if (error) return { error: error.message }
  revalidatePath('/dashboard/discovery')
  return { success: true }
}

export async function updateDiscoveryStatusAction(id: string, status: DiscoveryStatus) {
  const supabase = await createClient()
  const { error } = await supabase
    .from('discovery_calls')
    .update({ status })
    .eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/dashboard/discovery')
  revalidatePath('/admin/discovery')
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
  revalidatePath('/admin/discovery')
  return { success: true }
}

export async function assignCoachAction(leadId: string, coachId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') return { error: 'Forbidden' }

  const { error } = await supabase
    .from('discovery_calls')
    .update({ coach_id: coachId })
    .eq('id', leadId)

  if (error) return { error: error.message }
  revalidatePath('/admin/discovery')
  return { success: true }
}
