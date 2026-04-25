const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const

if (typeof window === 'undefined') {
  for (const key of required) {
    if (!process.env[key]) {
      console.warn(`[env] Missing required environment variable: ${key}`)
    }
  }
}

export const env = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  resendApiKey: process.env.RESEND_API_KEY,
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://parentcoaching.vercel.app',
}
