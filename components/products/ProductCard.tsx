'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { MouseEvent, useRef } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import type { ProductRecord } from '@/types/database.types'
import { getProductColorPreviewImages } from '@/lib/product-color-images'
import { cleanColorLabel, getFirstImage, getProductImages, getTotalAvailableStock, parseColors, parseSizes } from '@/lib/utils'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'

export function ProductCard({ product, priority = false }: { product: ProductRecord; priority?: boolean }) {
  const cardRef = useRef<HTMLElement>(null)
  const { addItem } = useCart()
  const localPreviewImages = getProductColorPreviewImages(product.product_id)
  const images = localPreviewImages.length > 0 ? localPreviewImages : getProductImages(product)
  const primaryImage = images[0]
  const secondaryImage = images[1]
  const colors = parseColors(product.colores)
  const sizes = parseSizes(product.tallas)
  const availableStock = getTotalAvailableStock(product.unidades, product.stock)
  const outOfStock = availableStock <= 0

  function animate(scale: number) {
    if (!cardRef.current || prefersReducedMotion()) return
    const { gsap } = registerGsapPlugins()
    gsap.to(cardRef.current, { scale, duration: 0.24, ease: 'power2.out' })
  }

  function handleAdd(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault()
    event.stopPropagation()
    if (outOfStock) return

    addItem({
      product_id: product.product_id,
      nombre: product.nombre,
      precio: product.precio,
      image: primaryImage || getFirstImage(product) || '',
      color: cleanColorLabel(colors[0]?.value || 'Única'),
      talla: sizes[0] || 'Única',
      cantidad: 1,
      stock: availableStock
    })
  }

  return (
    <article
      ref={cardRef}
      className="product-card group overflow-hidden rounded-[2rem] border border-ink/10 bg-white shadow-[0_18px_55px_rgba(12,10,9,0.08)] transition"
      onMouseEnter={() => animate(1.015)}
      onMouseLeave={() => animate(1)}
    >
      <Link href={`/producto/${product.product_id}`} className="block" aria-label={`Ver ${product.nombre}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-surface-soft">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.nombre}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-700 group-hover:scale-105"
              priority={priority}
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-paper-grain p-10">
              <Image src="/logo.png" alt="TOPSTORE" width={240} height={240} className="h-32 w-32 object-contain opacity-70" />
            </div>
          )}
          {secondaryImage && (
            <Image
              src={secondaryImage}
              alt={`${product.nombre} vista alternativa`}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover opacity-0 transition duration-700 group-hover:opacity-100"
            />
          )}
          {outOfStock && (
            <span className="absolute left-4 top-4 rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white">Agotado</span>
          )}
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div>
          <Link href={`/producto/${product.product_id}`} className="font-sans text-sm font-bold uppercase tracking-[0.14em] text-ink transition hover:text-gold-deep">
            {product.nombre}
          </Link>
          <p className="price-text mt-2">{product.precio}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2" aria-label="Colores disponibles">
          {colors.slice(0, 5).map((color) => (
            <span key={color.label} className="h-5 w-5 rounded-full border border-ink/15" style={{ backgroundColor: color.swatch }} title={color.label} />
          ))}
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Tallas disponibles">
          {sizes.slice(0, 5).map((size) => (
            <span key={size} className="rounded-full border border-ink/10 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-[0.16em] text-muted">{size}</span>
          ))}
        </div>
        <button type="button" className="btn-secondary w-full opacity-100 lg:opacity-0 lg:group-hover:opacity-100" onClick={handleAdd} disabled={outOfStock}>
          <ShoppingBag size={16} aria-hidden />
          <span className="ml-2">{outOfStock ? 'Agotado' : 'Agregar al carrito'}</span>
        </button>
      </div>
    </article>
  )
}
