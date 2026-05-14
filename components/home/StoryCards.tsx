import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'

const cards = [
  {
    href: '/historia',
    eyebrow: 'Nossa Jornada',
    title: 'A Nossa História',
    description:
      'Da primeira órbita distante ao primeiro beijo na Consolação — amor que o universo ensaiou por anos.',
    src: '/images/book1.png',
    objectPosition: 'bottom',
  },
  {
    href: '/manual',
    eyebrow: 'Para os Convidados',
    title: 'Manual do Convidado',
    description: 'Tudo que você precisa saber para aproveitar ao máximo o nosso dia especial.',
    src: '/images/book3.png',
    objectPosition: 'bottom',
  },
  {
    href: '/presentes',
    eyebrow: 'Lista de Presentes',
    title: 'Presentes',
    description: 'Cada presente é uma forma de fazer parte da construção do nosso lar.',
    src: '/images/book2.png',
    objectPosition: 'bottom',
  },
  {
    href: '/recados',
    eyebrow: 'Mural',
    title: 'Deixe um Recado',
    description: 'Escreva uma mensagem especial que ficará guardada para sempre.',
    src: '/images/book6.png',
    objectPosition: 'top',
  },
]

export default function StoryCards() {
  return (
    <section className="py-28 px-5" style={{ background: '#FBF2E8' }}>
      <div className="max-w-6xl mx-auto">
        <SectionTitle
          eyebrow="Explore"
          title="Conheça Nossa História"
          subtitle="Cada seção foi criada com carinho para que você viva conosco cada detalhe desse momento."
        />

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(({ href, eyebrow, title, description, src, objectPosition }, i) => (
            <AnimatedSection key={href} delay={i * 0.1}>
              <Link
                href={href}
                className="group flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 card-glow"
                style={{ background: '#FBF2E8' }}
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={src}
                    alt={title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-108"
                    style={{ objectPosition }}
                    quality={75}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{
                      background:
                        'linear-gradient(180deg, rgba(26,16,10,0.1) 0%, rgba(26,16,10,0.55) 100%)',
                    }}
                  />
                  {/* Hover sunset glow overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background:
                        'linear-gradient(180deg, transparent 30%, rgba(196,103,58,0.35) 100%)',
                    }}
                  />
                  <div className="absolute bottom-4 left-4">
                    <p
                      className="text-[0.52rem] tracking-[0.38em] uppercase"
                      style={{ color: '#E2C09A', fontFamily: 'var(--font-montserrat)' }}
                    >
                      {eyebrow}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div
                  className="flex flex-col flex-1 p-5 gap-3"
                  style={{ background: '#FBF2E8', borderTop: '1px solid rgba(200,146,74,0.12)' }}
                >
                  <h3
                    className="text-xl font-light"
                    style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
                  >
                    {title}
                  </h3>
                  <p
                    className="text-xs leading-relaxed flex-1"
                    style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
                  >
                    {description}
                  </p>
                  <div
                    className="flex items-center gap-2 text-[0.62rem] tracking-widest uppercase mt-auto"
                    style={{ fontFamily: 'var(--font-montserrat)', color: '#C8924A' }}
                  >
                    <span>Ver mais</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
                  </div>
                </div>
              </Link>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
