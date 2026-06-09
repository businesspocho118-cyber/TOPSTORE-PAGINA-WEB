import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerClient } from '@/lib/supabase/server'

export const runtime = 'edge'

const querySchema = z.object({
  genero: z.enum(['hombres', 'mujeres', 'accesorios', 'unisex']).optional(),
  categoria: z.string().trim().min(1).max(80).optional(),
  limit: z.coerce.number().int().positive().max(200).optional()
})

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

function getClientIp(request: NextRequest) {
  return request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous'
}

function isAllowed(key: string) {
  const now = Date.now()
  const windowMs = 60_000
  const max = 80
  const bucket = buckets.get(key)

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }

  if (bucket.count >= max) return false
  bucket.count += 1
  return true
}

export async function GET(request: NextRequest) {
  const clientKey = getClientIp(request)
  if (!isAllowed(clientKey)) {
    return NextResponse.json({ error: 'Demasiadas solicitudes. Intenta nuevamente en un minuto.' }, { status: 429 })
  }

  const parsed = querySchema.safeParse(Object.fromEntries(request.nextUrl.searchParams))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Parámetros inválidos', issues: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = createServerClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase no está configurado.' }, { status: 503 })
  }

  let query = supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('created_at', { ascending: false })

  if (parsed.data.genero) {
    const generos = parsed.data.genero === 'hombres' || parsed.data.genero === 'mujeres'
      ? [parsed.data.genero, 'unisex']
      : [parsed.data.genero]
    query = query.in('genero', generos)
  }
  if (parsed.data.categoria) query = query.eq('categoria', parsed.data.categoria)
  if (parsed.data.limit) query = query.limit(parsed.data.limit)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: 'No se pudieron cargar los productos.' }, { status: 500 })
  }

  return NextResponse.json({ products: data ?? [] }, { status: 200 })
}
