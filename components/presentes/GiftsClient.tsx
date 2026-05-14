'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageHero from '@/components/ui/PageHero'
import PIXSection from './PIXSection'
import giftsData from '@/mocks/gifts.json'
import type { Gift } from '@/types'
import { GIFT_CATEGORIES } from '@/constants'

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

export default function GiftsClient() {
  const [category, setCategory] = useState('Todos')
  const [search, setSearch] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)
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

  const buyGift = async (gift: Gift) => {
    if (loadingId) return
    setLoadingId(gift.id)
    setToast(null)

    try {
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'gift', id: gift.id }),
      })
      const data: { init_point?: string; error?: string } = await res.json()

      if (!res.ok || !data.init_point) {
        setToast(data.error ?? 'Erro ao processar. Tente novamente.')
        return
      }

      window.location.href = data.init_point
    } catch {
      setToast('Erro de conexão. Verifique sua internet e tente novamente.')
    } finally {
      setLoadingId(null)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#FBF2E8' }}>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <PageHero
        src="/images/book2.png"
        eyebrow="Com amor"
        title="Lista de Presentes"
        subtitle="Cada presente é uma forma carinhosa de fazer parte da construção do nosso lar."
      />

      {/* ── PIX + Lua de Mel callout ──────────────────────────── */}
      <div style={{ background: 'linear-gradient(180deg, #FBF2E8 0%, #F4E5D0 100%)' }}>
        <PIXSection />

        <AnimatedSection>
          <div className="max-w-4xl mx-auto px-5 pt-6 pb-2">
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
                  Presentes de experiência que viram memórias: passeios de escuna, mergulhos, jantares e muito mais.
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

      {/* ── Sticky filter bar ─────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 px-4 py-3"
        style={{
          background: 'rgba(251,242,232,0.94)',
          backdropFilter: 'blur(18px)',
          borderBottom: '1px solid rgba(200,146,74,0.12)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
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
                {cat === 'Lua de Mel' ? '🌊 Lua de Mel' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Mosaic grid ───────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 py-10 pb-28">
        {filtered.length > 0 ? (
          <div className="columns-2 md:columns-3 xl:columns-4 gap-4">
            {filtered.map((gift) => {
              const tall = !!(gift.featured || gift.category === 'Lua de Mel')
              return (
                <div key={gift.id} style={{ breakInside: 'avoid', marginBottom: '1rem' }}>
                  <MosaicCard
                    gift={gift}
                    tall={tall}
                    onBuy={() => buyGift(gift)}
                    isLoading={loadingId === gift.id}
                    disabled={loadingId !== null}
                  />
                </div>
              )
            })}
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

      {/* ── Error toast ───────────────────────────────────────── */}
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

/* ── Mosaic Card ─────────────────────────────────────────────────── */
interface MosaicCardProps {
  gift: Gift
  tall?: boolean
  onBuy: () => void
  isLoading: boolean
  disabled: boolean
}

function MosaicCard({ gift, tall, onBuy, isLoading, disabled }: MosaicCardProps) {
  const [hovered, setHovered] = useState(false)
  const isLuaMel = gift.category === 'Lua de Mel'

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-400"
      style={{
        background: '#FBF2E8',
        border: `1px solid ${isLuaMel ? 'rgba(200,146,74,0.25)' : 'rgba(200,146,74,0.13)'}`,
        boxShadow: hovered
          ? '0 16px 48px rgba(200,146,74,0.2), 0 0 0 1px rgba(200,146,74,0.24)'
          : isLuaMel
          ? '0 6px 24px rgba(200,146,74,0.1)'
          : '0 2px 12px rgba(26,16,10,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden flex-shrink-0"
        style={{ height: tall ? '200px' : '148px' }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gift.image}
          alt={gift.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 40%, rgba(26,16,10,0.52) 100%)',
            opacity: hovered ? 1 : 0.6,
            transition: 'opacity 0.4s',
          }}
        />
        {hovered && (
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(196,103,58,0.28) 100%)' }}
          />
        )}
        <div className="absolute top-2.5 left-2.5">
          <span
            className="text-[0.45rem] px-2 py-0.5 rounded-full tracking-[0.16em] uppercase"
            style={{
              background: isLuaMel ? 'rgba(26,16,10,0.72)' : 'rgba(200,146,74,0.82)',
              color: '#FBF2E8',
              fontFamily: 'var(--font-montserrat)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {isLuaMel ? '🌊 Lua de Mel' : gift.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-4 gap-2">
        <h3
          className="text-base md:text-lg font-light leading-tight"
          style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
        >
          {gift.name}
        </h3>
        <p
          className="text-[0.63rem] leading-relaxed"
          style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
        >
          {gift.description}
        </p>
        <div
          className="flex items-center justify-between pt-2 mt-0.5"
          style={{ borderTop: '1px solid rgba(200,146,74,0.12)' }}
        >
          <span
            className="text-lg font-light"
            style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
          >
            {formatBRL(gift.price)}
          </span>
          <motion.button
            whileTap={!disabled ? { scale: 0.95 } : {}}
            onClick={onBuy}
            disabled={disabled}
            className="text-[0.5rem] tracking-[0.16em] uppercase px-3 py-1.5 rounded-lg transition-all duration-300 min-w-[3.5rem] flex items-center justify-center gap-1"
            style={{
              background: isLoading
                ? 'rgba(200,146,74,0.15)'
                : hovered && !disabled
                ? 'linear-gradient(135deg, #C8924A, #C4673A)'
                : 'rgba(200,146,74,0.1)',
              color: hovered && !disabled && !isLoading ? '#FBF2E8' : '#C8924A',
              fontFamily: 'var(--font-montserrat)',
              border: '1px solid rgba(200,146,74,0.22)',
              boxShadow: hovered && !disabled ? '0 2px 10px rgba(200,146,74,0.26)' : 'none',
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled && !isLoading ? 0.55 : 1,
            }}
          >
            {isLoading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block', fontSize: '0.65rem' }}
                >
                  ◌
                </motion.span>
                <span>aguarde</span>
              </>
            ) : (
              'Dar'
            )}
          </motion.button>
        </div>
      </div>
    </div>
  )
}
