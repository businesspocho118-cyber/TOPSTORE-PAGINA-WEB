'use client'

import { ChevronLeft, ChevronRight, MessageCircle, Quote, ShieldCheck, Star } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'
import styles from './animated-testimonials.module.css'

export interface Testimonial {
  id: number
  content: string
  rating: number
}

export interface AnimatedTestimonialsProps {
  title?: string
  subtitle?: string
  badgeText?: string
  testimonials?: Testimonial[]
  autoRotateInterval?: number
  className?: string
}

export function AnimatedTestimonials({
  title = 'Nuestra vitrina real',
  subtitle = 'Lo que dicen nuestros clientes después de recibir sus pedidos',
  badgeText = 'Reseñas verificadas',
  testimonials = [],
  autoRotateInterval = 6000,
  className,
}: AnimatedTestimonialsProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLDivElement>(null)

  const active = testimonials[activeIndex]
  const previewItems = useMemo(() => testimonials.slice(0, 6), [testimonials])

  useEffect(() => {
    if (autoRotateInterval <= 0 || testimonials.length <= 1) return

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length)
    }, autoRotateInterval)

    return () => window.clearInterval(interval)
  }, [autoRotateInterval, testimonials.length])

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return

    const { gsap } = registerGsapPlugins()
    const ctx = gsap.context(() => {
      gsap.from('[data-review-reveal]', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 72%',
          once: true,
        },
        autoAlpha: 0,
        y: 34,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
      })

      gsap.to('[data-review-orbit]', {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9,
        },
        rotate: 16,
        yPercent: -12,
        ease: 'none',
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!quoteRef.current || prefersReducedMotion()) return

    const { gsap } = registerGsapPlugins()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        quoteRef.current,
        { autoAlpha: 0, y: 18, scale: 0.985 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.42, ease: 'power3.out' }
      )
    }, quoteRef)

    return () => ctx.revert()
  }, [activeIndex])

  if (!active) return null

  function goTo(direction: 1 | -1) {
    setActiveIndex((current) => (current + direction + testimonials.length) % testimonials.length)
  }

  return (
    <section ref={sectionRef} id="testimonials" className={`${styles.section} ${className || ''}`}>
      <div data-review-orbit className={styles.orbit} aria-hidden />
      <div className={styles.grid}>
        <div data-review-reveal className={styles.copyBlock}>
          <div className={styles.badge}>
            <ShieldCheck size={16} aria-hidden />
            {badgeText}
          </div>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>

          <div className={styles.stats} aria-label="Resumen de reseñas TOPSTORE">
            <span>
              <strong>5.0</strong>
              calificación
            </span>
            <span>
              <strong>{testimonials.length}</strong>
              mensajes reales
            </span>
          </div>
        </div>

        <div data-review-reveal className={styles.quotePanel}>
          <Quote className={styles.quoteIcon} size={42} aria-hidden />

          <div ref={quoteRef} className={styles.quoteContent}>
            <div className={styles.stars} aria-label={`${active.rating} estrellas`}>
              {Array.from({ length: active.rating }).map((_, index) => (
                <Star key={index} size={18} aria-hidden />
              ))}
            </div>
            <p>“{active.content}”</p>
          </div>

          <div className={styles.controls}>
            <button type="button" onClick={() => goTo(-1)} aria-label="Reseña anterior">
              <ChevronLeft size={18} aria-hidden />
            </button>
            <div className={styles.dots}>
              {testimonials.map((testimonial, index) => (
                <button
                  key={testimonial.id}
                  type="button"
                  className={index === activeIndex ? styles.activeDot : undefined}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Ver reseña ${index + 1}`}
                  aria-current={index === activeIndex}
                />
              ))}
            </div>
            <button type="button" onClick={() => goTo(1)} aria-label="Siguiente reseña">
              <ChevronRight size={18} aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <div data-review-reveal className={styles.previewRail} aria-label="Vista rápida de reseñas">
        {previewItems.map((testimonial, index) => (
          <button
            key={testimonial.id}
            type="button"
            className={index === activeIndex ? styles.activePreview : undefined}
            onClick={() => setActiveIndex(index)}
          >
            <MessageCircle size={15} aria-hidden />
            <span>{testimonial.content}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
