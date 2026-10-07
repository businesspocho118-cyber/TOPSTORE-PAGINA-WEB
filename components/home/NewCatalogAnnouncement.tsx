'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'

const SESSION_KEY = 'topstore-new-inventory-announcement-v2'

export function NewCatalogAnnouncement() {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  function closeAnnouncement() {
    setIsOpen(false)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.sessionStorage.getItem(SESSION_KEY)) return

    const timeout = window.setTimeout(() => {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      window.sessionStorage.setItem(SESSION_KEY, 'shown')
      setIsOpen(true)
    }, 550)

    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeAnnouncement()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (!first || !last) return

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || !dialogRef.current || prefersReducedMotion()) return

    const { gsap } = registerGsapPlugins()
    const ctx = gsap.context(() => {
      gsap.fromTo(
        dialogRef.current,
        { autoAlpha: 0, y: 20, scale: 0.96 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.32, ease: 'power3.out' }
      )
    })

    return () => ctx.revert()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) closeAnnouncement()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="promo-announcement-title"
        aria-describedby="promo-announcement-desc"
        className="relative my-auto w-full max-w-[390px] overflow-hidden rounded-[1.75rem] border border-[#e9c56e]/25 bg-gradient-to-b from-[#18130e] via-[#100d0a] to-[#080706] text-[#fffaf0] shadow-[0_28px_80px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(255,255,255,0.12)]"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={closeAnnouncement}
          aria-label="Cerrar anuncio"
          className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <X size={16} aria-hidden />
        </button>

        {/* Compact Banner */}
        <div className="relative h-40 sm:h-44 w-full overflow-hidden bg-[#0c0a08]">
          <Image
            src="/promo-banner.jpg"
            alt="Nuevas ofertas y cosmética en TOPSTORE"
            fill
            sizes="390px"
            priority
            className="object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-[#18130e] via-transparent to-black/30 pointer-events-none"
            aria-hidden
          />
          <div className="absolute bottom-2.5 left-3.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-black/70 px-2.5 py-0.5 text-[0.62rem] font-black uppercase tracking-wider text-[#f5d482] backdrop-blur-md">
              <Sparkles size={11} className="text-gold" aria-hidden />
              ¡Inventario Renovado!
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 pt-3.5">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#e9c56e]">
            Nuevo en TOPSTORE
          </p>

          <h2
            id="promo-announcement-title"
            className="mt-1 font-display text-3xl uppercase leading-none tracking-wide text-white sm:text-4xl"
          >
            Más Productos, Nuevas Ofertas
          </h2>

          <p
            id="promo-announcement-desc"
            className="mt-2 text-xs leading-relaxed text-white/75"
          >
            Agrandamos nuestro catálogo con nueva línea de <strong>Cosmética</strong> y <strong>nuevos packs en oferta</strong>.
          </p>

          {/* Compact Action Buttons */}
          <div className="mt-4 flex gap-2">
            <Link
              href="/ofertas"
              onClick={closeAnnouncement}
              className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center gap-1.5 rounded-full border border-[#e9c56e] bg-gradient-to-r from-[#e3ba58] to-[#b88a2d] px-3 text-[0.72rem] font-black uppercase tracking-wider text-[#171108] shadow-[0_10px_24px_rgba(184,138,45,0.22)] transition hover:brightness-110 active:scale-95"
            >
              <span>Ver Ofertas</span>
              <ArrowRight size={13} aria-hidden />
            </Link>

            <Link
              href="/cosmetica"
              onClick={closeAnnouncement}
              className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 text-[0.72rem] font-black uppercase tracking-wider text-[#fffaf0] transition hover:bg-white/20 active:scale-95"
            >
              <span>Ver Cosmética</span>
              <ArrowRight size={13} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
