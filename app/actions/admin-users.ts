'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' as const, user: null }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') return { error: 'Forbidden' as const, user: null }
  return { error: null, user }
}

const CreateUserSchema = z.object({
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email required'),
  role: z.enum(['admin', 'coach', 'parent']),
  coach_id: z.string().uuid().optional().nullable(),
})

const UpdateUserSchema = z.object({
  userId: z.string().uuid(),
  full_name: z.string().min(1, 'Full name is required'),
  email: z.string().email('Valid email required'),
  role: z.enum(['admin', 'coach', 'parent']),
  coach_id: z.string().uuid().optional().nullable(),
})

export async function adminCreateUserAction(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const raw = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as string,
    coach_id: (formData.get('coach_id') as string) || null,
  }

  const parsed = CreateUserSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  let admin
  try {
    admin = createAdminClient()
  } catch (e) {
    return { error: String(e) }
  }

  const { data: newUser, error: createError } = await admin.auth.admin.createUser({
    email: parsed.data.email,
    email_confirm: true,
    user_metadata: { full_name: parsed.data.full_name, role: parsed.data.role },
  })
  if (createError) return { error: createError.message }

  await admin.from('profiles').upsert({
    id: newUser.user.id,
    full_name: parsed.data.full_name,
    email: parsed.data.email,
    role: parsed.data.role,
    coach_id: parsed.data.coach_id ?? null,
  })

  const { data: linkData } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: parsed.data.email,
  })

  revalidatePath('/admin/users')
  return {
    success: true as const,
    userId: newUser.user.id,
    magicLink: linkData?.properties?.action_link ?? null,
  }
}

export async function adminUpdateUserAction(formData: FormData) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  const raw = {
    userId: formData.get('userId') as string,
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    role: formData.get('role') as string,
    coach_id: (formData.get('coach_id') as string) || null,
  }

  const parsed = UpdateUserSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  let admin
  try {
    admin = createAdminClient()
  } catch (e) {
    return { error: String(e) }
  }

  const { error: profileError } = await admin
    .from('profiles')
    .update({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      role: parsed.data.role,
      coach_id: parsed.data.coach_id ?? null,
    })
    .eq('id', parsed.data.userId)

  if (profileError) return { error: profileError.message }

  const { error: authUpdateError } = await admin.auth.admin.updateUserById(parsed.data.userId, {
    email: parsed.data.email,
  })
  if (authUpdateError) return { error: authUpdateError.message }

  revalidatePath('/admin/users')
  return { success: true as const }
}

export async function adminGenerateMagicLinkAction(userId: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  let admin
  try {
    admin = createAdminClient()
  } catch (e) {
    return { error: String(e) }
  }

  const { data: profile } = await admin
    .from('profiles')
    .select('email')
    .eq('id', userId)
    .single()

  if (!profile?.email) return { error: 'No email on file for this user' }

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email: profile.email,
  })

  if (linkError) return { error: linkError.message }
  return { url: linkData?.properties?.action_link ?? null }
}

export async function adminDeleteUserAction(userId: string) {
  const { error: authError } = await requireAdmin()
  if (authError) return { error: authError }

  let admin
  try {
    admin = createAdminClient()
  } catch (e) {
    return { error: String(e) }
  }

  await admin.from('profiles').delete().eq('id', userId)
  const { error: deleteError } = await admin.auth.admin.deleteUser(userId)
  if (deleteError) return { error: deleteError.message }

  revalidatePath('/admin/users')
  return { success: true as const }
}
