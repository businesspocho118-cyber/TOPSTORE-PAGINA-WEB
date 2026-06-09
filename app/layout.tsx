import type { Metadata } from 'next'
import { Bebas_Neue, Cormorant_Garamond, DM_Sans, Geist } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { CartProvider } from '@/components/cart/CartProvider'
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const bebas = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas'
})

const cormorant = Cormorant_Garamond({
  weight: ['600'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant'
})

const dmSans = DM_Sans({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans'
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://topstore.co'),
  title: {
    default: 'TOPSTORE | Ropa Deportiva Premium en Colombia',
    template: '%s | TOPSTORE'
  },
  description: 'Compra ropa deportiva premium en Colombia. Camisas, leggins, conjuntos, buzos y accesorios para hombre y mujer. Envíos a Pasto, Bogotá, Medellín y toda Colombia.',
  keywords: [
    'ropa deportiva Pasto',
    'ropa deportiva Colombia',
    'ropa gym Colombia',
    'camisas deportivas hombre Colombia',
    'leggins deportivos mujer Colombia',
    'ropa fitness premium Colombia',
    'TOPSTORE ropa deportiva',
    'comprar ropa deportiva online Colombia'
  ],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://topstore.co',
    siteName: 'TOPSTORE',
    title: 'TOPSTORE | Ropa Deportiva Premium en Colombia',
    description: 'Ropa deportiva premium con envíos a toda Colombia.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TOPSTORE | Ropa Deportiva Premium',
    description: 'Ropa deportiva premium. Envíos a toda Colombia.'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true }
  },
  alternates: {
    canonical: 'https://topstore.co'
  }
}

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'TOPSTORE',
  description: 'Tienda de ropa deportiva premium con envíos a toda Colombia',
  url: 'https://topstore.co',
  logo: 'https://topstore.co/logo.png',
  telephone: '+573205172484',
  areaServed: 'CO',
  servesCuisine: null,
  priceRange: '$$',
  sameAs: [
    'https://www.instagram.com/topstore_18/',
    'https://wa.me/573205172484',
    'https://www.facebook.com/people/TopStore1019/61582088321250/',
    'https://www.tiktok.com/@top_store1108'
  ]
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-CO" suppressHydrationWarning className={cn(bebas.variable, cormorant.variable, dmSans.variable, "font-sans", geist.variable)}>
      <body>
        <script type="application/ld+json" suppressHydrationWarning>
          {JSON.stringify(structuredData)}
        </script>
        <CartProvider>
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  )
}
