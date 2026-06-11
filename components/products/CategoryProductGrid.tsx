import { Shirt } from 'lucide-react'
import { ProductCard } from '@/components/products/ProductCard'
import { getProducts } from '@/lib/products'
import type { ProductGender } from '@/types/database.types'

const categories = [
  { label: 'Audífonos', keywords: ['audifono', 'audifonos'], color: 'text-sky-600', bar: 'bg-sky-500' },
  { label: 'Tarros', keywords: ['tarro'], color: 'text-amber-600', bar: 'bg-amber-500' },
  { label: 'Camisas', keywords: ['camisa', 'camiseta', 'sin manga', 'tirante', 'workout', 'alpha', 'manga'], color: 'text-blue-600', bar: 'bg-blue-500' },
  { label: 'Conjuntos', keywords: ['conjunto'], color: 'text-violet-600', bar: 'bg-violet-500' },
  { label: 'Shorts', keywords: ['short', 'pantaloneta'], color: 'text-emerald-600', bar: 'bg-emerald-500' },
  { label: 'Enterizos', keywords: ['enterizo'], color: 'text-pink-600', bar: 'bg-pink-500' },
  { label: 'Leggins', keywords: ['leggin', 'legging'], color: 'text-orange-600', bar: 'bg-orange-500' },
  { label: 'Sudaderas', keywords: ['sudadera'], color: 'text-teal-600', bar: 'bg-teal-500' },
  { label: 'Buzos', keywords: ['buzo'], color: 'text-cyan-600', bar: 'bg-cyan-500' },
  { label: 'Chaquetas', keywords: ['chaqueta'], color: 'text-yellow-600', bar: 'bg-yellow-500' },
  { label: 'Tops', keywords: ['top'], color: 'text-rose-600', bar: 'bg-rose-500' },
  { label: 'Medias', keywords: ['media', 'medias'], color: 'text-indigo-600', bar: 'bg-indigo-500' },
]

const SIN_MANGA_KW = ['sin manga', 'tirante', 'i dont care', 'workout', 'alpha']

function normalize(val: string) {
  return val.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function inferCategory(product: { nombre: string; categoria?: string | null }) {
  const name = normalize(`${product.categoria ?? ''} ${product.nombre}`)
  for (const cat of categories) {
    if (cat.keywords.some((kw) => name.includes(kw))) return cat
  }
  return null
}

function isSinManga(product: { nombre: string }) {
  const name = normalize(product.nombre)
  return SIN_MANGA_KW.some((kw) => name.includes(kw))
}

export async function CategoryProductGrid({ genero }: { genero: ProductGender }) {
  const allProducts = await getProducts({ genero })
  if (allProducts.length === 0) return null

  const groups: { cat: (typeof categories)[number]; products: typeof allProducts }[] = []
  const uncategorized: typeof allProducts = []

  for (const p of allProducts) {
    const cat = inferCategory(p)
    if (cat) {
      let group = groups.find((g) => g.cat.label === cat.label)
      if (!group) { group = { cat, products: [] }; groups.push(group) }
      group.products.push(p)
    } else {
      uncategorized.push(p)
    }
  }
  if (uncategorized.length > 0) {
    groups.push({
      cat: { label: 'Otras prendas', keywords: [], color: 'text-ink/60', bar: 'bg-ink/20' },
      products: uncategorized,
    })
  }

  return (
    <div className="space-y-16">
      {groups.map(({ cat, products }) => {
        // Split Camisas into con/sin mangas for hombres
        if (cat.label === 'Camisas' && genero === 'hombres') {
          const sinManga = products.filter(isSinManga)
          const conManga = products.filter((p) => !isSinManga(p))
          return (
            <div key={cat.label}>
              <div className="mb-6 flex items-center gap-4">
                <div className={`h-1 w-10 rounded-full ${cat.bar}`} aria-hidden />
                <h2 className="font-display text-3xl uppercase tracking-[0.14em] text-ink sm:text-4xl">Camisas</h2>
                <span className={`text-sm font-bold uppercase tracking-[0.16em] ${cat.color}`}>{products.length} prendas</span>
              </div>
              <div className="space-y-12">
                {conManga.length > 0 && (
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
                      <span className="h-1 w-4 rounded-full bg-blue-300" /> Con mangas
                      <span className="text-blue-400">· {conManga.length}</span>
                    </h3>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {conManga.map((product) => (
                        <ProductCard key={product.product_id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
                {sinManga.length > 0 && (
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ink/50">
                      <span className="h-1 w-4 rounded-full bg-blue-300" /> Sin mangas
                      <span className="text-blue-400">· {sinManga.length}</span>
                    </h3>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {sinManga.map((product) => (
                        <ProductCard key={product.product_id} product={product} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        }

        // Normal category rendering
        const itemLabel = genero === 'accesorios'
          ? products.length === 1 ? 'producto' : 'productos'
          : products.length === 1 ? 'prenda' : 'prendas'

        return (
          <div key={cat.label}>
            <div className="mb-6 flex items-center gap-4">
              <div className={`h-1 w-10 rounded-full ${cat.bar}`} aria-hidden />
              <h2 className="font-display text-3xl uppercase tracking-[0.14em] text-ink sm:text-4xl">{cat.label}</h2>
              <span className={`text-sm font-bold uppercase tracking-[0.16em] ${cat.color}`}>
                {products.length} {itemLabel}
              </span>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.product_id} product={product} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
