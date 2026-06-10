import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogBackdrop } from '@/components/products/CatalogBackdrop'
import { CategoryProductGrid } from '@/components/products/CategoryProductGrid'
import { ProductGridSkeleton } from '@/components/products/ProductGrid'

export const metadata: Metadata = {
  title: 'Ropa deportiva para hombres',
  description: 'Camisas, buzos, joggers y ropa deportiva premium para hombres en Colombia. Envíos nacionales desde Pasto.'
}

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default function HombresPage() {
  return (
    <section className="relative overflow-hidden">
      <CatalogBackdrop tone="gold" />
      <div className="container-luxe safe-top pb-24">
        <div className="max-w-3xl rounded-[2.5rem] border border-white/70 bg-white/48 p-6 shadow-[0_24px_80px_rgba(12,10,9,0.08)] backdrop-blur-xl sm:p-8">
          <p className="eyebrow">Hombres</p>
          <h1 className="section-title mt-3">Ropa deportiva masculina</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
            Prendas premium para gimnasio, entrenamiento funcional y vida activa. Catálogo sincronizado con Supabase.
          </p>
        </div>
        <div className="mt-12">
          <Suspense fallback={<ProductGridSkeleton />}>
            <CategoryProductGrid genero="hombres" />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
