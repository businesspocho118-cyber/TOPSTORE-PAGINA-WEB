import type { Metadata } from 'next'
import { Suspense } from 'react'
import { CatalogBackdrop } from '@/components/products/CatalogBackdrop'
import { ProductGrid, ProductGridSkeleton } from '@/components/products/ProductGrid'

export const metadata: Metadata = {
  title: 'Accesorios deportivos',
  description: 'Accesorios deportivos premium TOPSTORE para complementar tu entrenamiento. Envíos a toda Colombia.'
}

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default function AccesoriosPage() {
  return (
    <section className="relative overflow-hidden">
      <CatalogBackdrop tone="blue" />
      <div className="container-luxe safe-top pb-24">
        <div className="max-w-3xl rounded-[2.5rem] border border-white/70 bg-white/48 p-6 shadow-[0_24px_80px_rgba(12,10,9,0.08)] backdrop-blur-xl sm:p-8">
          <p className="eyebrow">Accesorios</p>
          <h1 className="section-title mt-3">Accesorios premium</h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted">
            Detalles funcionales para elevar tu rutina: selección activa desde Supabase y disponibilidad real.
          </p>
        </div>
        <div className="mt-12">
          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid genero="accesorios" limit={12} />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
