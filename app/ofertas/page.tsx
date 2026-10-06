import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogBackdrop } from '@/components/products/CatalogBackdrop'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductGridSkeleton } from '@/components/products/ProductGrid'
import { getProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Ofertas (Packs) | TOPSTORE',
  description: 'Aprovecha nuestras ofertas y packs especiales en cosmética, accesorios y moda en TOPSTORE. Envíos a toda Colombia.'
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

function normalize(val: string) {
  return val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

async function OfertasGrid() {
  const [ofertas, accesorios, allProducts] = await Promise.all([
    getProducts({ categoria: 'Ofertas' }),
    getProducts({ genero: 'accesorios' }),
    getProducts()
  ])

  const all = [...ofertas, ...accesorios, ...allProducts]
  const matched = all.filter((product) => {
    if (product.categoria?.toLowerCase() === 'ofertas') return true
    const text = normalize(`${product.categoria ?? ''} ${product.nombre} ${product.descripcion ?? ''} ${product.product_id ?? ''}`)
    return ['oferta', 'ofertas', 'pack', 'packs', 'combo', 'combos', 'kit', 'kits'].some((kw) => text.includes(kw))
  })

  // Deduplicate by product_id
  const uniqueProducts = Array.from(new Map(matched.map((p) => [p.product_id, p])).values())

  if (uniqueProducts.length === 0) {
    return (
      <div className="rounded-3xl border border-black/10 bg-white/70 p-12 text-center backdrop-blur-xl">
        <p className="font-display text-2xl uppercase tracking-wider text-ink">Pronto nuevas ofertas</p>
        <p className="mt-2 text-sm text-muted">Estamos preparando nuevos packs y combos exclusivos.</p>
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

export default function OfertasPage() {
  return (
    <section className="relative overflow-hidden">
      <CatalogBackdrop tone="gold" />
      <div className="container-luxe safe-top pb-24">
        <div className="max-w-3xl rounded-[2.5rem] border border-white/70 bg-white/48 p-6 shadow-[0_24px_80px_rgba(12,10,9,0.08)] backdrop-blur-xl sm:p-8">
          <p className="eyebrow">Ahorro Exclusivo</p>
          <h1 className="section-title mt-3">Ofertas (Packs)</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            Lleva más pagando menos. Packs y combos especiales de accesorios y cosmética pensados para ti.
          </p>
        </div>

        <div className="mt-12">
          <Suspense fallback={<ProductGridSkeleton />}>
            <OfertasGrid />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
