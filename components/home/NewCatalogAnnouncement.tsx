'use client'

import Image from 'next/image'
import { ArrowUpRight, Sparkles, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'

const SESSION_KEY = 'topstore-woman-announcement-v1'
const TOPSTORE_WOMAN_URL = 'https://topstore-elegante.pages.dev/'

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
        aria-labelledby="woman-announcement-title"
        aria-describedby="woman-announcement-desc"
        className="relative my-auto w-full max-w-[420px] overflow-hidden rounded-[1.75rem] border border-[#d9a98c]/35 bg-gradient-to-b from-[#1b1411] via-[#120d0b] to-[#0a0706] text-[#fffaf0] shadow-[0_28px_80px_rgba(0,0,0,0.82),inset_0_1px_0_rgba(255,255,255,0.12)]"
      >
        {/* Close button */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={closeAnnouncement}
          aria-label="Cerrar anuncio"
          className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-black/65 text-white backdrop-blur-md transition hover:scale-105 hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9a98c]"
        >
          <X size={16} aria-hidden />
        </button>

        {/* Split Visual Banner: Official Logo + Editorial Look */}
        <div className="relative grid h-48 w-full grid-cols-2 overflow-hidden bg-[#ede3d8] sm:h-52">
          <div className="relative h-full w-full overflow-hidden border-r border-[#d9a98c]/25">
            <Image
              src="/topstore-woman-logo.jpg"
              alt="Logo oficial de TOPSTORE WOMAN — Ropa Premium Para Ella"
              fill
              sizes="210px"
              priority
              unoptimized
              className="object-cover"
            />
          </div>
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src="/topstore-woman-banner.jpg"
              alt="Colección elegante femenina TOPSTORE WOMAN"
              fill
              sizes="210px"
              priority
              unoptimized
              className="object-cover object-[50%_15%]"
            />
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#1b1411] via-[#1b1411]/20 to-black/20"
            aria-hidden
          />
          <div className="absolute bottom-2.5 left-3.5 z-10">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#d9a98c]/45 bg-black/75 px-3 py-1 text-[0.62rem] font-black uppercase tracking-wider text-[#f3d8c7] backdrop-blur-md">
              <Sparkles size={11} className="text-[#d9a98c]" aria-hidden />
              Nueva Tienda · Familia TOPSTORE
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 pt-3.5">
          <p className="text-[0.68rem] font-black uppercase tracking-[0.18em] text-[#d9a98c]">
            Nueva Rama · Moda Elegante Femenina
          </p>

          <h2
            id="woman-announcement-title"
            className="mt-1 font-display text-3xl uppercase leading-none tracking-wide text-white sm:text-4xl"
          >
            Conoce TOPSTORE WOMAN
          </h2>

          <p
            id="woman-announcement-desc"
            className="mt-2.5 text-xs leading-relaxed text-white/80"
          >
            Ampliamos nuestra familia con una nueva tienda dedicada a la ropa elegante y premium para ella: abrigos, blusas, tejidos, jeans y bolsos con envíos a toda Colombia.
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5" aria-label="Destacados de TOPSTORE WOMAN">
            {['Abrigos & Blusas', 'Bolsos', 'Envíos Nacionales'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[#d9a98c]/25 bg-white/[0.06] px-2.5 py-0.5 text-[0.64rem] font-semibold tracking-wide text-[#f3d8c7]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-4 flex gap-2">
            <a
              href={TOPSTORE_WOMAN_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeAnnouncement}
              className="inline-flex min-h-[2.75rem] flex-1 items-center justify-center gap-1.5 rounded-full border border-[#e3bea6] bg-gradient-to-r from-[#e3bea6] to-[#c48f71] px-3 text-[0.72rem] font-black uppercase tracking-wider text-[#1a120e] shadow-[0_10px_24px_rgba(196,143,113,0.28)] transition hover:brightness-110 active:scale-95"
            >
              <span>Ir a TOPSTORE WOMAN</span>
              <ArrowUpRight size={14} aria-hidden />
            </a>

            <button
              type="button"
              onClick={closeAnnouncement}
              className="inline-flex min-h-[2.75rem] items-center justify-center rounded-full border border-white/20 bg-white/10 px-4 text-[0.72rem] font-black uppercase tracking-wider text-[#fffaf0] transition hover:bg-white/20 active:scale-95"
            >
              Seguir aquí
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
