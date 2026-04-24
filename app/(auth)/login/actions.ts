'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Authentication failed. Please try again.' }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role === 'parent') redirect('/portal')
  else redirect('/dashboard')
}

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const full_name = formData.get('full_name') as string
  const role = (formData.get('role') as string) || 'parent'

  if (!email || !password || !full_name) return { error: 'All fields are required.' }
  if (password.length < 6) return { error: 'Password must be at least 6 characters.' }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name, role } },
  })

  if (error) return { error: error.message }
  if (!data.user) return { error: 'Sign up failed. Please try again.' }

  // Ensure profile exists with the correct role (trigger may have already run)
  await supabase.from('profiles').upsert({
    id: data.user.id,
    email,
    full_name,
    role,
  })

  if (role === 'parent') redirect('/portal')
  else redirect('/dashboard')
}
