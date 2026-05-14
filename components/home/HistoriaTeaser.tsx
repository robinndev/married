import Link from 'next/link'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function HistoriaTeaser() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FBF2E8 0%, #F4E5D0 100%)' }}
    >
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-stretch min-h-[520px] md:min-h-[580px]">

        {/* ── Left: text ────────────────────────────────────── */}
        <AnimatedSection direction="right" className="flex flex-col justify-center px-8 md:px-16 py-20 gap-7">
          <p
            className="text-[0.55rem] tracking-[0.52em] uppercase"
            style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
          >
            Nossa Jornada
          </p>

          <h2
            className="text-5xl md:text-6xl font-light leading-[0.9]"
            style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
          >
            A Nossa
            <br />
            <span style={{ color: '#C8924A' }}>História</span>
          </h2>

          <div className="divider-sunset w-12" />

          <p
            className="text-sm leading-[1.85] max-w-sm"
            style={{ fontFamily: 'var(--font-montserrat)', color: '#6A4A30' }}
          >
            Dois corpos em órbitas diferentes dentro da mesma galáxia — até que o universo finalmente alinhou tudo. Uma fada madrinha, muitos quases e um encontro que mudou tudo.
          </p>

          <Link
            href="/historia"
            className="group inline-flex items-center gap-3 w-fit mt-2 text-[0.68rem] tracking-[0.22em] uppercase transition-all duration-300"
            style={{ fontFamily: 'var(--font-montserrat)', color: '#C8924A' }}
          >
            <span
              className="px-7 py-3.5 rounded-xl transition-all duration-300 group-hover:scale-105"
              style={{
                background: 'linear-gradient(135deg, #C8924A, #C4673A)',
                color: '#FBF2E8',
                boxShadow: '0 4px 20px rgba(200,146,74,0.3)',
              }}
            >
              Ler nossa história
            </span>
            <span
              className="text-lg transition-transform duration-300 group-hover:translate-x-1.5"
              style={{ color: '#C8924A' }}
            >
              →
            </span>
          </Link>
        </AnimatedSection>

        {/* ── Right: photo ──────────────────────────────────── */}
        <AnimatedSection direction="left" className="relative min-h-[320px] md:min-h-0">
          <Image
            src="/images/book1.png"
            alt="Natacha e Mauricio — Nossa História"
            fill
            className="object-cover object-bottom"
            quality={82}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          {/* Cinematic overlay */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(270deg, rgba(26,16,10,0.08) 0%, rgba(26,16,10,0.35) 100%)',
            }}
          />
          {/* Warm sunset glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(180deg, transparent 50%, rgba(196,103,58,0.22) 100%)',
            }}
          />
          {/* Left fade into text section on desktop */}
          <div
            className="absolute inset-y-0 left-0 w-24 hidden md:block"
            style={{
              background:
                'linear-gradient(90deg, rgba(244,229,208,0.9) 0%, transparent 100%)',
            }}
          />
        </AnimatedSection>
      </div>
    </section>
  )
}
