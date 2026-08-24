'use client'

import Image from 'next/image'
import { MessageCircle, Sparkles } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { buildWhatsAppConversationUrl } from '@/lib/whatsapp'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'
import styles from './gift-cards.module.css'

const giftCards = [
  {
    id: '100000',
    label: 'Tarjeta regalo',
    amount: '$100.000 COP',
    description: 'Un detalle especial para elegir prendas favoritas TOPSTORE.',
    image: '/gift-cards/gift-card-100000.png',
    message: 'Hola, quiero una tarjeta de regalo TOPSTORE por $100.000 COP.'
  },
  {
    id: '150000',
    label: 'Tarjeta regalo',
    amount: '$150.000 COP',
    description: 'Más libertad para regalar un look que realmente le guste.',
    image: '/gift-cards/gift-card-150000.png',
    message: 'Hola, quiero una tarjeta de regalo TOPSTORE por $150.000 COP.'
  },
  {
    id: 'custom',
    label: 'Monto personalizado',
    amount: 'Elegí el valor',
    description: 'Acordamos por WhatsApp el monto perfecto para tu regalo.',
    image: '/gift-cards/gift-card-custom.png',
    message: 'Hola, quiero una tarjeta de regalo TOPSTORE con un monto personalizado.'
  }
]

export function GiftCardsSection() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return

    const { gsap } = registerGsapPlugins()
    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 75%',
          once: true
        },
        defaults: { ease: 'power3.out' }
      })

      timeline
        .from('[data-gift-kicker]', { autoAlpha: 0, y: 18, duration: 0.42 })
        .from('[data-gift-title]', { autoAlpha: 0, y: 32, duration: 0.68 }, '-=0.16')
        .from('[data-gift-copy]', { autoAlpha: 0, y: 20, duration: 0.48 }, '-=0.36')
        .from('[data-gift-card]', { autoAlpha: 0, y: 36, scale: 0.975, duration: 0.62, stagger: 0.09 }, '-=0.2')
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="tarjetas-regalo" ref={rootRef} tabIndex={-1} className={styles.section} aria-labelledby="gift-cards-title">
      <div className={styles.glow} aria-hidden />
      <div className="container-luxe relative z-10">
        <div className={styles.intro}>
          <p data-gift-kicker className={styles.kicker}>
            <Sparkles size={15} aria-hidden />
            Nuevo en TOPSTORE
          </p>
          <h2 id="gift-cards-title" data-gift-title className={styles.title}>Regalá libertad para elegir</h2>
          <p data-gift-copy className={styles.copy}>
            Elegí una tarjeta de regalo y coordiná por WhatsApp. Todas son sin vencimiento.
          </p>
        </div>

        <div className={styles.grid}>
          {giftCards.map((giftCard) => (
            <article key={giftCard.id} data-gift-card className={styles.card}>
              <div className={styles.artwork}>
                <Image
                  src={giftCard.image}
                  alt={`${giftCard.label} TOPSTORE: ${giftCard.amount}`}
                  width={1536}
                  height={1024}
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 48vw, 100vw"
                  className={styles.image}
                />
              </div>
              <div className={styles.cardBody}>
                <p className={styles.cardLabel}>{giftCard.label}</p>
                <h3 className={styles.cardAmount}>{giftCard.amount}</h3>
                <p className={styles.cardDescription}>{giftCard.description}</p>
                <a
                  href={buildWhatsAppConversationUrl(giftCard.message)}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.cardCta}
                >
                  <MessageCircle size={17} aria-hidden />
                  Elegir esta tarjeta
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}