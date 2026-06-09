'use client'

import Image from 'next/image'
import { ArrowDown, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { useEffect, useMemo, useRef } from 'react'
import { getProductColorImageVariant } from '@/lib/product-color-images'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'
import styles from './hero-section.module.css'

const heroLooks = [
  {
    productId: 'conjunto-con-top-halter',
    color: 'Rojo',
    label: 'Conjunto top halter',
    tag: 'Mujer / Training',
    position: styles.tileOne,
  },
  {
    productId: 'short-push-up-corte-en-v',
    color: 'Vinotinto',
    label: 'Short push up',
    tag: 'Gym / Fit',
    position: styles.tileTwo,
  },
  {
    productId: 'camisa-i-dont-care',
    color: 'Negro',
    label: 'Camiseta sin mangas',
    tag: 'Hombre / Performance',
    position: styles.tileThree,
  },
]

function getHeroImage(productId: string, color: string) {
  return getProductColorImageVariant(productId, color)?.images[0] ?? '/logo.png'
}

export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  const looks = useMemo(
    () =>
      heroLooks.map((look) => ({
        ...look,
        image: getHeroImage(look.productId, look.color),
      })),
    []
  )

  useEffect(() => {
    const { gsap, SplitText } = registerGsapPlugins()
    if (!rootRef.current || !titleRef.current || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const split = new SplitText(titleRef.current!, { type: 'words,chars' })
      const tiles = gsap.utils.toArray<HTMLElement>('[data-hero-look]')

      gsap.set(split.chars, { transformPerspective: 900 })
      gsap.set(tiles, { transformPerspective: 1200 })

      const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
      intro
        .from(split.chars, {
          opacity: 0,
          y: 76,
          rotateX: -76,
          stagger: 0.012,
          duration: 0.95,
          onComplete: () => { try { split.revert() } catch {} },
        })
        .from('[data-hero-copy]', { opacity: 0, y: 24, duration: 0.72, stagger: 0.1 }, '-=0.45')
        .from(tiles, { opacity: 0, y: 64, rotateY: 18, stagger: 0.09, duration: 0.9 }, '-=0.45')

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.8,
          },
        })
        .to(rootRef.current, { '--hero-shift': 1, ease: 'none' }, 0)
        .to(stageRef.current, { y: -22, rotateY: -4, rotateX: 2, ease: 'none' }, 0)
        .to(tiles[0], { yPercent: -7, xPercent: -4, rotateZ: -2, ease: 'none' }, 0)
        .to(tiles[1], { yPercent: 6, xPercent: 4, rotateZ: 3, ease: 'none' }, 0)
        .to(tiles[2], { yPercent: -5, xPercent: 5, rotateZ: -2, ease: 'none' }, 0)
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={rootRef} className={`${styles.hero} relative min-h-dvh overflow-hidden pt-20`}>
      <div className={styles.noise} aria-hidden />
      <div className={styles.lightField} aria-hidden />

      <div className="container-luxe relative z-10 grid min-h-[calc(100dvh-5rem)] items-center gap-10 py-10 lg:grid-cols-[0.82fr_1.18fr] lg:py-0">
        <div className={styles.copyBlock}>
          <div data-hero-copy className={styles.kicker}>
            <Sparkles size={15} aria-hidden />
            TOPSTORE / Ropa deportiva premium
          </div>

          <h1 ref={titleRef} className={styles.title}>
            Ropa deportiva premium en Colombia
          </h1>

          <p data-hero-copy className={styles.lead}>
            Prendas para gimnasio, entrenamiento funcional y vida activa. Compra online con envíos a Pasto, Bogotá,
            Medellín y toda Colombia.
          </p>

          <div data-hero-copy className={styles.actions}>
            <a href="#productos" className="btn-primary">
              Ver colección
            </a>
            <a href="#categorias" className={styles.textLink}>
              Explorar categorías
              <ArrowDown size={16} aria-hidden />
            </a>
          </div>

          <div data-hero-copy className={styles.trustRow} aria-label="Beneficios TOPSTORE">
            <span>
              <ShieldCheck size={16} aria-hidden />
              Calidad premium
            </span>
            <span>
              <Truck size={16} aria-hidden />
              Envíos a Colombia
            </span>
          </div>
        </div>

        <div ref={stageRef} className={styles.stage} aria-label="Prendas destacadas TOPSTORE">
          <div className={styles.orbit} aria-hidden />

          {looks.map((look, index) => (
            <article key={`${look.productId}-${look.color}`} data-hero-look className={`${styles.lookTile} ${look.position}`}>
              <div className={styles.tileImage}>
                <Image
                  src={look.image}
                  alt={`${look.label} color ${look.color}`}
                  fill
                  priority={index === 0}
                  sizes="(min-width: 1024px) 14vw, 34vw"
                  className="object-contain object-center"
                />
              </div>
              <div className={styles.tileMeta}>
                <span>{look.tag}</span>
                <strong>{look.label}</strong>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
