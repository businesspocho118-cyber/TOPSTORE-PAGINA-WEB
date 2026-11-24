import { unstable_cache } from 'next/cache'
import { PRODUCTS_CACHE_REVALIDATE_SECONDS, PRODUCTS_CACHE_TAG } from '@/lib/catalog-cache'
import { createServerClient } from '@/lib/supabase/server'
import { getTotalAvailableStock } from '@/lib/utils'
import type { ProductGender, ProductRecord } from '@/types/database.types'

export type ProductFilters = {
  genero?: ProductGender
  categoria?: string
  limit?: number
  onlyInStock?: boolean
}

const EXCLUDED_OFFER_IDS = new Set([
  'pack-5-esponjas-variadas',
  'combo-cosmetiquera-2-monas-3-esponjas',
  'pack-6-esponjas-2-monas-satin',
  'pack-3-monas-satin',
  'pack-3-esponjas-variadas',
])

const EXCLUDED_OFFER_WORD_REGEX = /\b(oferta|ofertas|pack|packs|combo|combos|kit|kits|2x1|3x1)\b/

function normalizeOfferText(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function isExcludedOfferProduct(product: {
  nombre?: string | null
  categoria?: string | null
  product_id?: string | null
}): boolean {
  const categoriaNorm = normalizeOfferText(product.categoria ?? '').trim()
  if (categoriaNorm === 'oferta' || categoriaNorm === 'ofertas') return true

  const idNorm = (product.product_id ?? '').toLowerCase().trim()
  if (EXCLUDED_OFFER_IDS.has(idNorm)) return true

  const text = normalizeOfferText(`${product.categoria ?? ''} ${product.nombre ?? ''} ${product.product_id ?? ''}`)
  return EXCLUDED_OFFER_WORD_REGEX.test(text) || text.includes('+')
}

function gendersForFilter(genero?: ProductGender): ProductGender[] | null {
  if (!genero) return null
  if (genero === 'hombres' || genero === 'mujeres') return [genero, 'unisex']
  return [genero]
}

async function queryProducts(filters: ProductFilters = {}): Promise<ProductRecord[]> {
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
  if (filters.categoria) query = query.ilike('categoria', filters.categoria)

  const { data, error } = await query
  if (error) {
    console.error('[TOPSTORE] Error loading products:', error.message)
    return []
  }

  let products = ((data ?? []) as ProductRecord[]).filter((product) => !isExcludedOfferProduct(product))

  if (filters.onlyInStock) {
    products = products.filter((product) => getTotalAvailableStock(product.unidades, product.stock) > 0)
  }

  if (filters.limit) {
    products = products.slice(0, filters.limit)
  }

  return products
}

const getCachedProducts = unstable_cache(queryProducts, ['topstore-products'], {
  revalidate: PRODUCTS_CACHE_REVALIDATE_SECONDS,
  tags: [PRODUCTS_CACHE_TAG]
})

async function queryProductIds(): Promise<Array<Pick<ProductRecord, 'product_id' | 'updated_at'>>> {
  const supabase = createServerClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('productos')
    .select('product_id, updated_at, categoria, nombre')
    .eq('activo', true)

  if (error) {
    console.error('[TOPSTORE] Error loading product ids:', error.message)
    return []
  }

  return (data ?? [])
    .filter((product) => !isExcludedOfferProduct(product))
    .map(({ product_id, updated_at }) => ({ product_id, updated_at }))
}

const getCachedProductIds = unstable_cache(queryProductIds, ['topstore-product-ids'], {
  revalidate: PRODUCTS_CACHE_REVALIDATE_SECONDS,
  tags: [PRODUCTS_CACHE_TAG]
})

async function queryProductByProductId(productId: string): Promise<ProductRecord | null> {
  const supabase = createServerClient()
  if (!supabase) return null

  const decoded = decodeURIComponent(productId).trim()
  const slug = decoded.toLowerCase().replace(/\s+/g, '-')

  const { data, error } = await supabase
    .from('productos')
    .select('*')
    .eq('activo', true)
    .or(`product_id.eq."${decoded}",product_id.eq."${slug}"`)
    .maybeSingle()

  if (error) {
    console.error('[TOPSTORE] Error loading product:', error.message)
    return null
  }

  if (!data || isExcludedOfferProduct(data)) return null

  return data
}


const getCachedProductByProductId = unstable_cache(queryProductByProductId, ['topstore-product-by-id'], {
  revalidate: PRODUCTS_CACHE_REVALIDATE_SECONDS,
  tags: [PRODUCTS_CACHE_TAG]
})

export async function getProducts(filters: ProductFilters = {}): Promise<ProductRecord[]> {
  return getCachedProducts(filters)
}

export async function getProductIds(): Promise<Array<Pick<ProductRecord, 'product_id' | 'updated_at'>>> {
  return getCachedProductIds()
}

export async function getProductByProductId(productId: string): Promise<ProductRecord | null> {
  return getCachedProductByProductId(productId)
}
