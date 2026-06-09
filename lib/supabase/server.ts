import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { env, isSupabaseConfigured } from '@/lib/env'

export function createServerClient() {
  if (!isSupabaseConfigured()) return null

  const key = env.supabaseServiceRoleKey && !env.supabaseServiceRoleKey.includes('_aqui')
    ? env.supabaseServiceRoleKey
    : env.supabaseAnonKey

  return createClient<Database>(env.supabaseUrl!, key!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}
