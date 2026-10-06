import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogBackdrop } from '@/components/products/CatalogBackdrop'
import { ProductCard } from '@/components/products/ProductCard'
import { ProductGridSkeleton } from '@/components/products/ProductGrid'
import { getProducts } from '@/lib/products'

export const metadata: Metadata = {
  title: 'Cosmética & Belleza',
  description: 'Colección de cosmética: esponjas de maquillaje, cosmetiqueras acolchadas y moñas de satín premium en TOPSTORE. Envíos a toda Colombia.'
}

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

const BEAUTY_KEYWORDS = [
  'esponja',
  'esponjas',
  'cosmetiquera',
  'cosmetiqueras',
  'moña',
  'mona',
  'moñas',
  'monas',
  'cosmetica',
  'belleza',
  'bolso',
  'bolsos'
]

function normalize(val: string) {
  return val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

async function CosmeticaGrid() {
  const [cosmetica, accesorios, mujeres] = await Promise.all([
    getProducts({ categoria: 'Cosmetica' }),
    getProducts({ genero: 'accesorios' }),
    getProducts({ genero: 'mujeres' })
  ])

  const all = [...cosmetica, ...accesorios, ...mujeres]
  const matched = all.filter((product) => {
    if (product.categoria?.toLowerCase() === 'cosmetica') return true
    const text = normalize(`${product.categoria ?? ''} ${product.nombre} ${product.descripcion ?? ''}`)
    return BEAUTY_KEYWORDS.some((kw) => text.includes(kw))
  })

  // Deduplicate by product_id
  const uniqueProducts = Array.from(new Map(matched.map((p) => [p.product_id, p])).values())

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {uniqueProducts.map((product) => (
        <ProductCard key={product.product_id} product={product} />
      ))}
    </div>
  )
}

export default function CosmeticaPage() {
  return (
    <section className="relative overflow-hidden">
      <CatalogBackdrop tone="gold" />
      <div className="container-luxe safe-top pb-24">
        <div className="max-w-3xl rounded-[2.5rem] border border-white/70 bg-white/48 p-6 shadow-[0_24px_80px_rgba(12,10,9,0.08)] backdrop-blur-xl sm:p-8">
          <p className="eyebrow">Nueva Colección</p>
          <h1 className="section-title mt-3">Cosmética</h1>
          <p className="mt-4 max-w-2xl text-base leading-8 text-muted">
            Esponjas de maquillaje, cosmetiqueras acolchadas y moñas de satín para elevar tu rutina diaria.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-gold/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-gold-deep">
              Cosmética TOPSTORE
            </span>
            <span className="inline-flex items-center rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-xs font-medium text-ink/75 backdrop-blur">
              💄 Esponjas: Rosado y Negro
            </span>
            <span className="inline-flex items-center rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-xs font-medium text-ink/75 backdrop-blur">
              👛 Cosmetiqueras: Rosado y Beige
            </span>
            <span className="inline-flex items-center rounded-full border border-ink/10 bg-white/70 px-3 py-1 text-xs font-medium text-ink/75 backdrop-blur">
              🎀 Moñas: Gran variedad de tonos
            </span>
          </div>
        </div>

        <div className="mt-12">
          <Suspense fallback={<ProductGridSkeleton />}>
            <CosmeticaGrid />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
