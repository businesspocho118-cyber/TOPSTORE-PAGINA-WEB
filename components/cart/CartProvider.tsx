'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { cartSchema, type CartItem, getCartItemKey } from '@/lib/cart'

type CartContextValue = {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  addItem: (item: CartItem) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)
const storageKey = 'topstore-cart-v1'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(storageKey)
      if (!raw) return
      const parsed = cartSchema.safeParse(JSON.parse(raw))
      if (parsed.success) setItems(parsed.data)
    } catch {
      window.localStorage.removeItem(storageKey)
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items))
  }, [items])

  const value = useMemo<CartContextValue>(() => ({
    items,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    toggleCart: () => setIsOpen((open) => !open),
    addItem: (item) => {
      const parsed = cartSchema.element.safeParse(item)
      if (!parsed.success) return
      setItems((current) => {
        const key = getCartItemKey(parsed.data)
        const existing = current.find((entry) => getCartItemKey(entry) === key)
        if (!existing) return [...current, parsed.data]
        return current.map((entry) => getCartItemKey(entry) === key
          ? { ...entry, cantidad: Math.min((entry.stock ?? 20), entry.cantidad + parsed.data.cantidad) }
          : entry)
      })
      setIsOpen(true)
    },
    removeItem: (key) => setItems((current) => current.filter((item) => getCartItemKey(item) !== key)),
    updateQuantity: (key, quantity) => setItems((current) => current.map((item) => {
      if (getCartItemKey(item) !== key) return item
      const capped = Math.min(item.stock ?? 20, Math.max(1, quantity))
      return { ...item, cantidad: capped }
    })),
    clearCart: () => setItems([]),
    count: items.reduce((count, item) => count + item.cantidad, 0)
  }), [items, isOpen])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart debe usarse dentro de CartProvider')
  return value
}
