'use server'

import { createClient } from '@/lib/supabase/server'

export async function signIn(formData: FormData) {
  try {
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

    return { redirectTo: profile?.role === 'parent' ? '/portal' : '/dashboard' }
  } catch (e) {
    console.error('[signIn error]', e)
    return { error: e instanceof Error ? e.message : 'Sign in failed. Please try again.' }
  }
}

export async function signUp(formData: FormData) {
  try {
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

    // Best-effort profile upsert — RLS may block this if email confirmation is pending,
    // but a trigger on auth.users should have already created the row
    await supabase.from('profiles').upsert({
      id: data.user.id,
      email,
      full_name,
      role,
    })

    if (!data.session) {
      return { emailConfirmation: true }
    }

    return { redirectTo: role === 'parent' ? '/portal' : '/dashboard' }
  } catch (e) {
    console.error('[signUp error]', e)
    return { error: e instanceof Error ? e.message : 'Sign up failed. Please try again.' }
  }
}
