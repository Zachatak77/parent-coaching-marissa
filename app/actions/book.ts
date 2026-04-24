'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const BookSchema = z.object({
  name: z.string().min(1, 'Full name is required'),
  email: z.string().email('A valid email is required'),
  phone: z.string().optional(),
  child_ages: z.string().min(1, "Child ages are required"),
  main_concern: z.string().min(10, 'Please share a bit more about what you\'re facing'),
  how_they_heard: z.string().optional(),
})

export async function submitDiscoveryCall(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    phone: (formData.get('phone') as string) || undefined,
    child_ages: formData.get('child_ages') as string,
    main_concern: formData.get('main_concern') as string,
    how_they_heard: (formData.get('how_they_heard') as string) || undefined,
  }

  const parsed = BookSchema.safeParse(raw)
  if (!parsed.success) return { error: parsed.error.errors[0].message }

  // Use server client — anon key, no session required
  // RLS allows public insert on discovery_calls
  const supabase = await createClient()
  const { error } = await supabase.from('discovery_calls').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    child_ages: parsed.data.child_ages,
    main_concern: parsed.data.main_concern,
    how_they_heard: parsed.data.how_they_heard ?? null,
    status: 'new',
  })

  if (error) return { error: error.message }
  return { success: true, name: parsed.data.name }
}
