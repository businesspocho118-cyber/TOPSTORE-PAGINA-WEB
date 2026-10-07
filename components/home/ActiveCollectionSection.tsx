import { Suspense } from 'react'
import Link from 'next/link'
import { ArrowRight, Dumbbell, ShieldCheck, Sparkles, Truck } from 'lucide-react'
import { ProductGrid, ProductGridSkeleton } from '@/components/products/ProductGrid'
import { ActiveCollectionMotion } from '@/components/home/ActiveCollectionMotion'
import styles from './active-collection-section.module.css'

const collectionPills = [
  { label: 'Solo prendas disponibles', icon: ShieldCheck },
  { label: 'Envíos a toda Colombia', icon: Truck },
  { label: 'Looks para gimnasio y vida activa', icon: Dumbbell },
]

const showcaseSections = [
  {
    id: 'vitrina-hombres',
    eyebrow: 'Colección Masculina',
    title: 'Hombres',
    linkText: 'Ver todo Hombres',
    linkHref: '/hombres',
    gridProps: { genero: 'hombres' as const, limit: 8, onlyInStock: true },
  },
  {
    id: 'vitrina-mujeres',
    eyebrow: 'Colección Femenina',
    title: 'Mujeres',
    linkText: 'Ver todo Mujeres',
    linkHref: '/mujeres',
    gridProps: { genero: 'mujeres' as const, limit: 8, onlyInStock: true },
  },
  {
    id: 'vitrina-ofertas',
    eyebrow: 'Packs & Ahorro Especial',
    title: 'Ofertas (Packs)',
    linkText: 'Ver todas las Ofertas',
    linkHref: '/ofertas',
    gridProps: { categoria: 'Ofertas', limit: 8, onlyInStock: true },
  },
  {
    id: 'vitrina-accesorios',
    eyebrow: 'Detalles & Complementos',
    title: 'Accesorios',
    linkText: 'Ver todo Accesorios',
    linkHref: '/accesorios',
    gridProps: { genero: 'accesorios' as const, excludeOfertas: true, limit: 8, onlyInStock: true },
  },
]

export function ActiveCollectionSection() {
  return (
    <section id="productos" data-active-collection className={styles.section} aria-labelledby="active-collection-title">
      <ActiveCollectionMotion />
      <div data-active-orbit className={styles.orbit} aria-hidden />
      <div data-active-runway className={styles.runway} aria-hidden />

      <div className="container-luxe relative z-10">
        <div className={styles.editorial}>
          <div className={styles.copy}>
            <div data-active-kicker className={styles.kicker}>
              <Sparkles size={16} aria-hidden />
              Colección activa
            </div>

            <h2 id="active-collection-title" data-active-title className={styles.title}>
              Drop listo para entrenar hoy
            </h2>

            <p data-active-copy className={styles.description}>
              Una selección corta de prendas premium disponibles ahora. Menos ruido, mejores piezas y compra rápida por
              WhatsApp.
            </p>
          </div>

          <div className={styles.sidePanel} aria-label="Beneficios de la colección">
            {collectionPills.map(({ label, icon: Icon }) => (
              <span key={label} data-active-chip className={styles.pill}>
                <Icon size={16} aria-hidden />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-12 sm:space-y-16">
          {showcaseSections.map((section) => (
            <div
              key={section.id}
              id={section.id}
              data-active-panel
              className={styles.productPanel}
            >
              <div className={styles.panelHeader}>
                <div>
                  <p className={styles.panelEyebrow}>{section.eyebrow}</p>
                  <h3 className={styles.panelTitle}>{section.title}</h3>
                </div>

                <div className={styles.panelLinks} aria-label={`Explorar ${section.title}`}>
                  <Link href={section.linkHref}>
                    {section.linkText}
                    <ArrowRight size={15} aria-hidden />
                  </Link>
                </div>
              </div>

              <div className={styles.gridWrap}>
                <Suspense fallback={<ProductGridSkeleton count={8} />}>
                  <ProductGrid {...section.gridProps} />
                </Suspense>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
