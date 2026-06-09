'use client'

import Image from 'next/image'
import { Minus, Plus, Trash2, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { useCart } from '@/components/cart/CartProvider'
import { buildWhatsAppCheckoutUrl, calculateCartTotal, getCartItemKey } from '@/lib/cart'
import { formatCOP } from '@/lib/utils'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'

export function CartDrawer() {
  const drawerRef = useRef<HTMLElement>(null)
  const { items, isOpen, closeCart, removeItem, updateQuantity, clearCart } = useCart()
  const total = calculateCartTotal(items)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !drawerRef.current || prefersReducedMotion()) return

    const { gsap } = registerGsapPlugins()
    const ctx = gsap.context(() => {
      gsap.from('[data-cart-animate]', {
        y: 14,
        stagger: 0.045,
        duration: 0.34,
        ease: 'power3.out',
        clearProps: 'transform',
      })
    }, drawerRef)

    return () => ctx.revert()
  }, [isOpen])

  function checkout() {
    const url = buildWhatsAppCheckoutUrl(items)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <button
        type="button"
        className="fixed inset-0"
        style={{
          zIndex: 90,
          backgroundColor: 'rgba(12, 10, 9, 0.25)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        aria-label="Cerrar carrito"
        onClick={closeCart}
      />
      <aside
        ref={drawerRef}
        className="fixed right-0 top-0 flex h-dvh w-full max-w-md flex-col border-l border-gold/20 shadow-[0_30px_90px_rgba(12,10,9,0.28)] will-change-transform"
        style={{
          zIndex: 95,
          backgroundColor: '#fbfaf7',
          opacity: isOpen ? 1 : 0,
          transform: isOpen ? 'translateX(0)' : 'translateX(105%)',
          visibility: isOpen ? 'visible' : 'hidden',
        }}
        aria-label="Carrito de compras"
        aria-hidden={!isOpen}
      >
        <div data-cart-animate className="flex items-center justify-between border-b border-ink/10 p-5">
          <div>
            <p className="eyebrow">Pedido</p>
            <h2 className="font-display text-4xl uppercase tracking-wide text-ink">Carrito</h2>
          </div>
          <button type="button" onClick={closeCart} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white" aria-label="Cerrar carrito">
            <X size={18} aria-hidden />
          </button>
        </div>

        <div data-cart-animate className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-3xl text-ink">Tu carrito está vacío.</p>
              <p className="mt-3 text-sm leading-7 text-muted">Agrega productos y finaliza el pedido por WhatsApp.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => {
                const key = getCartItemKey(item)
                return (
                  <article key={key} className="grid grid-cols-[5rem_1fr] gap-4 rounded-3xl border border-ink/10 bg-white p-3 shadow-[0_14px_40px_rgba(12,10,9,0.08)]">
                    <div className="relative h-24 overflow-hidden rounded-2xl bg-surface-soft">
                      {item.image ? <Image src={item.image} alt={item.nombre} fill sizes="80px" className="object-cover" /> : <Image src="/logo.png" alt="TOPSTORE" fill sizes="80px" className="object-contain p-3" />}
                    </div>
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-ink">{item.nombre}</h3>
                          <p className="mt-1 text-xs text-muted">Color: {item.color} · Talla: {item.talla}</p>
                        </div>
                        <button type="button" onClick={() => removeItem(key)} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-surface-soft hover:text-ink" aria-label={`Eliminar ${item.nombre}`}>
                          <Trash2 size={16} aria-hidden />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-ink/10">
                          <button type="button" className="h-9 w-9" onClick={() => updateQuantity(key, item.cantidad - 1)} aria-label="Reducir cantidad"><Minus size={14} className="mx-auto" aria-hidden /></button>
                          <span className="min-w-8 text-center text-sm font-bold">{item.cantidad}</span>
                          <button type="button" className="h-9 w-9" onClick={() => updateQuantity(key, item.cantidad + 1)} aria-label="Aumentar cantidad"><Plus size={14} className="mx-auto" aria-hidden /></button>
                        </div>
                        <p className="price-text text-2xl">{item.precio}</p>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>

        <div data-cart-animate className="border-t border-ink/10 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-muted">Total</span>
            <span className="price-text text-4xl">{formatCOP(total)}</span>
          </div>
          <button type="button" className="btn-primary w-full" onClick={checkout} disabled={items.length === 0}>Finalizar por WhatsApp</button>
          {items.length > 0 && <button type="button" className="mt-3 min-h-11 w-full text-xs font-bold uppercase tracking-[0.2em] text-muted transition hover:text-ink" onClick={clearCart}>Vaciar carrito</button>}
        </div>
      </aside>
    </>
  )
}
