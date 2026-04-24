'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const ProfileSchema = z.object({
  full_name: z.string().min(1, 'Name is required'),
})

export async function updateProfileAction(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const parsed = ProfileSchema.safeParse({ full_name: formData.get('full_name') })
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: parsed.data.full_name })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function changePasswordAction(formData: FormData) {
  const supabase = await createClient()
  const password = formData.get('password') as string
  const confirm = formData.get('confirm_password') as string

  if (!password || password.length < 8) return { error: 'Password must be at least 8 characters' }
  if (password !== confirm) return { error: 'Passwords do not match' }

  const { error } = await supabase.auth.updateUser({ password })
  if (error) return { error: error.message }
  return { success: true }
}
