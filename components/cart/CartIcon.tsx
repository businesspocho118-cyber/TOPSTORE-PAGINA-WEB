'use client'

import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart/CartProvider'

export function CartIcon() {
  const { count, toggleCart } = useCart()

  return (
    <button
      type="button"
      onClick={toggleCart}
      className="relative inline-flex h-12 items-center justify-center gap-2 rounded-full border border-gold/40 bg-ink px-4 text-white shadow-[0_14px_35px_rgba(12,10,9,0.18)] backdrop-blur transition hover:border-gold hover:bg-gold hover:text-ink"
      aria-label={`Abrir carrito con ${count} productos`}
    >
      <ShoppingBag size={20} aria-hidden />
      <span className="hidden text-xs font-bold uppercase tracking-[0.16em] min-[420px]:inline">Carrito</span>
      {count > 0 && (
        <span className="absolute -right-1 -top-1 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-bold text-white ring-2 ring-white">
          {count}
        </span>
      )}
    </button>
  )
}
