'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

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
