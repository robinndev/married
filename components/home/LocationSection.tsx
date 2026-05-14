import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import { GOOGLE_MAPS_URL, WEDDING_LOCATION } from '@/constants'

export default function LocationSection() {
  return (
    <section className="relative py-28 px-5 overflow-hidden" style={{ background: '#F4E5D0' }}>
      {/* Ambient top glow */}
      <div
        className="absolute top-0 inset-x-0 h-40 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(200,146,74,0.08) 0%, transparent 100%)',
        }}
      />
      <div className="divider-sunset absolute top-0 inset-x-0" />

      <div className="max-w-5xl mx-auto relative z-10">
        <SectionTitle
          eyebrow="Como chegar"
          title="Localização"
          subtitle="Localização completa e direções para o dia do nosso sim."
        />

        <AnimatedSection delay={0.2} className="mt-16 grid md:grid-cols-2 gap-10 items-center">
          {/* Info card */}
          <div className="flex flex-col gap-5">
            <div
              className="rounded-2xl p-8"
              style={{
                background: 'rgba(251,242,232,0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(200,146,74,0.22)',
                boxShadow: '0 8px 32px rgba(26,16,10,0.07)',
              }}
            >
              <p
                className="text-[0.6rem] tracking-[0.38em] uppercase mb-3"
                style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
              >
                Local da cerimônia
              </p>
              <p
                className="text-3xl font-light"
                style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
              >
                {WEDDING_LOCATION}
              </p>
              <div className="divider-sunset w-10 my-5" />
              <div className="flex flex-col gap-3">
                {[
                  { icon: '📅', text: '01 de agosto de 2026' },
                  { icon: '🕒', text: '15:00 Horas — cerimônia ao pôr do sol' },
                  { icon: '📍', text: 'Mairiporã, São Paulo' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <span className="text-lg">{icon}</span>
                    <span
                      className="text-sm"
                      style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
                    >
                      {text}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 py-4 px-8 text-[0.68rem] tracking-[0.22em] uppercase transition-all duration-300 hover:scale-105 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #C8924A, #C4673A)',
                color: '#FBF2E8',
                fontFamily: 'var(--font-montserrat)',
                boxShadow: '0 4px 24px rgba(200,146,74,0.3)',
              }}
            >
              <span>📍</span>
              Como Chegar
            </a>
          </div>

          {/* Map */}
          <div
            className="rounded-2xl overflow-hidden shadow-xl relative"
            style={{
              aspectRatio: '1/1',
              border: '1px solid rgba(200,146,74,0.22)',
              boxShadow: '0 16px 48px rgba(26,16,10,0.12)',
            }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117944.33!2d-46.6!3d-23.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94cf11b5c3b8e2e7%3A0x2d76a95f82acf4cd!2sMairiporã%2C%20SP!5e0!3m2!1spt-BR!2sbr!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'sepia(18%) saturate(80%) hue-rotate(15deg)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Localização do casamento"
              className="absolute inset-0"
            />
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
