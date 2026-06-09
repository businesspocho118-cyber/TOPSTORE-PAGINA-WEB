const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function looksConfigured(value: string | undefined, placeholder: string) {
  return Boolean(value && value !== placeholder && !value.includes('_aqui'))
}

export function isSupabaseConfigured() {
  return looksConfigured(supabaseUrl, 'tu_supabase_url_aqui') &&
    looksConfigured(supabaseAnonKey, 'tu_supabase_anon_key_aqui') &&
    /^https:\/\//.test(supabaseUrl || '')
}

export function isSupabaseServiceConfigured() {
  return isSupabaseConfigured() && looksConfigured(supabaseServiceRoleKey, 'tu_service_role_key_aqui')
}

export const env = {
  supabaseUrl,
  supabaseAnonKey,
  supabaseServiceRoleKey,
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '3205172484',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://topstore.co'
}
