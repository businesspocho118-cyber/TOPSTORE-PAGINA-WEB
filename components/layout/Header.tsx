'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createPortal } from 'react-dom'
import {
  ChevronDown,
  ChevronRight,
  Gift,
  Menu,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Tag,
  X
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { CartIcon } from '@/components/cart/CartIcon'
import { useCart } from '@/components/cart/CartProvider'
import { cn } from '@/lib/utils'

const mainNavItems = [
  { href: '/hombres', label: 'Hombres', desc: 'Training, gym y rendimiento' },
  { href: '/mujeres', label: 'Mujeres', desc: 'Prendas fit, activewear y confort' }
]

const otherOptions = [
  { href: '/ofertas', label: 'Ofertas (Packs)', tag: 'Ahorro', icon: Tag },
  { href: '/cosmetica', label: 'Cosmética', tag: 'Nuevo', icon: Sparkles },
  { href: '/accesorios', label: 'Accesorios', tag: 'Detalles', icon: ShoppingBag },
  { href: '/#tarjetas-regalo', label: 'Regalos', tag: 'Sin fecha', icon: Gift }
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
  const { count, openCart } = useCart()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const logoSrc = '/logo.png?v=2'
  const isTransparentHome = pathname === '/' && !isScrolled
  const isOtherActive =
    (pathname?.startsWith('/accesorios') ||
      pathname?.startsWith('/cosmetica') ||
      pathname?.startsWith('/ofertas') ||
      pathname?.startsWith('/bolsos-y-belleza')) ?? false
  const activeOther = mounted && isOtherActive

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setIsMenuOpen(false)
      }
      window.addEventListener('keydown', handleKeyDown)
      return () => {
        document.body.style.overflow = ''
        window.removeEventListener('keydown', handleKeyDown)
      }
    } else {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsDropdownOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        isScrolled || pathname !== '/'
          ? 'border-b border-black/10 bg-white/85 shadow-[0_10px_40px_rgba(12,10,9,0.08)] backdrop-blur-xl'
          : 'bg-transparent'
      )}
    >
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">
        Saltar al contenido
      </a>
      <div className="container-luxe flex h-20 items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Ir al inicio de TOPSTORE" className="flex min-h-12 items-center gap-3">
            <Image src={logoSrc} alt="TOPSTORE" width={180} height={180} className="h-14 w-14 object-contain" priority unoptimized />
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

        <nav aria-label="Navegación principal" className="hidden items-center gap-7 lg:flex">
          {mainNavItems.map((item) => (
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

          {/* OTRAS OPCIONES dropdown (Desktop) */}
          <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={() => {
              if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current)
              setIsDropdownOpen(true)
            }}
            onMouseLeave={() => {
              dropdownTimeoutRef.current = setTimeout(() => {
                setIsDropdownOpen(false)
              }, 160)
            }}
          >
            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              aria-expanded={isDropdownOpen}
              aria-haspopup="true"
              className={cn(
                'inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 py-3 text-xs font-bold uppercase tracking-[0.22em] transition hover:text-gold-deep',
                activeOther
                  ? 'text-gold-deep'
                  : isTransparentHome
                    ? 'text-white/76 hover:text-white'
                    : 'text-ink/78'
              )}
            >
              <span>Otras Opciones</span>
              <ChevronDown
                className={cn('h-3.5 w-3.5 transition-transform duration-200', isDropdownOpen && 'rotate-180')}
                aria-hidden
              />
            </button>

            {isDropdownOpen && (
              <div
                role="menu"
                className="absolute left-1/2 top-full z-50 mt-2 min-w-[220px] -translate-x-1/2 rounded-2xl border border-black/10 bg-white/95 p-2 shadow-[0_20px_50px_rgba(12,10,9,0.14)] backdrop-blur-xl animate-in fade-in-50 zoom-in-95 duration-150"
              >
                {otherOptions.map((sub) => {
                  const isSubActive =
                    sub.href.startsWith('/#')
                      ? false
                      : pathname.startsWith(sub.href)
                  return (
                    <Link
                      key={sub.href}
                      href={sub.href}
                      role="menuitem"
                      onClick={() => setIsDropdownOpen(false)}
                      className={cn(
                        'block rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] transition',
                        isSubActive
                          ? 'bg-gold/15 text-gold-deep'
                          : 'text-ink/80 hover:bg-black/5 hover:text-gold-deep'
                      )}
                    >
                      {sub.label}
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          <Link
            href="/nosotros"
            className={cn(
              'min-h-11 rounded-full px-2 py-3 text-xs font-bold uppercase tracking-[0.22em] transition hover:text-gold-deep',
              pathname === '/nosotros' ? 'text-gold-deep' : isTransparentHome ? 'text-white/76 hover:text-white' : 'text-ink/78'
            )}
          >
            Nosotros
          </Link>
        </nav>

        {/* Header Right (Cart + Hamburger Button) */}
        <div className="flex items-center gap-2">
          <CartIcon />
          <button
            type="button"
            className={cn(
              'inline-flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-200 lg:hidden',
              isTransparentHome
                ? 'border-white/20 bg-black/40 text-white backdrop-blur-md hover:bg-black/60 active:scale-95'
                : 'border-ink/10 bg-white/80 text-ink backdrop-blur-md hover:bg-white active:scale-95'
            )}
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((value) => !value)}
          >
            {isMenuOpen ? <X aria-hidden size={22} /> : <Menu aria-hidden size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation (via Portal to document.body) */}
      {mounted &&
        createPortal(
          <div
            className={cn(
              'fixed inset-0 z-[100] transition-visibility duration-300 lg:hidden',
              isMenuOpen ? 'pointer-events-auto visible' : 'pointer-events-none invisible'
            )}
            aria-hidden={!isMenuOpen}
          >
            {/* Backdrop Overlay */}
            <div
              className={cn(
                'fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity duration-300',
                isMenuOpen ? 'opacity-100' : 'opacity-0'
              )}
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Slide-over Drawer Panel */}
            <aside
              role="dialog"
              aria-modal="true"
              aria-label="Menú principal de navegación"
              className={cn(
                'fixed inset-y-0 right-0 flex h-full w-[86vw] max-w-[380px] flex-col border-l border-[#e9c56e]/20 bg-gradient-to-b from-[#14110f] via-[#0d0b09] to-[#070605] text-[#fffaf0] shadow-[-20px_0_60px_rgba(0,0,0,0.85)] transition-transform duration-300 ease-out',
                isMenuOpen ? 'translate-x-0' : 'translate-x-full'
              )}
            >
              {/* Drawer Top Header */}
              <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-3"
                  aria-label="Ir al inicio"
                >
                  <Image
                    src={logoSrc}
                    alt="TOPSTORE"
                    width={160}
                    height={160}
                    className="h-11 w-11 object-contain"
                    priority
                    unoptimized
                  />
                  <span className="font-display text-2xl tracking-[0.18em] text-[#fffaf0]">
                    TOPSTORE
                  </span>
                </Link>

                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Cerrar menú"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 backdrop-blur transition hover:border-[#e9c56e] hover:bg-white/15 hover:text-white active:scale-95"
                >
                  <X size={20} aria-hidden />
                </button>
              </div>

              {/* Drawer Scrollable Body */}
              <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6 overscroll-contain">
                {/* Tu Carrito (Acceso Rápido) */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false)
                    openCart()
                  }}
                  className="flex w-full items-center justify-between rounded-2xl border border-[#e9c56e]/30 bg-gradient-to-r from-[#1f1a14] to-[#14100c] p-3.5 transition hover:border-[#e9c56e] active:scale-[0.99]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9c56e]/15 text-[#e9c56e]">
                      <ShoppingBag size={18} />
                    </div>
                    <div className="text-left">
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#e9c56e]">
                        Tu Carrito
                      </p>
                      <p className="text-xs font-semibold text-white/80">
                        {count === 0 ? 'Sin prendas aún' : `${count} ${count === 1 ? 'prenda' : 'prendas'} en el carrito`}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-[#e9c56e] px-3 py-1 text-[0.68rem] font-black uppercase tracking-wider text-[#120e08]">
                    Ver
                  </span>
                </button>

                {/* Main Navigation (Hombres / Mujeres) */}
                <div className="space-y-2">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#e9c56e]/80 px-1">
                    Líneas Principales
                  </p>
                  <div className="grid gap-2">
                    {mainNavItems.map((item) => {
                      const isActive = pathname === item.href
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            'group flex items-center justify-between rounded-2xl border p-4 transition active:scale-[0.99]',
                            isActive
                              ? 'border-[#e9c56e] bg-[#e9c56e]/12 text-[#e9c56e]'
                              : 'border-white/10 bg-white/[0.03] text-white hover:border-[#e9c56e]/50 hover:bg-white/[0.06]'
                          )}
                        >
                          <div>
                            <span className="font-display text-2xl uppercase tracking-wider block">
                              {item.label}
                            </span>
                            <span className="text-[0.72rem] text-white/60 block mt-0.5">
                              {item.desc}
                            </span>
                          </div>
                          <ChevronRight
                            size={20}
                            className={cn(
                              'transition-transform group-hover:translate-x-1',
                              isActive ? 'text-[#e9c56e]' : 'text-white/40'
                            )}
                          />
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Categorías & Ofertas */}
                <div className="space-y-2">
                  <p className="text-[0.68rem] font-black uppercase tracking-[0.22em] text-[#e9c56e]/80 px-1">
                    Catálogo & Especiales
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {otherOptions.map((item) => {
                      const Icon = item.icon
                      const isActive = item.href.startsWith('/#') ? false : pathname.startsWith(item.href)
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={cn(
                            'group flex flex-col justify-between rounded-2xl border p-3.5 transition active:scale-[0.98]',
                            isActive
                              ? 'border-[#e9c56e] bg-[#e9c56e]/15 text-[#e9c56e]'
                              : 'border-white/10 bg-white/[0.03] text-white hover:border-[#e9c56e]/40 hover:bg-white/[0.06]'
                          )}
                        >
                          <div className="flex items-center justify-between">
                            <Icon size={16} className={isActive ? 'text-[#e9c56e]' : 'text-white/60'} />
                            <span className="rounded-full border border-[#e9c56e]/40 bg-[#e9c56e]/10 px-2 py-0.5 text-[0.6rem] font-black uppercase tracking-wider text-[#e9c56e]">
                              {item.tag}
                            </span>
                          </div>
                          <span className="mt-3 text-xs font-bold uppercase tracking-[0.12em] block">
                            {item.label}
                          </span>
                        </Link>
                      )
                    })}
                  </div>
                </div>

                {/* Nosotros */}
                <div>
                  <Link
                    href="/nosotros"
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      'flex items-center justify-between rounded-2xl border p-4 transition active:scale-[0.99]',
                      pathname === '/nosotros'
                        ? 'border-[#e9c56e] bg-[#e9c56e]/12 text-[#e9c56e]'
                        : 'border-white/10 bg-white/[0.03] text-white hover:border-[#e9c56e]/50 hover:bg-white/[0.06]'
                    )}
                  >
                    <div>
                      <span className="font-display text-xl uppercase tracking-wider block">
                        Nosotros
                      </span>
                      <span className="text-[0.72rem] text-white/60 block mt-0.5">
                        Conoce nuestra historia, misión y calidad
                      </span>
                    </div>
                    <ChevronRight size={18} className="text-white/40" />
                  </Link>
                </div>

                {/* Asesoría WhatsApp Directa */}
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#e9c56e]">
                    ¿Tienes dudas o necesitas ayuda?
                  </p>
                  <p className="mt-1 text-xs text-white/70">
                    Te asesoramos con tallas, combos o compras personalizadas.
                  </p>
                  <Link
                    href="https://wa.me/573205172484?text=Hola,%20necesito%20asesor%C3%ADa%20con%20una%20prenda%20de%20TOPSTORE"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => setIsMenuOpen(false)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/15 py-2.5 text-xs font-black uppercase tracking-wider text-[#25D366] transition hover:bg-[#25D366] hover:text-[#0b2812]"
                  >
                    <MessageCircle size={16} />
                    <span>Hablar con un asesor</span>
                  </Link>
                </div>

                {/* Redes Sociales */}
                <div className="pt-1">
                  <p className="text-center text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/40 mb-3">
                    Síguenos en nuestras redes
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    {socialIcons.map(({ href, label, icon }) => (
                      <Link
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/70 transition hover:border-[#e9c56e] hover:bg-white/15 hover:text-white"
                      >
                        {icon}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer info */}
              <div className="border-t border-white/10 px-6 py-3.5 text-center bg-black/30">
                <p className="text-[0.65rem] uppercase tracking-widest text-white/40">
                  TOPSTORE · Envíos a toda Colombia
                </p>
              </div>
            </aside>
          </div>,
          document.body
        )}
    </header>
  )
}

