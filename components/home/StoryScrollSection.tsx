'use client'

import FlowArt, { FlowSection } from '@/components/story-scroll'
import { AnimatedTestimonials } from '@/components/animated-testimonials'
import AboutSection1 from '@/components/about-section-1'
import { testimonialsData } from '@/lib/testimonials'

export default function StoryScrollSection() {
  return (
    <FlowArt className="relative z-10 mt-4 bg-background" aria-label="Reseñas y marca TOPSTORE">
      <FlowSection className="bg-background" aria-label="Reseñas verificadas TOPSTORE">
        <AnimatedTestimonials
          title="Nuestra vitrina real"
          subtitle="Lo que dicen nuestros clientes después de recibir sus pedidos"
          badgeText="Reseñas verificadas"
          testimonials={testimonialsData}
          autoRotateInterval={5000}
        />
      </FlowSection>
      <FlowSection className="bg-ink" aria-label="Historia TOPSTORE">
        <AboutSection1 />
      </FlowSection>
    </FlowArt>
  )
}
