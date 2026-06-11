import { env } from '@/lib/env'

function normalizeWhatsAppNumber(phone: string) {
  const digits = phone.replace(/\D/g, '')
  return digits.startsWith('57') ? digits : `57${digits}`
}

export function buildWhatsAppConversationUrl(message: string) {
  const phone = normalizeWhatsAppNumber(env.whatsappNumber)
  return `https://wa.me/${phone}?text=${encodeURIComponent(message.trim())}`
}
