import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogBackdrop } from '@/components/products/CatalogBackdrop'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductGridSkeleton } from '@/components/products/ProductGrid'
import { getProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Bolsos | TOPSTORE',
  description: 'Colección exclusiva de bolsos, morrales y maletines deportivos en TOPSTORE. Envíos a toda Colombia.'
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const BOLSOS_KEYWORDS = [
  'bolso',
  'bolsos',
  'cartera',
  'carteras',
  'mochila',
  'mochilas',
  'morral',
  'morrales',
  'tote',
  'maletin',
  'maletines',
  'rinonera',
  'riñonera',
  'crossbody'
]

function normalize(val: string) {
  return val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function isPackOrOferta(product: { nombre: string; categoria?: string | null; product_id?: string }) {
  const text = normalize(`${product.categoria ?? ''} ${product.nombre} ${product.product_id ?? ''}`)
  return ['pack', 'combo', 'kit', 'set', 'oferta', '+', '2x1', '3x1'].some((kw) => text.includes(kw))
}

async function BolsosGrid() {
  const [bolsos, accesorios, allProducts] = await Promise.all([
    getProducts({ categoria: 'Bolsos' }),
    getProducts({ genero: 'accesorios' }),
    getProducts()
  ])

  const all = [...bolsos, ...accesorios, ...allProducts]
  const matched = all.filter((product) => {
    if (isPackOrOferta(product)) return false
    if (product.categoria?.toLowerCase() === 'bolsos' || product.categoria?.toLowerCase() === 'bolso') return true
    const text = normalize(`${product.categoria ?? ''} ${product.nombre} ${product.descripcion ?? ''}`)
    return BOLSOS_KEYWORDS.some((kw) => text.includes(kw))
  })

  // Deduplicate by product_id
  const uniqueProducts = Array.from(new Map(matched.map((p) => [p.product_id, p])).values())

  if (uniqueProducts.length === 0) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white/70 p-12 text-center backdrop-blur-xl">
        <p className="font-display text-2xl uppercase tracking-wider text-ink">Próximamente nuevos modelos</p>
        <p className="mt-2 text-sm text-muted">Estamos preparando la nueva colección de bolsos exclusivos.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {uniqueProducts.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  )
}

export default function BolsosPage() {
  return (
    <section className="relative overflow-hidden">
      <CatalogBackdrop tone="gold" />
      <div className="container-luxe safe-top pb-24">
        <div className="max-w-3xl rounded-[2.5rem] border border-white/70 bg-white/48 p-6 shadow-[0_24px_80px_rgba(12,10,9,0.08)] backdrop-blur-xl sm:p-8">
          <p className="eyebrow">Nueva Colección</p>
          <h1 className="section-title mt-3">Bolsos</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            Diseños modernos, prácticos y resistentes para acompañar tu día a día y tus entrenamientos.
          </p>
        </div>

        <div className="mt-12">
          <Suspense fallback={<ProductGridSkeleton />}>
            <BolsosGrid />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
