import { ProductCard } from '@/components/products/ProductCard'
import { ProductGridReveal } from '@/components/products/ProductGridReveal'
import { getProducts, type ProductFilters } from '@/lib/products'

export async function ProductGrid({ genero, categoria, limit, onlyInStock }: ProductFilters) {
  const products = await getProducts({ genero, categoria, limit, onlyInStock })
  const gridKey = ['products', genero ?? 'all', categoria ?? 'all', limit ?? 'full']
    .join('-')
    .replace(/[^a-z0-9-]/gi, '-')
    .toLowerCase()

  if (products.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-ink/15 bg-white/60 p-10 text-center">
        <p className="font-serif text-3xl text-ink">Aún no hay productos activos para mostrar.</p>
        <p className="mt-3 text-sm leading-7 text-muted">Cuando conectes Supabase y marques productos como activos, aparecerán aquí automáticamente.</p>
      </div>
    )
  }

  return (
    <div className="products-section relative">
      <ProductGridReveal gridKey={gridKey} />
      <div data-product-grid={gridKey} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product, index) => (
          <ProductCard key={product.product_id} product={product} priority={index === 0} />
        ))}
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4" aria-label="Cargando productos">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="animate-pulse overflow-hidden rounded-[2rem] border border-ink/10 bg-white/70">
          <div className="aspect-[4/5] bg-ink/10" />
          <div className="space-y-4 p-5">
            <div className="h-4 w-3/4 rounded bg-ink/10" />
            <div className="h-8 w-1/2 rounded bg-ink/10" />
            <div className="h-10 rounded-full bg-ink/10" />
          </div>
        </div>
      ))}
    </div>
  )
}
