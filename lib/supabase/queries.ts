import { SupabaseClient } from '@supabase/supabase-js'

export type ClientRecord = {
  id: string
  profile_id: string
  coach_id: string
  package: 'confident_parent' | 'partnership' | 'ongoing' | string
  status: string
  start_date: string | null
  notes: string | null
}

export async function getClientForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<ClientRecord | null> {
  const { data } = await supabase
    .from('clients')
    .select('id, profile_id, coach_id, package, status, start_date, notes')
    .eq('profile_id', userId)
    .maybeSingle()
  return data ?? null
}
