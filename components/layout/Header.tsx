'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CartIcon } from '@/components/cart/CartIcon'
import { cn } from '@/lib/utils'
import { prefersReducedMotion, registerGsapPlugins } from '@/lib/gsap-client'

const navItems = [
  { href: '/hombres', label: 'Hombres' },
  { href: '/mujeres', label: 'Mujeres' },
  { href: '/accesorios', label: 'Accesorios' },
  { href: '/nosotros', label: 'Nosotros' }
]

const socialIcons = [
  {
    href: 'https://wa.me/573205172484',
    label: 'WhatsApp',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[17px] w-[17px]" aria-hidden>
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    )
  },
  {
    href: 'https://www.instagram.com/topstore_18/',
    label: 'Instagram',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[17px] w-[17px]" aria-hidden>
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
      </svg>
    )
  },
  {
    href: 'https://www.facebook.com/people/TopStore1019/61582088321250/',
    label: 'Facebook',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[17px] w-[17px]" aria-hidden>
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    )
  },
  {
    href: 'https://www.tiktok.com/@top_store1108',
    label: 'TikTok',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-[17px] w-[17px]" aria-hidden>
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
      </svg>
    )
  }
]

export function Header() {
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const useWhiteLogo =
    pathname.startsWith('/hombres') ||
    pathname.startsWith('/mujeres') ||
    pathname.startsWith('/accesorios') ||
    pathname.startsWith('/nosotros')
  const logoSrc = useWhiteLogo ? '/logo.png' : '/logo-negro.jpeg'
  const isTransparentHome = pathname === '/' && !isScrolled

  useEffect(() => {
    const { ScrollTrigger } = registerGsapPlugins()
    const trigger = ScrollTrigger.create({
      start: 72,
      end: 99999,
      onUpdate: (self) => setIsScrolled(self.scroll() > 72)
    })

    return () => trigger.kill()
  }, [])

  useEffect(() => {
    if (!mobileMenuRef.current) return
    const { gsap } = registerGsapPlugins()
    const reduced = prefersReducedMotion()

    gsap.to(mobileMenuRef.current, {
      xPercent: isMenuOpen ? 0 : 105,
      autoAlpha: isMenuOpen ? 1 : 0,
      duration: reduced ? 0 : 0.42,
      ease: isMenuOpen ? 'power4.out' : 'power2.inOut'
    })

    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isScrolled || pathname !== '/'
          ? 'border-b border-black/10 bg-white/82 shadow-[0_10px_40px_rgba(12,10,9,0.08)] backdrop-blur-xl'
          : 'bg-transparent'
      )}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Saltar al contenido
      </a>
      <div className="container-luxe flex h-20 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Ir al inicio de TOPSTORE" className="flex min-h-12 items-center gap-3">
            <Image src={logoSrc} alt="TOPSTORE" width={180} height={180} className="h-14 w-14 object-contain" priority />
            <span
              className={cn(
                'hidden font-display text-2xl tracking-[0.18em] transition-colors sm:inline',
                isTransparentHome ? 'text-white/90' : 'text-ink'
              )}
            >
              TOPSTORE
            </span>
          </Link>

          <div className="hidden items-center gap-1.5 border-l border-ink/15 pl-4 lg:flex" aria-label="Redes sociales">
            {socialIcons.map(({ href, label, icon }) => (
              <Link
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full transition',
                  isTransparentHome
                    ? 'text-white/70 hover:bg-white/15 hover:text-white'
                    : 'text-ink/60 hover:bg-ink/8 hover:text-ink'
                )}
                aria-label={label}
              >
                {icon}
              </Link>
            ))}
          </div>
        </div>

        <nav aria-label="Navegación principal" className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'min-h-11 rounded-full px-2 py-3 text-xs font-bold uppercase tracking-[0.22em] transition hover:text-gold-deep',
                pathname === item.href ? 'text-gold-deep' : isTransparentHome ? 'text-white/76 hover:text-white' : 'text-ink/78'
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <CartIcon />
          <button
            type="button"
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-ink/10 bg-white/70 text-ink backdrop-blur lg:hidden"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? <X aria-hidden size={20} /> : <Menu aria-hidden size={20} />}
          </button>
        </div>
      </div>

      <div
        ref={mobileMenuRef}
        className="fixed right-4 top-24 z-[55] w-[calc(100vw-2rem)] max-w-sm translate-x-[105%] rounded-[2rem] border border-white/70 bg-white/92 p-5 opacity-0 shadow-luxe backdrop-blur-2xl lg:hidden"
        aria-hidden={!isMenuOpen}
      >
        <nav aria-label="Navegación móvil" className="grid gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-14 items-center justify-between rounded-2xl border border-ink/8 px-5 font-display text-3xl uppercase tracking-wide text-ink transition hover:border-gold hover:text-gold-deep"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
