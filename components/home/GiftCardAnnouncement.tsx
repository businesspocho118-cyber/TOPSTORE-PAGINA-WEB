'use client'

import { ArrowDown, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'
import styles from './gift-cards.module.css'

const SESSION_KEY = 'topstore-gift-card-announcement-v1'

export function GiftCardAnnouncement() {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  function closeAnnouncement() {
    setIsOpen(false)
  }

  function viewGiftCards() {
    closeAnnouncement()
    window.setTimeout(() => {
      document.getElementById('tarjetas-regalo')?.scrollIntoView({
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
        block: 'start'
      })
    }, 0)
  }

  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_KEY)) return

    const timeout = window.setTimeout(() => {
      previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
      window.sessionStorage.setItem(SESSION_KEY, 'shown')
      setIsOpen(true)
    }, 500)

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
      gsap.fromTo(dialogRef.current, { autoAlpha: 0, y: 24, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34, ease: 'power3.out' })
    })

    return () => ctx.revert()
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.announcementBackdrop} onMouseDown={(event) => { if (event.currentTarget === event.target) closeAnnouncement() }}>
      <div ref={dialogRef} className={styles.announcement} role="dialog" aria-modal="true" aria-labelledby="gift-announcement-title" aria-describedby="gift-announcement-copy">
        <button ref={closeButtonRef} type="button" className={styles.closeButton} onClick={closeAnnouncement} aria-label="Cerrar anuncio de tarjetas de regalo">
          <X size={20} aria-hidden />
        </button>
        <p className={styles.announcementKicker}>Nuevo en TOPSTORE</p>
        <h2 id="gift-announcement-title" className={styles.announcementTitle}>Regalá o elegí</h2>
        <p id="gift-announcement-copy" className={styles.announcementCopy}>
          Regalá $100.000, $150.000 o elegí un monto personalizado. Todas son sin vencimiento.
        </p>
        <div className={styles.announcementOptions} aria-label="Opciones de tarjetas de regalo">
          <span>$100.000</span>
          <span>$150.000</span>
          <span>Monto libre</span>
        </div>
        <button type="button" className={styles.announcementCta} onClick={viewGiftCards}>
          Ver tarjetas
          <ArrowDown size={18} aria-hidden />
        </button>
      </div>
    </div>
  )
}