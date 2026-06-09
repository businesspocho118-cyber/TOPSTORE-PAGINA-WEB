import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/components/products/ProductDetailClient'
import { getProductByProductId, getProductIds } from '@/lib/products'
import { getFirstImage } from '@/lib/utils'

export const runtime = 'edge'
export const revalidate = 60

type ProductPageProps = {
  params: Promise<{ product_id: string }>
}

export async function generateStaticParams() {
  const products = await getProductIds()
  return products.map((product) => ({ product_id: product.product_id }))
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { product_id } = await params
  const product = await getProductByProductId(product_id)

  if (!product) {
    return {
      title: 'Producto no encontrado',
      description: 'Este producto TOPSTORE no está disponible.'
    }
  }

  const image = getFirstImage(product)

  return {
    title: product.nombre,
    description: product.descripcion || `${product.nombre} en TOPSTORE. Ropa deportiva premium con envíos a toda Colombia.`,
    openGraph: {
      title: `${product.nombre} | TOPSTORE`,
      description: product.descripcion || 'Ropa deportiva premium con envíos a toda Colombia.',
      images: image ? [{ url: image }] : [{ url: '/og-image.jpg' }]
    },
    alternates: {
      canonical: `/producto/${product.product_id}`
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { product_id } = await params
  const product = await getProductByProductId(product_id)

  if (!product) notFound()

  return <ProductDetailClient product={product} />
}
