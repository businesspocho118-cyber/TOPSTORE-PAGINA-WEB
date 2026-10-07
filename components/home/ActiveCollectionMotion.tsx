'use client'

import { useEffect } from 'react'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'

export function ActiveCollectionMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-active-collection]')
    if (!root || prefersReducedMotion()) return

    const { gsap } = registerGsapPlugins()
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: 'top 72%',
          once: true,
        },
        defaults: { ease: 'power3.out' },
      })

      intro
        .from('[data-active-kicker]', { autoAlpha: 0, y: 18, duration: 0.45 })
        .from('[data-active-title]', { autoAlpha: 0, y: 34, duration: 0.7 }, '-=0.18')
        .from('[data-active-copy]', { autoAlpha: 0, y: 22, duration: 0.55 }, '-=0.35')
        .from('[data-active-chip]', { autoAlpha: 0, y: 18, stagger: 0.07, duration: 0.48 }, '-=0.22')
      const panels = gsap.utils.toArray<HTMLElement>('[data-active-panel]')
      panels.forEach((panel) => {
        gsap.from(panel, {
          scrollTrigger: {
            trigger: panel,
            start: 'top 88%',
            once: true,
          },
          autoAlpha: 0,
          y: 40,
          scale: 0.985,
          duration: 0.65,
          ease: 'power3.out',
        })
      })

      gsap.to('[data-active-orbit]', {
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.9,
        },
        yPercent: -18,
        rotate: 10,
        ease: 'none',
      })

      gsap.to('[data-active-runway]', {
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8,
        },
        xPercent: 8,
        ease: 'none',
      })
    }, root)

    return () => ctx.revert()
  }, [])

  return null
}
