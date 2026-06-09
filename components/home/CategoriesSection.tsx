'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'
import styles from './categories-section.module.css'

const categories = [
  {
    href: '/hombres',
    title: 'Hombres',
    copy: 'Fuerza, resistencia y líneas limpias.',
    tone: 'men',
    image: '/category-images/hombres.png',
  },
  {
    href: '/mujeres',
    title: 'Mujeres',
    copy: 'Ajuste, movimiento y presencia premium.',
    tone: 'women',
    image: '/category-images/mujeres.png',
  },
  {
    href: '/accesorios',
    title: 'Accesorios',
    copy: 'Detalles funcionales para cerrar tu rutina.',
    tone: 'accessories',
    image: '/category-images/accesorios.png',
  },
]

export function CategoriesSection() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const { gsap } = registerGsapPlugins()
    if (!rootRef.current || prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.category-card')

      gsap.from('[data-categories-heading]', {
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 78%',
          once: true,
        },
        opacity: 0,
        y: 34,
        stagger: 0.1,
        duration: 0.72,
        ease: 'power3.out',
      })

      gsap.from(cards, {
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top 72%',
        },
        opacity: 0,
        y: 70,
        rotateX: 5,
        transformOrigin: 'center bottom',
        stagger: 0.12,
        duration: 0.85,
        ease: 'power3.out',
      })

      gsap.to('[data-category-image]', {
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
        yPercent: -8,
        ease: 'none',
      })

      gsap.to('[data-category-orb]', {
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
        yPercent: -22,
        rotate: 18,
        ease: 'none',
      })

      gsap.to('[data-category-ribbon]', {
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.85,
        },
        xPercent: 14,
        ease: 'none',
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="categorias" ref={rootRef} className={styles.section}>
      <div data-category-orb className={styles.orbOne} aria-hidden />
      <div data-category-orb className={styles.orbTwo} aria-hidden />
      <div data-category-ribbon className={styles.ribbon} aria-hidden />

      <div className="container-luxe relative z-10 py-24 sm:py-32">
        <div className="mb-12 max-w-3xl">
          <p data-categories-heading className="eyebrow">Categorías</p>
          <h2 data-categories-heading className="section-title mt-3">Elegí tu línea</h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              prefetch
              onClick={(event) => {
                event.preventDefault()
                window.location.assign(category.href)
              }}
              className={`category-card ${styles.card} ${styles[category.tone as keyof typeof styles]} group relative overflow-hidden rounded-[2.25rem] border border-ink/10 bg-white shadow-luxe`}
            >
              <div className={styles.innerFrame}>
                <div className={styles.imageFrame}>
                  <Image
                    data-category-image
                    src={category.image}
                    alt={`Colección ${category.title} TOPSTORE`}
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className={styles.image}
                  />
                  <div className={styles.imageOverlay} aria-hidden />
                  <div className={styles.arrowBadge} aria-hidden>
                    <ArrowUpRight size={28} />
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <h3 className="font-display text-5xl uppercase leading-none tracking-wide text-ink sm:text-6xl">{category.title}</h3>
                  <p className="mt-2 max-w-xs text-base leading-7 text-ink/68">{category.copy}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
