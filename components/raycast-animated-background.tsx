'use client'

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'

const beams = [
  { top: '9%', left: '-8%', width: '46rem', rotate: -16, delay: 0 },
  { top: '25%', left: '48%', width: '32rem', rotate: 18, delay: 0.4 },
  { top: '58%', left: '-12%', width: '42rem', rotate: 14, delay: 0.8 },
  { top: '72%', left: '56%', width: '36rem', rotate: -18, delay: 1.2 },
]

export function RaycastAnimatedBackground({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!rootRef.current || prefersReducedMotion()) return

    const { gsap } = registerGsapPlugins()
    const ctx = gsap.context(() => {
      gsap.to('.raycast-beam', {
        xPercent: 16,
        yPercent: -8,
        opacity: 0.82,
        duration: 5.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: 0.45,
      })

      gsap.to('.raycast-glow', {
        scale: 1.12,
        opacity: 0.7,
        duration: 3.8,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    }, rootRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <div className="raycast-glow absolute left-1/2 top-1/3 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-gold/20 blur-[90px]" />
      {beams.map((beam, index) => (
        <span
          key={index}
          className="raycast-beam absolute h-16 rounded-full border border-gold/25 bg-gradient-to-r from-transparent via-champagne/28 to-gold/18 blur-[1px]"
          style={{
            top: beam.top,
            left: beam.left,
            width: beam.width,
            transform: `rotate(${beam.rotate}deg)`,
            animationDelay: `${beam.delay}s`,
            boxShadow: '0 0 60px rgba(184, 138, 45, 0.24)',
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.12),transparent_26%),radial-gradient(circle_at_80%_70%,rgba(184,138,45,0.18),transparent_30%)]" />
    </div>
  )
}

export const Component = RaycastAnimatedBackground
