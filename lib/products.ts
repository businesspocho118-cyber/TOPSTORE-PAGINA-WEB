import { createServerClient } from '@/lib/supabase/server'
import { getTotalAvailableStock } from '@/lib/utils'
import type { ProductGender, ProductRecord } from '@/types/database.types'

export type ProductFilters = {
  genero?: ProductGender
  categoria?: string
  limit?: number
  onlyInStock?: boolean
}

function gendersForFilter(genero?: ProductGender): ProductGender[] | null {
  if (!genero) return null
  if (genero === 'hombres' || genero === 'mujeres') return [genero, 'unisex']
  return [genero]
}

export async function getProducts(filters: ProductFilters = {}): Promise<ProductRecord[]> {
  const supabase = createServerClient()
  if (!supabase) {
    console.warn('[TOPSTORE] Supabase client is null — env not configured?')
    return []
  }

  let query = supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .order('created_at', { ascending: false })

  const generos = gendersForFilter(filters.genero)
  if (generos) query = query.in('genero', generos)
  if (filters.categoria) query = query.eq('categoria', filters.categoria)
  if (filters.limit && !filters.onlyInStock) query = query.limit(filters.limit)

  const { data, error } = await query
  if (error) {
    console.error('[TOPSTORE] Error loading products:', error.message)
    return []
  }

  let products = (data ?? []) as ProductRecord[]

  if (filters.onlyInStock) {
    products = products.filter((product) => getTotalAvailableStock(product.unidades, product.stock) > 0)
  }

  if (filters.limit) {
    products = products.slice(0, filters.limit)
  }

  return products
}

export async function getProductIds(): Promise<Array<Pick<ProductRecord, 'product_id' | 'updated_at'>>> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('productos')
    .select('product_id, updated_at')
    .eq('activo', true)

  if (error) {
    console.error('[TOPSTORE] Error loading product ids:', error.message)
    return []
  }

  return data ?? []
}

export async function getProductByProductId(productId: string): Promise<ProductRecord | null> {
  const supabase = createServerClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .eq('product_id', productId)
    .maybeSingle()

  if (error) {
    console.error('[TOPSTORE] Error loading product:', error.message)
    return null
  }

  return data
}
