'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
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

  return (
    <div className="min-h-screen" style={{ background: '#FBF2E8' }}>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <PageHero
        src="/images/book2.png"
        eyebrow="Com amor"
        title="Lista de Presentes"
        subtitle="Cada presente é uma forma carinhosa de fazer parte da construção do nosso lar."
      />

      {/* ── PIX — compact banner ──────────────────────────────── */}
      <div style={{ background: 'linear-gradient(180deg, #FBF2E8 0%, #F4E5D0 100%)' }}>
        <PIXSection />

        {/* ── Lua de Mel callout ────────────────────────────────── */}
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
                <p
                  className="text-xs font-medium"
                  style={{ fontFamily: 'var(--font-montserrat)', color: '#2A1A0F' }}
                >
                  Lua de mel na Bahia — Morro de São Paulo
                </p>
                <p
                  className="text-[0.65rem] mt-0.5"
                  style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
                >
                  Presentes de experiência que viram memórias: passeios, mergulhos, jantares e muito mais.
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

      {/* ── Filters ───────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-30 px-5 py-4"
        style={{
          background: 'rgba(251,242,232,0.92)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(200,146,74,0.12)',
        }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row gap-3">
          {/* Search */}
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
          {/* Category pills */}
          <div className="flex flex-wrap gap-2 items-center">
            {GIFT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-[0.6rem] tracking-[0.14em] uppercase transition-all duration-200"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  background: category === cat
                    ? 'linear-gradient(135deg, #C8924A, #C4673A)'
                    : 'rgba(251,242,232,0.9)',
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
            {filtered.map((gift, i) => {
              const tall = gift.featured || gift.category === 'Lua de Mel'
              return (
                <div key={gift.id} style={{ breakInside: 'avoid', marginBottom: '1rem' }}>
                  <MosaicCard gift={gift} tall={tall} />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <p
              className="text-4xl font-light mb-3"
              style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
            >
              Nenhum presente encontrado
            </p>
            <p className="text-sm" style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}>
              Tente outra busca ou categoria
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Mosaic Card ─────────────────────────────────────────────────── */
function MosaicCard({ gift, tall }: { gift: Gift; tall?: boolean }) {
  const [hovered, setHovered] = useState(false)
  const isLuaMel = gift.category === 'Lua de Mel'

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-400 cursor-default"
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
            style={{
              background: 'linear-gradient(180deg, transparent 55%, rgba(196,103,58,0.28) 100%)',
            }}
          />
        )}
        {/* Badge */}
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
            whileTap={{ scale: 0.95 }}
            className="text-[0.5rem] tracking-[0.16em] uppercase px-3 py-1.5 rounded-lg transition-all duration-300"
            style={{
              background: hovered ? 'linear-gradient(135deg, #C8924A, #C4673A)' : 'rgba(200,146,74,0.1)',
              color: hovered ? '#FBF2E8' : '#C8924A',
              fontFamily: 'var(--font-montserrat)',
              border: '1px solid rgba(200,146,74,0.22)',
              boxShadow: hovered ? '0 2px 10px rgba(200,146,74,0.26)' : 'none',
            }}
            onClick={() => alert('Em breve: integração com Mercado Pago 🎁')}
          >
            Dar
          </motion.button>
        </div>
      </div>
    </div>
  )
}
