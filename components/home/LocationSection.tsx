import AnimatedSection from '@/components/ui/AnimatedSection'
import SectionTitle from '@/components/ui/SectionTitle'
import {
  GOOGLE_MAPS_URL,
  PONTO_7_MAPS_URL,
  REFERENCE_POINT,
  WEDDING_ADDRESS,
  WEDDING_LOCATION,
} from '@/constants'

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
                  { icon: '📍', text: `${WEDDING_ADDRESS.street} — ${WEDDING_ADDRESS.neighborhood}` },
                  { icon: '🏙️', text: `${WEDDING_ADDRESS.city} · CEP ${WEDDING_ADDRESS.cep}` },
                  { icon: '🧭', text: WEDDING_ADDRESS.coordinates },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <span className="text-lg leading-6">{icon}</span>
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

            {/* Directions guide */}
            <div
              className="rounded-2xl p-6"
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
                Ajuste o endereço 📍
              </p>
              <p
                className="text-sm mb-4"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50', lineHeight: 1.7 }}
              >
                🚫 <strong>Não</strong> coloque o Kasaqui no Waze/Google Maps logo no início da viagem — alguns trajetos indicam atalhos com pouco sinal e/ou estrada de terra.
              </p>
              <ol
                className="text-sm flex flex-col gap-2 list-decimal pl-5"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50', lineHeight: 1.7 }}
              >
                <li>
                  Primeiro, trace rota até o{' '}
                  <a
                    href={PONTO_7_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#C4673A', textDecoration: 'underline' }}
                  >
                    Ponto 7 Auto Center
                  </a>
                  .
                </li>
                <li>
                  Ao chegar no Ponto 7, coloque a rota para o{' '}
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#C4673A', textDecoration: 'underline' }}
                  >
                    Kasaqui Eventos
                  </a>
                  .
                </li>
                <li>
                  Suba pela <strong>Estrada da Roseira</strong> (também chamada Avenida Vereador Belarmino Pereira de Carvalho — é a mesma via).
                </li>
              </ol>
              <p
                className="text-xs mt-4"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
              >
                📍 <strong>Ponto de referência:</strong> {REFERENCE_POINT}.
              </p>
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
              Abrir no Google Maps
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
              src="https://www.google.com/maps?q=-23.327639,-46.599111&z=16&output=embed"
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
