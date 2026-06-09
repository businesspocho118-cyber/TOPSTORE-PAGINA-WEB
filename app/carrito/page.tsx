import type { Metadata } from 'next'
import { CartPageContent } from '@/components/cart/CartPageContent'

export const metadata: Metadata = {
  title: 'Carrito',
  description: 'Revisa tu pedido TOPSTORE y finaliza la compra por WhatsApp.'
}

export default function CarritoPage() {
  return <CartPageContent />
}
