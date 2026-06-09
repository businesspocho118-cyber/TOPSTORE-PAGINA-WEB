'use client'

import { useEffect } from 'react'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'

export function ProductGridReveal({ gridKey }: { gridKey: string }) {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>(`[data-product-grid="${gridKey}"]`)
    if (!root) return

    const { gsap } = registerGsapPlugins()
    const cards = gsap.utils.toArray<HTMLElement>('.product-card', root)
    if (cards.length === 0) return

    gsap.set(cards, { autoAlpha: 1 })
    if (prefersReducedMotion()) return

    const ctx = gsap.context(() => {
      gsap.from(cards, {
        scrollTrigger: {
          trigger: root,
          start: 'top 86%',
          once: true,
        },
        y: 34,
        scale: 0.98,
        rotateX: 4,
        transformOrigin: 'center bottom',
        stagger: { each: 0.06, from: 'start' },
        duration: 0.65,
        ease: 'power3.out',
        immediateRender: false,
        clearProps: 'transform',
      })
    }, root)

    return () => ctx.revert()
  }, [gridKey])

  return null
}
