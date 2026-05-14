import type { Metadata } from 'next'
import Image from 'next/image'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Nossa História — Natacha & Mauricio',
  description: 'A história de amor de Natacha e Mauricio, do primeiro encontro ao altar.',
}

export default function HistoriaPage() {
  return (
    <div className="min-h-screen" style={{ background: '#FBF2E8' }}>

      {/* ── HERO ──────────────────────────────────────────────── */}
      <PageHero
        src="/images/book1.png"
        eyebrow="Do universo para cá"
        title="Nossa História"
        subtitle="Dois corpos em órbitas diferentes dentro da mesma galáxia — até que o universo finalmente alinhou tudo."
        minHeight="min-h-[65vh]"
        objectPosition="bottom"
      />

      {/* ── FASE 1: O INÍCIO ──────────────────────────────────── */}
      <section className="py-24 px-5" style={{ background: '#FBF2E8' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">

            {/* Text */}
            <AnimatedSection direction="left" className="flex flex-col gap-6 order-2 md:order-1">
              <div>
                <p
                  className="text-[0.6rem] tracking-[0.45em] uppercase mb-3"
                  style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
                >
                  Antes de 2021
                </p>
                <h2
                  className="text-4xl md:text-5xl font-light leading-tight"
                  style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
                >
                  O Início
                </h2>
                <div className="divider-sunset w-12 mt-5 mb-6" />
              </div>
              {[
                'Como toda boa história, essa também começou antes mesmo de acontecer — e contou, desde o início, com a participação especial de uma fada madrinha: Deise.',
                'Por anos, Mau e Nat foram como dois corpos em órbitas diferentes dentro da mesma galáxia. Estavam sempre por perto, atravessando os mesmos caminhos, compartilhando histórias em comum, mas nunca no mesmo tempo.',
                'Entre fases distintas, escolhas desencontradas e jeitos quase opostos de viver, foram muitos "quases". E, ainda assim, algo sempre os mantinha ali — próximos o suficiente para não se perderem completamente.',
              ].map((p, i) => (
                <p
                  key={i}
                  className="text-sm md:text-base leading-[1.95]"
                  style={{ fontFamily: 'var(--font-montserrat)', color: '#4A2E1A' }}
                >
                  {p}
                </p>
              ))}
            </AnimatedSection>

            {/* Image — large, breaking the grid */}
            <AnimatedSection direction="right" className="order-1 md:order-2">
              <div
                className="relative rounded-2xl overflow-hidden group"
                style={{ aspectRatio: '3/4', boxShadow: '0 20px 60px rgba(26,16,10,0.18)' }}
              >
                <Image
                  src="/images/book2.png"
                  alt="Natacha e Mauricio"
                  fill
                  className="object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
                  quality={80}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, transparent 55%, rgba(26,16,10,0.45) 100%)',
                  }}
                />
                <div className="absolute bottom-5 right-5">
                  <p
                    className="text-[0.52rem] tracking-[0.4em] uppercase"
                    style={{ color: '#E2C09A', fontFamily: 'var(--font-montserrat)' }}
                  >
                    Antes de 2021
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── EDITORIAL BREAK: PHASE 2 DUAL IMAGES ─────────────── */}
      <section
        className="py-20 px-5 overflow-hidden"
        style={{ background: '#F4E5D0' }}
      >
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="grid grid-cols-3 gap-4 md:gap-6 items-end">
              {/* Tall image left */}
              <div
                className="col-span-2 relative rounded-2xl overflow-hidden group"
                style={{ aspectRatio: '4/3', boxShadow: '0 20px 60px rgba(26,16,10,0.15)' }}
              >
                <Image
                  src="/images/book3.png"
                  alt="O gesto das suculentas"
                  fill
                  className="object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
                  quality={78}
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(180deg, transparent 40%, rgba(26,16,10,0.6) 100%)',
                  }}
                />
                <div className="absolute bottom-6 left-6">
                  <p
                    className="text-2xl md:text-3xl font-light text-white"
                    style={{ fontFamily: 'var(--font-cormorant)' }}
                  >
                    O Gesto
                  </p>
                  <p
                    className="text-[0.55rem] tracking-[0.4em] uppercase mt-1"
                    style={{ color: '#E2C09A', fontFamily: 'var(--font-montserrat)' }}
                  >
                    2021
                  </p>
                </div>
              </div>

              {/* Small image right — offset */}
              <div className="flex flex-col gap-4">
                <div
                  className="relative rounded-2xl overflow-hidden group"
                  style={{ aspectRatio: '3/4', boxShadow: '0 12px 36px rgba(26,16,10,0.12)' }}
                >
                  <Image
                    src="/images/book4.png"
                    alt="Natacha e Mauricio"
                    fill
                    className="object-cover object-bottom transition-transform duration-700 group-hover:scale-105"
                    quality={78}
                  />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'rgba(196,103,58,0.12)' }}
                  />
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Phase 2 text */}
          <AnimatedSection delay={0.15} className="mt-14 max-w-3xl mx-auto text-center">
            <div className="divider-sunset w-16 mx-auto mb-6" />
            {[
              'Em 2021, em meio a um dos momentos mais delicados da vida dela, Mau apareceu de um jeito inesperado: com um arranjo de suculentas feito por ele.',
              'Um gesto silencioso, mas cheio de intenção. Pequeno no tamanho, mas grande o suficiente para mudar — de forma sutil, como Nat passou a enxergar Mau.',
              'Ainda não era o momento. Mas, de algum jeito, já era o começo.',
            ].map((p, i) => (
              <p
                key={i}
                className="text-sm md:text-base leading-[1.95] mb-4"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#4A2E1A' }}
              >
                {p}
              </p>
            ))}
          </AnimatedSection>
        </div>
      </section>

      {/* ── FASE 3: O ENCONTRO — FULL BLEED IMAGE ────────────── */}
      <section className="relative overflow-hidden" style={{ minHeight: '75vh' }}>
        <div className="absolute inset-0">
          <Image
            src="/images/book6.png"
            alt="O encontro no carnaval"
            fill
            className="object-cover object-top"
            quality={82}
          />
        </div>

        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              180deg,
              rgba(26,16,10,0.25) 0%,
              rgba(180,90,40,0.15) 35%,
              rgba(26,16,10,0.72) 100%
            )`,
          }}
        />

        <div className="relative z-10 flex flex-col justify-end h-full min-h-[75vh] px-5 pb-20 pt-32">
          <div className="max-w-6xl mx-auto w-full">
            <AnimatedSection direction="up">
              <div className="max-w-lg">
                <p
                  className="text-[0.6rem] tracking-[0.45em] uppercase mb-3"
                  style={{ color: '#E2C09A', fontFamily: 'var(--font-montserrat)' }}
                >
                  Fevereiro de 2023
                </p>
                <h2
                  className="text-4xl md:text-6xl font-light text-white leading-tight mb-5"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  O Encontro
                </h2>
                <div className="divider-sunset w-12 mb-6" />
                <p
                  className="text-white/75 text-sm md:text-base leading-[1.95]"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  No meio de um bloco de carnaval, entre chuva, música da Marília Mendonça que eles não se lembram qual era, e o caos bonito das ruas, eles se encontraram de verdade.
                </p>
                <p
                  className="text-white/75 text-sm md:text-base leading-[1.95] mt-3"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  De mãos dadas — como se, no fundo, já soubessem — caminharam juntos até o primeiro beijo, ali, no meio da Rua da Consolação.
                </p>
                <p
                  className="mt-4 text-[0.72rem] italic"
                  style={{ color: '#E2C09A', fontFamily: 'var(--font-montserrat)' }}
                >
                  (Existe uma forte evidência de que ainda haja glitter daquele dia espalhado pela casa até hoje.)
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── FASE 4: O LAR — DUAL IMAGES ──────────────────────── */}
      <section className="py-24 px-5" style={{ background: '#FBF2E8' }}>
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="grid md:grid-cols-5 gap-6 items-start mb-16">
            {/* book7 — larger */}
            <div
              className="md:col-span-3 relative rounded-2xl overflow-hidden group"
              style={{ aspectRatio: '4/3', boxShadow: '0 20px 60px rgba(26,16,10,0.15)' }}
            >
              <Image
                src="/images/book7.png"
                alt="Construindo um lar juntos"
                fill
                className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                quality={80}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(180deg, transparent 50%, rgba(26,16,10,0.4) 100%)',
                }}
              />
            </div>

            {/* book8 — right column */}
            <div className="md:col-span-2 flex flex-col gap-6 md:pt-16">
              <div
                className="relative rounded-2xl overflow-hidden group"
                style={{ aspectRatio: '3/4', boxShadow: '0 16px 48px rgba(26,16,10,0.12)' }}
              >
                <Image
                  src="/images/book8.png"
                  alt="O nosso lar"
                  fill
                  className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                  quality={80}
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'rgba(196,103,58,0.1)' }}
                />
              </div>
            </div>
          </AnimatedSection>

          {/* Phase 4 text */}
          <AnimatedSection delay={0.15} className="grid md:grid-cols-2 gap-12">
            <div className="flex flex-col gap-5">
              <p
                className="text-[0.6rem] tracking-[0.45em] uppercase"
                style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
              >
                O Lar
              </p>
              <h2
                className="text-4xl font-light"
                style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
              >
                Dias depois, um macarrão com camarão
              </h2>
              <div className="divider-sunset w-12" />
              <p
                className="text-sm leading-[1.95]"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#4A2E1A' }}
              >
                Preparado por Mau, marcou o início de uma nova fase. Mais do que um prato, foi um gesto — de cuidado, de presença, de quem já não queria mais ir embora.
              </p>
              <p
                className="text-sm leading-[1.95]"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#4A2E1A' }}
              >
                Sem grandes anúncios, sem precisar explicar muito, eles simplesmente ficaram. Como quem finalmente entende que não precisa mais procurar.
              </p>
            </div>
            <div className="flex flex-col gap-5 md:pt-10">
              <p
                className="text-sm leading-[1.95]"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#4A2E1A' }}
              >
                Hoje, Mau e Nat constroem, juntos, uma vida. Entre rotinas, risadas e aprendizados, formaram uma família — com suas filhas — que se tornou o centro de tudo aquilo que mais importa.
              </p>
              <p
                className="text-sm leading-[1.95]"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#4A2E1A' }}
              >
                O cuidado, a parceria, o amor e o desejo de uma vida simples, leve e cheia de significado.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── QUOTE FINAL ──────────────────────────────────────── */}
      <section
        className="relative py-28 px-5 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #E2C09A 0%, #C8924A 45%, #C4673A 100%)' }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 60%, rgba(255,255,255,0.12) 0%, transparent 55%)',
          }}
        />

        <AnimatedSection className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8">
          <p
            className="text-[0.6rem] tracking-[0.45em] uppercase"
            style={{ color: 'rgba(26,16,10,0.55)', fontFamily: 'var(--font-montserrat)' }}
          >
            E assim
          </p>
          <blockquote
            className="text-3xl md:text-5xl font-light leading-relaxed"
            style={{ fontFamily: 'var(--font-cormorant)', color: '#1A100A' }}
          >
            "O casamento não é o começo dessa história. É a celebração de tudo o que já foi construído — e de tudo o que ainda está por vir."
          </blockquote>
          <div
            className="w-16 h-px"
            style={{ background: 'rgba(26,16,10,0.3)' }}
          />
          <p
            className="text-sm italic"
            style={{ color: 'rgba(26,16,10,0.6)', fontFamily: 'var(--font-cormorant)' }}
          >
            E, desde então, seguem juntos. No mesmo tempo. No mesmo caminho.
          </p>
        </AnimatedSection>
      </section>
    </div>
  )
}
