'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageHero from '@/components/ui/PageHero'
import PIXSection from './PIXSection'
import giftsData from '@/mocks/gifts.json'
import type { Gift } from '@/types'
import { GIFT_CATEGORIES, PIX_KEY, PIX_DISPLAY, PIX_NAME } from '@/constants'
import { logGiftClick } from '@/lib/firestore'

const allGifts: Gift[] = giftsData as Gift[]

function formatBRL(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

const inputStyle = {
  background: 'rgba(251,242,232,0.8)',
  border: '1px solid rgba(200,146,74,0.22)',
  color: '#2A1A0F',
  fontFamily: 'var(--font-montserrat)',
  outline: 'none',
}

// ── Mercado Pago badge ────────────────────────────────────
function MpBadge({ large }: { large?: boolean }) {
  return (
    <div
      className="inline-flex items-center gap-2 rounded-full shrink-0"
      style={{
        background: 'linear-gradient(135deg, #00186A 0%, #009EE3 100%)',
        padding: large ? '7px 16px' : '5px 12px',
      }}
    >
      <svg width={large ? 14 : 12} height={large ? 14 : 12} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.2" />
        <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        className="text-white font-semibold uppercase tracking-widest"
        style={{ fontSize: large ? '0.65rem' : '0.55rem', fontFamily: 'var(--font-montserrat)' }}
      >
        Mercado Pago
      </span>
    </div>
  )
}

// ── Payment modal ─────────────────────────────────────────
type PayStep = 'choose' | 'pix' | 'card'

interface PaymentModalProps {
  gift: Gift
  onClose: () => void
}

function PaymentModal({ gift, onClose }: PaymentModalProps) {
  const pixOnly = gift.price < 100
  const [step, setStep] = useState<PayStep>(pixOnly ? 'pix' : 'choose')
  const [copied, setCopied] = useState(false)
  const [cardLoading, setCardLoading] = useState(false)
  const [cardError, setCardError] = useState<string | null>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY)
      setCopied(true)
      setTimeout(() => setCopied(false), 2800)
    } catch {
      alert(`Chave PIX: ${PIX_DISPLAY}`)
    }
  }

  const payByCard = async () => {
    setCardLoading(true)
    setCardError(null)
    try {
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'gift', id: gift.id }),
      })
      const data: { init_point?: string; error?: string } = await res.json()
      if (!res.ok || !data.init_point) {
        setCardError(data.error ?? 'Erro ao processar. Tente novamente.')
        setCardLoading(false)
        return
      }
      window.location.href = data.init_point
    } catch {
      setCardError('Erro de conexão. Verifique sua internet.')
      setCardLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(26,16,10,0.72)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22 }}
        className="w-full max-w-md rounded-3xl overflow-hidden relative"
        style={{
          background: '#FBF2E8',
          border: '1px solid rgba(200,146,74,0.2)',
          boxShadow: '0 32px 80px rgba(26,16,10,0.4)',
        }}
      >
        {/* Modal header */}
        <div
          className="px-7 pt-7 pb-5"
          style={{ borderBottom: '1px solid rgba(200,146,74,0.12)' }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1 min-w-0">
              <p
                className="text-[0.48rem] tracking-[0.38em] uppercase"
                style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
              >
                Dar este presente
              </p>
              <h3
                className="text-2xl font-light leading-tight"
                style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
              >
                {gift.name}
              </h3>
              <p
                className="text-xl font-light mt-0.5"
                style={{ fontFamily: 'var(--font-cormorant)', color: '#C8924A' }}
              >
                {formatBRL(gift.price)}
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{
                background: 'rgba(200,146,74,0.1)',
                color: '#8A6A50',
                fontFamily: 'var(--font-montserrat)',
                fontSize: '0.75rem',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Modal body */}
        <div className="px-7 py-6">
          <AnimatePresence mode="wait">

            {/* ── Choose step ── */}
            {step === 'choose' && (
              <motion.div
                key="choose"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col gap-4"
              >
                <p
                  className="text-xs text-center"
                  style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                >
                  Como você prefere pagar?
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {/* PIX option */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setStep('pix')}
                    className="flex flex-col items-center gap-3 rounded-2xl p-5 transition-all duration-200"
                    style={{
                      background: 'rgba(0,158,227,0.05)',
                      border: '2px solid rgba(0,158,227,0.2)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,158,227,0.45)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(0,158,227,0.2)')}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ background: 'rgba(0,158,227,0.1)' }}
                    >
                      📱
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className="text-sm font-medium"
                        style={{ fontFamily: 'var(--font-montserrat)', color: '#2A1A0F' }}
                      >
                        PIX
                      </span>
                      <span
                        className="text-[0.5rem] tracking-wide text-center"
                        style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                      >
                        Instantâneo · Qualquer banco
                      </span>
                    </div>
                    <MpBadge />
                  </motion.button>

                  {/* Card option */}
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={payByCard}
                    className="flex flex-col items-center gap-3 rounded-2xl p-5 transition-all duration-200"
                    style={{
                      background: 'rgba(0,158,227,0.04)',
                      border: '2px solid rgba(0,158,227,0.18)',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(0,158,227,0.4)')}
                    onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(0,158,227,0.18)')}
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                      style={{ background: 'rgba(0,158,227,0.08)' }}
                    >
                      💳
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className="text-sm font-medium"
                        style={{ fontFamily: 'var(--font-montserrat)', color: '#2A1A0F' }}
                      >
                        Cartão
                      </span>
                      <span
                        className="text-[0.5rem] tracking-wide text-center"
                        style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                      >
                        Parcelado em até 12x
                      </span>
                    </div>
                    <MpBadge />
                  </motion.button>
                </div>

                {cardError && (
                  <p className="text-xs text-center" style={{ color: '#C4673A', fontFamily: 'var(--font-montserrat)' }}>
                    {cardError}
                  </p>
                )}
              </motion.div>
            )}

            {/* ── PIX step ── */}
            {step === 'pix' && (
              <motion.div
                key="pix"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col gap-5"
              >
                {!pixOnly && (
                  <button
                    onClick={() => setStep('choose')}
                    className="self-start text-[0.52rem] tracking-widest uppercase transition-opacity hover:opacity-60"
                    style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                  >
                    ← Voltar
                  </button>
                )}

                {/* PIX card */}
                <div
                  className="rounded-2xl p-5 flex flex-col gap-4"
                  style={{
                    background: 'linear-gradient(135deg, #00186A 0%, #009EE3 100%)',
                    border: '1px solid rgba(0,158,227,0.3)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <p
                      className="text-[0.48rem] tracking-[0.35em] uppercase"
                      style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Chave PIX
                    </p>
                    <MpBadge large />
                  </div>

                  <div className="flex flex-col gap-1">
                    <p
                      className="text-xl font-light tracking-wide break-all"
                      style={{ color: '#fff', fontFamily: 'var(--font-cormorant)' }}
                    >
                      {PIX_DISPLAY}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-montserrat)' }}
                    >
                      {PIX_NAME}
                    </p>
                  </div>

                  <div
                    className="h-px w-full"
                    style={{ background: 'rgba(255,255,255,0.15)' }}
                  />

                  <div className="flex items-center justify-between gap-2">
                    <p
                      className="text-xs"
                      style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Valor sugerido:{' '}
                      <span style={{ color: '#fff', fontWeight: 600 }}>{formatBRL(gift.price)}</span>
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={copy}
                      className="px-5 py-2 rounded-xl text-[0.58rem] tracking-[0.18em] uppercase transition-all duration-300"
                      style={{
                        background: copied
                          ? 'linear-gradient(135deg, #5A8A4A, #3A6A2E)'
                          : 'rgba(255,255,255,0.2)',
                        color: '#fff',
                        fontFamily: 'var(--font-montserrat)',
                        border: '1px solid rgba(255,255,255,0.3)',
                      }}
                    >
                      {copied ? '✓ Copiado!' : 'Copiar Chave'}
                    </motion.button>
                  </div>
                </div>

                <p
                  className="text-xs text-center leading-relaxed"
                  style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                >
                  Abra o app do seu banco, escolha PIX e cole a chave.
                  <br />
                  Obrigado pelo carinho! ♥
                </p>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Card loading overlay */}
          <AnimatePresence>
            {cardLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-3xl"
                style={{ background: 'rgba(251,242,232,0.96)' }}
              >
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block', fontSize: '1.5rem', color: '#009EE3' }}
                >
                  ◌
                </motion.span>
                <p className="text-xs" style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}>
                  Redirecionando para o checkout...
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Category label helpers ────────────────────────────────
const CATEGORY_LABELS: Record<string, string> = {
  'Lua de Mel': '🌊 Lua de Mel',
  'Simbólico': '🎁 Simbólico',
  'Destaques': '✦ Destaques',
}

function catLabel(cat: string) {
  return CATEGORY_LABELS[cat] ?? cat
}

// ── Main component ────────────────────────────────────────
export default function GiftsClient() {
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [payingGift, setPayingGift] = useState<Gift | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let base: Gift[]
    if (category === 'Destaques') base = allGifts.filter((g) => g.featured)
    else if (category === 'Lua de Mel') base = allGifts.filter((g) => g.category === 'Lua de Mel')
    else if (category === 'Todos') base = allGifts
    else base = allGifts.filter((g) => g.category === category)

    if (!search.trim()) return base
    const q = search.toLowerCase()
    return base.filter(
      (g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
    )
  }, [category, search])

  const openPayment = (gift: Gift) => {
    setPayingGift(gift)
    logGiftClick(gift.id, gift.name, gift.price).catch(() => {})
  }

  return (
    <div className="min-h-screen" style={{ background: '#FBF2E8' }}>
      {/* ── Hero ── */}
      <PageHero
        src="/images/book2.png"
        eyebrow="Com amor"
        title="Lista de Presentes"
        subtitle="Cada presente é uma forma carinhosa de fazer parte da construção do nosso lar."
        objectPosition="bottom"
      />

      {/* ── PIX + Lua de Mel callout ── */}
      <div style={{ background: 'linear-gradient(180deg, #FBF2E8 0%, #F4E5D0 100%)' }}>
        <PIXSection />

        <AnimatedSection>
          <div className="max-w-5xl mx-auto px-5 pt-6 pb-2">
            <div
              className="rounded-xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5"
              style={{
                background: 'rgba(200,146,74,0.07)',
                border: '1px solid rgba(200,146,74,0.2)',
              }}
            >
              <span style={{ fontSize: '1.2rem' }}>🌊</span>
              <div>
                <p className="text-xs font-medium" style={{ fontFamily: 'var(--font-montserrat)', color: '#2A1A0F' }}>
                  Lua de mel na Bahia — Morro de São Paulo
                </p>
                <p className="text-[0.65rem] mt-0.5" style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}>
                  Presenteie com experiências que viram memórias: passeios, mergulhos, jantares e muito mais.
                </p>
              </div>
              <button
                onClick={() => setCategory('Lua de Mel')}
                className="sm:ml-auto flex-shrink-0 text-[0.6rem] tracking-[0.18em] uppercase px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #C8924A, #C4673A)',
                  color: '#FBF2E8',
                  fontFamily: 'var(--font-montserrat)',
                  boxShadow: '0 2px 12px rgba(200,146,74,0.28)',
                }}
              >
                Ver presentes de viagem
              </button>
            </div>
          </div>
        </AnimatedSection>
      </div>

      {/* ── Sticky filter bar ── */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: 'rgba(251,242,232,0.94)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(200,146,74,0.12)',
        }}
      >
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row gap-3">
          <div className="relative sm:max-w-xs w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#C8924A' }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm transition-colors"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.22)')}
            />
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            {GIFT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-[0.6rem] tracking-[0.14em] uppercase transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  background: category === cat ? 'linear-gradient(135deg, #C8924A, #C4673A)' : 'rgba(251,242,232,0.9)',
                  color: category === cat ? '#FBF2E8' : '#8A6A50',
                  border: `1px solid ${category === cat ? 'transparent' : 'rgba(200,146,74,0.2)'}`,
                  boxShadow: category === cat ? '0 2px 10px rgba(200,146,74,0.28)' : 'none',
                }}
              >
                {catLabel(cat)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-5xl mx-auto px-4 py-10 pb-28">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((gift) => (
              <GiftCard
                key={gift.id}
                gift={gift}
                onBuy={() => openPayment(gift)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="text-4xl font-light mb-3" style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}>
              Nenhum presente encontrado
            </p>
            <p className="text-sm" style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}>
              Tente outra busca ou categoria
            </p>
          </div>
        )}
      </div>

      {/* ── Payment modal ── */}
      <AnimatePresence>
        {payingGift && (
          <PaymentModal
            gift={payingGift}
            onClose={() => setPayingGift(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Error toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl"
            style={{
              background: '#1A100A',
              border: '1px solid rgba(196,103,58,0.4)',
              boxShadow: '0 8px 32px rgba(26,16,10,0.5)',
              maxWidth: 'calc(100vw - 2rem)',
            }}
          >
            <span style={{ color: '#C4673A', fontSize: '1rem' }}>⚠</span>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.8)', fontFamily: 'var(--font-montserrat)' }}>
              {toast}
            </p>
            <button
              onClick={() => setToast(null)}
              className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
              style={{ color: '#E2C09A', fontSize: '0.8rem' }}
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Gift Card ─────────────────────────────────────────────
interface GiftCardProps {
  gift: Gift
  onBuy: () => void
}

function GiftCard({ gift, onBuy }: GiftCardProps) {
  const [hovered, setHovered] = useState(false)
  const isLuaMel = gift.category === 'Lua de Mel'
  const isSymbolic = gift.category === 'Simbólico'

  const badgeLabel = isLuaMel ? '🌊 Lua de Mel' : isSymbolic ? '🎁 Simbólico' : gift.category
  const badgeBg = isLuaMel
    ? 'rgba(26,16,10,0.75)'
    : isSymbolic
    ? 'rgba(196,103,58,0.82)'
    : 'rgba(200,146,74,0.82)'

  return (
    <motion.div
      className="flex flex-col rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: '#fff',
        border: `1px solid ${hovered ? 'rgba(200,146,74,0.35)' : 'rgba(200,146,74,0.14)'}`,
        boxShadow: hovered
          ? '0 16px 48px rgba(200,146,74,0.2), 0 0 0 1px rgba(200,146,74,0.22)'
          : '0 2px 12px rgba(26,16,10,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        transition: 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
      onClick={onBuy}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image — fixed aspect ratio */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '65%' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gift.image}
          alt={gift.name}
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: gift.imageFit ?? 'cover',
            objectPosition: 'center',
            transform: hovered ? 'scale(1.07)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)',
          }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(26,16,10,0.06) 0%, transparent 30%, rgba(26,16,10,0.52) 100%)',
          }}
        />

        {/* Category badge */}
        <div className="absolute top-2.5 left-2.5">
          <span
            className="text-[0.44rem] px-2 py-0.5 rounded-full tracking-[0.14em] uppercase"
            style={{
              background: badgeBg,
              color: '#FBF2E8',
              fontFamily: 'var(--font-montserrat)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {badgeLabel}
          </span>
        </div>

        {/* Price — bottom right */}
        <div className="absolute bottom-2.5 right-2.5">
          <span
            className="text-base font-light"
            style={{
              fontFamily: 'var(--font-cormorant)',
              color: '#fff',
              textShadow: '0 1px 8px rgba(26,16,10,0.8)',
            }}
          >
            {formatBRL(gift.price)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-3.5 gap-2">
        <h3
          className="text-[1rem] font-light leading-snug"
          style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
        >
          {gift.name}
        </h3>
        <p
          className="text-[0.6rem] leading-relaxed flex-1"
          style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
        >
          {gift.description}
        </p>

        {/* CTA */}
        <div className="pt-2.5 mt-auto flex flex-col gap-1.5" style={{ borderTop: '1px solid rgba(200,146,74,0.1)' }}>
          <div
            className="w-full py-2 rounded-lg flex items-center justify-center gap-1.5 text-[0.55rem] tracking-[0.16em] uppercase transition-all duration-300"
            style={{
              background: hovered
                ? 'linear-gradient(135deg, #C8924A, #C4673A)'
                : 'rgba(200,146,74,0.08)',
              color: hovered ? '#FBF2E8' : '#C8924A',
              fontFamily: 'var(--font-montserrat)',
              border: `1px solid ${hovered ? 'transparent' : 'rgba(200,146,74,0.2)'}`,
              boxShadow: hovered ? '0 3px 12px rgba(200,146,74,0.28)' : 'none',
            }}
          >
            <span>Dar este presente</span>
            <span style={{ opacity: hovered ? 1 : 0.5 }}>→</span>
          </div>

          {/* Payment hint */}
          <div className="flex items-center justify-center gap-1.5">
            <span
              className="text-[0.42rem] tracking-[0.1em] uppercase"
              style={{ color: 'rgba(138,106,80,0.55)', fontFamily: 'var(--font-montserrat)' }}
            >
              PIX
            </span>
            {gift.price >= 100 && (
              <>
                <span style={{ color: 'rgba(138,106,80,0.3)', fontSize: '0.45rem' }}>·</span>
                <span
                  className="text-[0.42rem] tracking-[0.1em] uppercase"
                  style={{ color: 'rgba(138,106,80,0.55)', fontFamily: 'var(--font-montserrat)' }}
                >
                  Cartão em até {Math.min(12, Math.floor(gift.price / 50))}x
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
