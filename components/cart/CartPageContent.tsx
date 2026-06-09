'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'
import { buildWhatsAppCheckoutUrl, calculateCartTotal, getCartItemKey } from '@/lib/cart'
import { formatCOP } from '@/lib/utils'

export function CartPageContent() {
  const { items, removeItem, updateQuantity, clearCart } = useCart()
  const total = calculateCartTotal(items)

  function checkout() {
    window.open(buildWhatsAppCheckoutUrl(items), '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="container-luxe safe-top pb-24">
      <p className="eyebrow">Pedido</p>
      <h1 className="section-title mt-3">Carrito de compras</h1>
      {items.length === 0 ? (
        <div className="mt-12 rounded-[2rem] border border-dashed border-ink/15 bg-white/70 p-10 text-center">
          <p className="font-serif text-3xl text-ink">Todavía no agregaste productos.</p>
          <Link href="/#productos" className="btn-primary mt-8">Ver colección</Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_24rem]">
          <div className="space-y-4">
            {items.map((item) => {
              const key = getCartItemKey(item)
              return (
                <article key={key} className="grid gap-5 rounded-[2rem] border border-ink/10 bg-white/76 p-4 shadow-luxe sm:grid-cols-[8rem_1fr]">
                  <div className="relative aspect-square overflow-hidden rounded-3xl bg-surface-soft">
                    {item.image ? <Image src={item.image} alt={item.nombre} fill sizes="128px" className="object-cover" /> : <Image src="/logo.png" alt="TOPSTORE" fill sizes="128px" className="object-contain p-4" />}
                  </div>
                  <div className="flex flex-col justify-between gap-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h2 className="text-base font-bold uppercase tracking-[0.14em] text-ink">{item.nombre}</h2>
                        <p className="mt-2 text-sm text-muted">Color: {item.color} · Talla: {item.talla}</p>
                      </div>
                      <button type="button" className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10" onClick={() => removeItem(key)} aria-label={`Eliminar ${item.nombre}`}>
                        <Trash2 size={17} aria-hidden />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center rounded-full border border-ink/10 bg-white">
                        <button type="button" className="h-11 w-11" onClick={() => updateQuantity(key, item.cantidad - 1)} aria-label="Reducir cantidad"><Minus size={15} className="mx-auto" aria-hidden /></button>
                        <span className="min-w-10 text-center text-sm font-bold">{item.cantidad}</span>
                        <button type="button" className="h-11 w-11" onClick={() => updateQuantity(key, item.cantidad + 1)} aria-label="Aumentar cantidad"><Plus size={15} className="mx-auto" aria-hidden /></button>
                      </div>
                      <p className="price-text">{item.precio}</p>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>
          <aside className="h-fit rounded-[2rem] border border-ink/10 bg-white/82 p-6 shadow-luxe backdrop-blur lg:sticky lg:top-28">
            <p className="eyebrow">Resumen</p>
            <div className="mt-6 flex items-center justify-between border-b border-ink/10 pb-5">
              <span className="text-sm text-muted">Total</span>
              <span className="price-text text-4xl">{formatCOP(total)}</span>
            </div>
            <button type="button" className="btn-primary mt-6 w-full" onClick={checkout}>Finalizar por WhatsApp</button>
            <button type="button" className="mt-3 min-h-11 w-full text-xs font-bold uppercase tracking-[0.2em] text-muted transition hover:text-ink" onClick={clearCart}>Vaciar carrito</button>
          </aside>
        </div>
      )}
    </section>
  )
}
