import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import FloatingPathsTopstore from '@/components/FloatingPathsTopstore'
import { buildWhatsAppConversationUrl } from '@/lib/whatsapp'

export const metadata: Metadata = {
  title: 'Nosotros',
  description: 'Conoce la historia de TOPSTORE, tienda colombiana de ropa deportiva premium con envíos nacionales.'
}

const advisorUrl = buildWhatsAppConversationUrl(
  'Hola TOPSTORE, quiero hablar con un asesor para resolver una duda sobre las prendas, tallas o disponibilidad.'
)

export default function NosotrosPage() {
  return (
    <FloatingPathsTopstore>
      <section className="container-luxe safe-top pb-24">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="glass-panel rounded-[2rem] p-10">
            <Image
              src="/logo-negro.jpeg"
              alt="Logo TOPSTORE"
              width={560}
              height={560}
              className="mx-auto h-auto w-full max-w-sm object-contain"
              priority
            />
          </div>
          <div>
            <p className="eyebrow" style={{ color: 'var(--color-champagne)' }}>Desde Pasto para Colombia</p>
            <h1 className="section-title mt-3" style={{ color: 'white' }}>Rendimiento con identidad</h1>
            <div className="mt-8 space-y-6 text-base leading-8 sm:text-lg" style={{ color: 'rgba(255,255,255,0.76)' }}>
              <p>
                TOPSTORE nació con una misión clara: llevar ropa deportiva de calidad premium a cada rincón de Colombia.
                Somos una tienda 100% online, sin barreras geográficas, con envíos a todo el país.
              </p>
              <p>
                Creemos que el rendimiento empieza con lo que usas. Por eso cada prenda que seleccionamos pasa por nuestros
                propios estándares de calidad, durabilidad y estilo.
              </p>
              <p>
                Nuestros clientes nos respaldan — sus reseñas son nuestra mayor vitrina. Únete a la comunidad TOPSTORE y
                entrena con lo mejor.
              </p>
            </div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/#productos" className="btn-primary">Ver colección</Link>
              <Link href={advisorUrl} className="btn-secondary gap-2" target="_blank" rel="noreferrer">
                <MessageCircle size={18} aria-hidden />
                Hablar con un asesor
              </Link>
              <Link href="https://www.instagram.com/topstore_18/" className="btn-secondary" target="_blank" rel="noreferrer">
                Instagram
              </Link>
            </div>
          </div>
        </div>
      </section>
    </FloatingPathsTopstore>
  )
}
