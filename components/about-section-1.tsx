'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'
import { buildWhatsAppConversationUrl } from '@/lib/whatsapp'

const RaycastAnimatedBackground = dynamic(
  () => import('@/components/raycast-animated-background').then((mod) => mod.RaycastAnimatedBackground),
  { ssr: false }
)

const advisorUrl = buildWhatsAppConversationUrl(
  'Hola TOPSTORE, tengo una duda y me gustaría hablar con un asesor sobre las prendas, tallas o disponibilidad.'
)

export default function AboutSection1() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return

    const { gsap } = registerGsapPlugins()
    const ctx = gsap.context(() => {
      gsap.from('.about-reveal', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 68%',
          once: true,
        },
        y: 44,
        stagger: 0.13,
        duration: 0.85,
        ease: 'power3.out',
        clearProps: 'transform',
      })

      gsap.to('.about-raycast', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
        yPercent: -10,
        scale: 1.08,
        ease: 'none',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="asesoria" ref={sectionRef} className="relative min-h-screen scroll-mt-20 overflow-hidden bg-ink px-4 py-32 text-white">
      <div className="about-raycast absolute inset-0 opacity-35 mix-blend-screen">
        <RaycastAnimatedBackground />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(184,138,45,0.28),transparent_34%),linear-gradient(180deg,rgba(10,10,9,0.72),rgba(10,10,9,0.96))]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[62vh] max-w-3xl flex-col items-center justify-center text-center">
        <div className="about-reveal mb-6 inline-flex rounded-full border border-gold/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-champagne backdrop-blur">
          Quiénes somos
        </div>

        <h2 className="about-reveal font-display text-5xl uppercase leading-none text-champagne sm:text-6xl md:text-7xl">
          TOPSTORE nació para moverse
        </h2>

        <p className="about-reveal mt-8 text-sm leading-8 text-white/75 sm:text-lg">
          TOPSTORE nació con una misión clara: llevar ropa deportiva de calidad premium a cada rincón de Colombia.
          Somos una tienda 100% online, sin barreras geográficas, con envíos a todo el país. Creemos que el rendimiento
          empieza con lo que usas. Por eso cada prenda que seleccionamos pasa por nuestros propios estándares de calidad,
          durabilidad y estilo. Nuestros clientes nos respaldan: sus reseñas son nuestra mayor vitrina.
        </p>

        <div className="about-reveal mt-10 flex w-full max-w-xl flex-col items-stretch justify-center gap-3 sm:flex-row">
          <Link
            href={advisorUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-ink shadow-gold transition hover:-translate-y-1 hover:bg-champagne"
          >
            <MessageCircle size={19} aria-hidden />
            Hablar con un asesor
          </Link>
          <Link
            href="/nosotros"
            className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full border border-white/25 bg-white/10 px-7 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:border-gold hover:bg-white/15 hover:text-champagne"
          >
            Conocer la marca <ArrowRight size={18} aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
