import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import { env, isSupabaseConfigured } from '@/lib/env'

export function createBrowserClient() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase no está configurado. Completa NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  return createClient<Database>(env.supabaseUrl!, env.supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  })
}
