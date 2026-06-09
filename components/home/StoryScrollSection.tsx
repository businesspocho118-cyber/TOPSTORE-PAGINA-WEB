'use client'

import FlowArt, { FlowSection } from '@/components/story-scroll'
import { AnimatedTestimonials, type Testimonial } from '@/components/animated-testimonials'
import AboutSection1 from '@/components/about-section-1'

const testimonialsData: Testimonial[] = [
  { id: 1, content: 'Ya lo recibí linda, muchas gracias, está hermoso.', rating: 5 },
  { id: 2, content: 'Me encantó la camisa, está súper linda. Pronto te escribo para pedir más.', rating: 5 },
  { id: 3, content: 'Están súper lindos, te agradezco muchísimo.', rating: 5 },
  { id: 4, content: 'Está precioso, muchas gracias y la atención de 10.', rating: 5 },
  { id: 5, content: 'Ya llegó, muy lindo. Muchas gracias.', rating: 5 },
  { id: 6, content: 'El set está hermoso y la tela súper cómoda. Muchas gracias por su atención.', rating: 5 },
  { id: 7, content: 'Muchas gracias, está súper lindo el short.', rating: 5 },
  { id: 8, content: 'Todo está súper lindo, muchas gracias.', rating: 5 },
  { id: 9, content: 'Muchísimas gracias por su amabilidad, soy una clienta más.', rating: 5 },
  { id: 10, content: 'Todo está hermoso, muchas gracias.', rating: 5 },
  { id: 11, content: 'Ya lo recibí, están súper bonitos. Gracias.', rating: 5 },
]

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
