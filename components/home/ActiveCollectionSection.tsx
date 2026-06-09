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

        <div data-active-panel className={styles.productPanel}>
          <div className={styles.panelHeader}>
            <div>
              <p className={styles.panelEyebrow}>Vitrina TOPSTORE</p>
              <h3 className={styles.panelTitle}>Piezas destacadas</h3>
            </div>

            <div className={styles.panelLinks} aria-label="Explorar categorías">
              <Link href="/mujeres">
                Mujeres
                <ArrowRight size={15} aria-hidden />
              </Link>
              <Link href="/hombres">
                Hombres
                <ArrowRight size={15} aria-hidden />
              </Link>
            </div>
          </div>

          <div className={styles.gridWrap}>
            <Suspense fallback={<ProductGridSkeleton count={8} />}>
              <ProductGrid limit={8} onlyInStock />
            </Suspense>
          </div>
        </div>
      </div>
    </section>
  )
}
