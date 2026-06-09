'use client'

import Image from 'next/image'
import { ImageOff, ShoppingBag } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import type { ProductRecord } from '@/types/database.types'
import { getProductColorImageVariant, getProductColorImageVariants, hasProductColorImageVariants } from '@/lib/product-color-images'
import { cleanColorLabel, cn, getCombinationStock, getFirstImage, getImagesForColor, getProductImages, parseColors, parseSizes, type ColorOption } from '@/lib/utils'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'

const localSwatches: Record<string, string> = {
  azul: '#2563eb',
  azulmarino: '#1e3a5f',
  azuloscuro: '#1e3a8a',
  blanco: '#ffffff',
  blanconegro: '#f8fafc',
  burdeos: '#7f1d1d',
  cafe: '#7c4a2d',
  cafesuave: '#b08a65',
  celeste: '#b3ebf2',
  fucsia: '#ff00ff',
  gris: '#9ca3af',
  grisclaro: '#D3D3D3',
  grisoscuro: '#5E5E5E',
  lila: '#a78bfa',
  marron: '#7c4a2d',
  morado: '#7c3aed',
  multicolor: '#d4af37',
  negro: '#050505',
  negroazul: '#111827',
  packde3: '#e879a6',
  rojo: '#dc2626',
  rosado: '#f472b6',
  surtidos: '#d4af37',
  uva: '#8B008B',
  verdementa: '#86efac',
  verdeclaro: '#86efac',
  verde: '#16a34a',
  vinotinto: '#7f1d1d',
}

function localColorKey(value: string) {
  return cleanColorLabel(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
}

const hiddenProductColorKeys: Record<string, Set<string>> = {
  'camisa-compresora-mujer': new Set(['rojo']),
  'chaqueta-mujer': new Set(['azuloscuro']),
}

const productColorLabelOverrides: Record<string, Record<string, string>> = {
  'conjunto-con-top-halter': {
    vinotinto: 'Rojo',
  },
  medias: {
    blanconegrogris: 'Blanco, Negro, Gris',
  },
}

function localColorOption(label: string): ColorOption {
  const clean = cleanColorLabel(label)
  return {
    label: clean,
    value: clean,
    swatch: localSwatches[localColorKey(clean)] ?? '#d6d3d1',
  }
}

function mergeDatabaseAndLocalColors(productId: string, databaseColors: ColorOption[]): ColorOption[] {
  const hiddenColors = hiddenProductColorKeys[productId] ?? new Set<string>()
  const labelOverrides = productColorLabelOverrides[productId] ?? {}
  const merged = databaseColors
    .filter((color) => !hiddenColors.has(localColorKey(color.label)))
    .map((color) => ({
      ...color,
      label: labelOverrides[localColorKey(color.value)] ?? labelOverrides[localColorKey(color.label)] ?? color.label,
    }))

  for (const variant of getProductColorImageVariants(productId)) {
    if (hiddenColors.has(localColorKey(variant.colorLabel))) continue
    const isAlreadyRepresented = merged.some((color) => getProductColorImageVariant(productId, color.value)?.colorKey === variant.colorKey)
    if (!isAlreadyRepresented) {
      const colorOption = localColorOption(variant.colorLabel)
      merged.push({
        ...colorOption,
        label: labelOverrides[localColorKey(colorOption.value)] ?? colorOption.label,
      })
    }
  }

  return merged
}

function MissingColorImage({ productName, color }: { productName: string; color: string }) {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_50%_20%,rgba(184,138,45,0.16),transparent_36%),linear-gradient(135deg,rgba(255,255,255,0.96),rgba(244,240,231,0.9))] p-10 text-center">
      <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full border border-gold/25 bg-white/80 text-gold-deep shadow-luxe">
        <ImageOff size={30} aria-hidden />
      </div>
      <p className="eyebrow text-gold-deep">Falta imagen</p>
      <h2 className="mt-3 font-serif text-3xl font-semibold text-ink">{cleanColorLabel(color)}</h2>
      <p className="mt-4 max-w-sm text-sm leading-7 text-muted">
        Falta cargar la imagen de {productName} en este color para la vista previa.
      </p>
    </div>
  )
}

