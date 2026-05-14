import type { Metadata } from 'next'
import {
  CheckCircle2,
  Ticket,
  Clock,
  Heart,
  Camera,
  VolumeX,
  Sparkles,
  UtensilsCrossed,
  Gift,
  DoorOpen,
  Palette,
  MessageCircle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageHero from '@/components/ui/PageHero'

export const metadata: Metadata = {
  title: 'Manual dos Convidados — Natacha & Mauricio',
  description: 'Tudo que você precisa saber para o casamento de Natacha e Mauricio.',
}

interface Item {
  Icon: LucideIcon
  title: string
  description: string
}

const items: Item[] = [
  {
    Icon: CheckCircle2,
    title: 'Confirmação',
    description:
      'Confirme sua presença até 15/07/2026 através da seção "Confirmar Presença" neste site. Isso nos ajuda a organizar tudo com carinho para você.',
  },
  {
    Icon: Ticket,
    title: 'Convite Individual',
    description:
      'O convite é pessoal e intransferível. Pedimos que apenas os convidados listados compareçam, para que possamos garantir o conforto de todos.',
  },
  {
    Icon: Clock,
    title: 'Pontualidade',
    description:
      'A cerimônia inicia às 15h em ponto. Chegue com pelo menos 20 minutos de antecedência para se acomodar com tranquilidade.',
  },
  {
    Icon: Heart,
    title: 'Cerimônia',
    description:
      'Durante a cerimônia, pedimos silêncio e respeito ao momento. Desligue ou silencie o celular e curta cada detalhe ao vivo.',
  },
  {
    Icon: Camera,
    title: 'Registros',
    description:
      'Fique à vontade para registrar os momentos! Mas durante a troca de alianças e votos, respeite o trabalho do fotógrafo profissional.',
  },
  {
    Icon: VolumeX,
    title: 'Silêncio',
    description:
      'Mantenha conversas baixas durante a cerimônia. Cada palavra dita pelos noivos é especial e merece ser ouvida por todos.',
  },
  {
    Icon: Sparkles,
    title: 'Diversão',
    description:
      'A festa é para celebrar! Dance, ria, abrace e faça memórias. Queremos que você se sinta em casa durante toda a celebração.',
  },
  {
    Icon: UtensilsCrossed,
    title: 'Doces',
    description:
      'Teremos mesa de doces e bolo. Aguarde o momento do corte do bolo para que todos possam compartilhar esse instante especial.',
  },
  {
    Icon: Gift,
    title: 'Lembranças',
    description:
      'Preparamos uma lembrança especial para cada convidado. Não esqueça de pegar a sua antes de ir embora!',
  },
  {
    Icon: DoorOpen,
    title: 'Despedida',
    description:
      'Ao final da festa, nos ajude a encerrar com amor: despeça-se dos noivos e aproveite o buquê e as lembranças finais.',
  },
  {
    Icon: Palette,
    title: 'Cores Restritas',
    description:
      'Pedimos que evitem usar branco, creme e dourado puro — essas cores são reservadas para a noiva. Aposte em tons vibrantes ou neutros!',
  },
  {
    Icon: MessageCircle,
    title: 'Mural',
    description:
      'Deixe um recado especial na seção de Recados deste site. Sua mensagem ficará guardada para sempre no coração dos noivos.',
  },
]

export default function ManualPage() {
  return (
    <div className="min-h-screen" style={{ background: '#FBF2E8' }}>
      {/* ── Hero with photo ──────────────────────────────────── */}
      <PageHero
        src="/images/book3.png"
        eyebrow="Para os nossos queridos convidados"
        title="Manual dos Convidados"
        subtitle="Algumas dicas e regrinhas para tornar o nosso dia ainda mais especial."
      />

      {/* ── Cards grid ───────────────────────────────────────── */}
      <div
        className="relative"
        style={{ background: 'linear-gradient(180deg, #FBF2E8 0%, #F4E5D0 100%)' }}
      >
        <div className="max-w-6xl mx-auto px-5 py-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map(({ Icon, title, description }, i) => (
              <AnimatedSection key={title} delay={i * 0.05}>
                <div
                  className="group flex gap-5 p-7 rounded-2xl h-full transition-all duration-500 hover:-translate-y-1"
                  style={{
                    background: 'rgba(255,255,255,0.6)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(200,146,74,0.15)',
                    boxShadow: '0 4px 24px rgba(26,16,10,0.05)',
                  }}
                >
                  {/* Icon */}
                  <div
                    className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: 'linear-gradient(135deg, #C8924A, #C4673A)',
                      boxShadow: '0 4px 16px rgba(200,146,74,0.28)',
                    }}
                  >
                    <Icon size={18} color="#FBF2E8" strokeWidth={1.5} />
                  </div>

                  <div className="flex flex-col gap-2 flex-1 min-w-0">
                    <h3
                      className="text-xl font-light"
                      style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
                    >
                      {title}
                    </h3>
                    <div className="divider-sunset w-8" />
                    <p
                      className="text-xs leading-relaxed"
                      style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
                    >
                      {description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </div>

      {/* ── Dress code — warm premium ─────────────────────────── */}
      <section
        className="relative py-24 px-5 overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #E2C09A 0%, #C8924A 40%, #C4673A 100%)',
        }}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 60%, rgba(255,255,255,0.12) 0%, transparent 55%)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <p
              className="text-[0.6rem] tracking-[0.5em] uppercase mb-5"
              style={{ color: 'rgba(26,16,10,0.55)', fontFamily: 'var(--font-montserrat)' }}
            >
              Dress Code
            </p>
            <h2
              className="text-5xl md:text-6xl font-light leading-tight mb-5"
              style={{ fontFamily: 'var(--font-cormorant)', color: '#1A100A' }}
            >
              Traje: Esporte Fino
            </h2>
            <div
              className="w-16 h-px mx-auto mb-8"
              style={{ background: 'rgba(26,16,10,0.3)' }}
            />
            <p
              className="text-sm leading-relaxed max-w-xl mx-auto mb-4"
              style={{ color: 'rgba(26,16,10,0.72)', fontFamily: 'var(--font-montserrat)' }}
            >
              Queremos que você se sinta confortável e elegante! Recomendamos vestidos leves para mulheres e calça social com camisa para homens (paletó/gravata opcionais).
            </p>
            <p
              className="text-xs italic"
              style={{ color: 'rgba(26,16,10,0.55)', fontFamily: 'var(--font-montserrat)' }}
            >
              Dica: O local possui áreas gramadas — evite saltos muito finos.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Footer badge ─────────────────────────────────────── */}
      <div className="text-center py-10 px-5" style={{ background: '#F4E5D0' }}>
        <AnimatedSection>
          <p
            className="text-sm italic tracking-widest"
            style={{ color: '#8A6A50', fontFamily: 'var(--font-cormorant)' }}
          >
            01 · 08 · 2026 — Mairiporã, SP
          </p>
        </AnimatedSection>
      </div>
    </div>
  )
}
