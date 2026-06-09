import { z } from 'zod'
import { env } from '@/lib/env'
import { formatCOP, parsePriceToNumber } from '@/lib/utils'

export const cartItemSchema = z.object({
  product_id: z.string().trim().min(1),
  nombre: z.string().trim().min(1),
  precio: z.string().trim().min(1),
  image: z.string().trim().optional().or(z.literal('')),
  color: z.string().trim().min(1),
  talla: z.string().trim().min(1),
  cantidad: z.number().int().positive().max(20),
  stock: z.number().int().nonnegative().optional()
})

export const cartSchema = z.array(cartItemSchema).max(50)

export type CartItem = z.infer<typeof cartItemSchema>

export function getCartItemKey(item: Pick<CartItem, 'product_id' | 'color' | 'talla'>) {
  return `${item.product_id}::${item.color}::${item.talla}`
}

export function calculateCartTotal(items: CartItem[]) {
  return items.reduce((total, item) => total + parsePriceToNumber(item.precio) * item.cantidad, 0)
}

function normalizeWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('57')) return digits
  return `57${digits}`
}

export function buildWhatsAppCheckoutUrl(items: CartItem[]) {
  const parsed = cartSchema.safeParse(items)
  if (!parsed.success || parsed.data.length === 0) {
    throw new Error('El carrito está vacío o contiene datos inválidos.')
  }

  const lines = parsed.data.map((item) =>
    `- ${item.nombre} | Color: ${item.color} | Talla: ${item.talla} | Cant: ${item.cantidad} | ${item.precio}`
  )

  const message = [
    'Hola TOPSTORE! 👋 Quiero hacer este pedido:',
    '',
    '🛍️ PRODUCTOS:',
    ...lines,
    '',
    `💰 TOTAL: ${formatCOP(calculateCartTotal(parsed.data))}`,
    '',
    '📦 Por favor indíquenme disponibilidad y datos de envío.'
  ].join('\n')

  const phone = normalizeWhatsAppNumber(env.whatsappNumber)
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
}