export function ProductDetailClient({ product }: { product: ProductRecord }) {
  const rootRef = useRef<HTMLElement>(null)
  const { addItem } = useCart()
  const originalImages = getProductImages(product)
  const databaseColors = useMemo(() => parseColors(product.colores), [product.colores])
  const colors = useMemo(() => mergeDatabaseAndLocalColors(product.product_id, databaseColors), [product.product_id, databaseColors])
  const sizes = useMemo(() => parseSizes(product.tallas), [product.tallas])
  const [selectedColor, setSelectedColor] = useState(colors[0]?.value || 'Única')
  const [selectedSize, setSelectedSize] = useState(sizes[0] || 'Única')
  const selectedColorLabel = colors.find((color) => color.value === selectedColor)?.label ?? cleanColorLabel(selectedColor)

  const hasLocalColorImages = hasProductColorImageVariants(product.product_id)
  const selectedColorVariant = useMemo(
    () => getProductColorImageVariant(product.product_id, selectedColorLabel),
    [product.product_id, selectedColorLabel]
  )
  const galleryImages = hasLocalColorImages ? selectedColorVariant?.images ?? [] : getImagesForColor(product, selectedColorLabel)
  const galleryKey = galleryImages.join('|')
  const [activeImage, setActiveImage] = useState(galleryImages[0] || '')
  const missingSelectedColorImage = hasLocalColorImages && colors.length > 0 && galleryImages.length === 0

  const combinationStock = useMemo(
    () => getCombinationStock(product.unidades, selectedColor, selectedSize, product.stock),
    [product.unidades, selectedColor, selectedSize, product.stock]
  )
  const disabled = combinationStock <= 0

  useEffect(() => {
    setActiveImage(galleryImages[0] || '')
  }, [galleryKey])

  useEffect(() => {
    if (colors.length > 0 && !colors.some((color) => color.value === selectedColor)) {
      setSelectedColor(colors[0]?.value || 'Única')
    }
  }, [colors, selectedColor])

  useEffect(() => {
    const { gsap } = registerGsapPlugins()
    if (!rootRef.current || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.from('.detail-media', { opacity: 0, y: 36, duration: 0.8, ease: 'power3.out' })
      gsap.from('.detail-copy', { opacity: 0, y: 28, duration: 0.8, delay: 0.12, stagger: 0.08, ease: 'power3.out' })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  function handleAdd() {
    if (disabled) return
    addItem({
      product_id: product.product_id,
      nombre: product.nombre,
      precio: product.precio,
      image: activeImage || getFirstImage(product) || '',
        color: selectedColorLabel,
      talla: selectedSize,
      cantidad: 1,
      stock: combinationStock
    })
  }

  return (
    <section ref={rootRef} className="container-luxe safe-top pb-24">
      <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div className="detail-media">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] border border-ink/10 bg-surface-soft shadow-luxe">
            {missingSelectedColorImage ? (
                <MissingColorImage productName={product.nombre} color={selectedColorLabel} />
            ) : activeImage ? (
                <Image src={activeImage} alt={`${product.nombre} color ${selectedColorLabel}`} fill priority sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-paper-grain p-12">
                <Image src="/logo.png" alt="TOPSTORE" width={360} height={360} className="h-48 w-48 object-contain opacity-70" />
              </div>
            )}
          </div>

          {galleryImages.length > 1 && (
            <div className="mt-5 flex gap-3 overflow-x-auto pb-2" aria-label="Galería de imágenes">
              {galleryImages.map((image) => (
                <button
                  key={image}
                  type="button"
                  className={cn('relative h-24 w-20 shrink-0 overflow-hidden rounded-2xl border bg-white', activeImage === image ? 'border-gold' : 'border-ink/10')}
                  onClick={() => setActiveImage(image)}
                  aria-label="Cambiar imagen del producto"
                >
                  <Image src={image} alt="Vista del producto" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {hasLocalColorImages && selectedColorVariant && (
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-gold-deep">
              Imagen local de preview: {selectedColorVariant.colorLabel}
            </p>
          )}
        </div>

        <div className="lg:sticky lg:top-28">
          <p className="detail-copy eyebrow">{product.categoria || product.genero}</p>
          <h1 className="detail-copy mt-4 font-display text-6xl uppercase leading-[0.9] tracking-wide text-ink sm:text-8xl">{product.nombre}</h1>
          <p className="detail-copy price-text mt-6 text-5xl">{product.precio}</p>
          {product.descripcion && <p className="detail-copy mt-6 text-base leading-8 text-muted sm:text-lg">{product.descripcion}</p>}

          <div className="detail-copy mt-10 space-y-8 rounded-[2rem] border border-ink/10 bg-white/72 p-6 shadow-luxe backdrop-blur">
            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Color</legend>
              <div className="mt-4 flex flex-wrap gap-3">
                {(colors.length ? colors : [{ label: 'Única', value: 'Única', swatch: '#d6d3d1' }]).map((color) => {
                  const variant = hasLocalColorImages ? getProductColorImageVariant(product.product_id, color.label) : null
                  const isMissing = hasLocalColorImages && !variant
                  return (
                    <button
                      key={color.value}
                      type="button"
                      className={cn(
                        'flex min-h-12 items-center gap-3 rounded-full border px-4 text-sm font-semibold transition',
                        selectedColor === color.value ? 'border-gold bg-champagne/60 text-gold-deep' : 'border-ink/10 bg-white text-ink',
                        isMissing && 'border-dashed opacity-70'
                      )}
                      onClick={() => setSelectedColor(color.value || 'Única')}
                      aria-pressed={selectedColor === color.value}
                      title={isMissing ? `Falta imagen para ${color.label}` : `Ver imagen ${color.label}`}
                    >
                      <span className="h-5 w-5 rounded-full border border-ink/15" style={{ backgroundColor: color.swatch }} />
                      {color.label}
                      {isMissing && <span className="text-[0.62rem] uppercase tracking-[0.16em] text-muted">sin foto</span>}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Talla</legend>
              <div className="mt-4 flex flex-wrap gap-3">
                {(sizes.length ? sizes : ['Única']).map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={cn('min-h-12 rounded-full border px-5 text-sm font-bold uppercase tracking-[0.18em] transition', selectedSize === size ? 'border-gold bg-champagne/70 text-gold-deep' : 'border-ink/10 bg-white text-ink')}
                    onClick={() => setSelectedSize(size)}
                    aria-pressed={selectedSize === size}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="rounded-2xl bg-surface-soft p-4 text-sm font-semibold text-ink">
              {disabled ? 'Esta combinación está agotada.' : `Quedan ${combinationStock} unidades para esta combinación.`}
            </div>

            <button type="button" className="btn-primary w-full" disabled={disabled} onClick={handleAdd}>
              <ShoppingBag size={18} aria-hidden />
              <span className="ml-2">{disabled ? 'Agotado' : 'Agregar al carrito'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
