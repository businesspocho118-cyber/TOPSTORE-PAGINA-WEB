import type { MetadataRoute } from 'next'
import { getProductIds } from '@/lib/products'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://topstore.co'
  const now = new Date()
  const staticRoutes = ['', '/hombres', '/mujeres', '/accesorios', '/nosotros', '/carrito'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8
  }))

  const products = await getProductIds()
  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/producto/${product.product_id}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : now,
    changeFrequency: 'daily' as const,
    priority: 0.7
  }))

  return [...staticRoutes, ...productRoutes]
}
