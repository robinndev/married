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
const featuredGifts = allGifts.filter((g) => g.featured)

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
    else if (category === 'Todos') base = allGifts
    else base = allGifts.filter((g) => g.category === category)

    if (!search.trim()) return base
    const q = search.toLowerCase()
    return base.filter(
      (g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q)
    )
  }, [category, search])

  const showFeatured = category === 'Todos' && !search.trim() && featuredGifts.length > 0

  return (
    <div className="min-h-screen" style={{ background: '#FBF2E8' }}>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <PageHero
        src="/images/book2.png"
        eyebrow="Com amor"
        title="Lista de Presentes"
        subtitle="Cada presente é uma forma carinhosa de fazer parte da construção do nosso lar."
      />

      {/* ── Featured Section ───────────────────────────────────── */}
      <AnimatePresence>
        {showFeatured && (
          <motion.section
            key="featured"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'linear-gradient(180deg, #FBF2E8 0%, #F4E5D0 100%)' }}
          >
            <div className="max-w-6xl mx-auto px-5 pt-20 pb-16">
              <AnimatedSection>
                <p
                  className="text-[0.55rem] tracking-[0.5em] uppercase mb-3"
                  style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
                >
                  Destaques
                </p>
                <h2
                  className="text-4xl md:text-5xl font-light"
                  style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
                >
                  Os mais desejados
                </h2>
                <div className="divider-sunset w-14 mt-4" />
              </AnimatedSection>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
                {/* Hero featured card — spans 2 cols on large screens */}
                {featuredGifts[0] && (
                  <AnimatedSection delay={0} className="lg:col-span-2">
                    <FeaturedCard gift={featuredGifts[0]} tall />
                  </AnimatedSection>
                )}
                {/* Secondary featured cards */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-5">
                  {featuredGifts.slice(1, 5).map((gift, i) => (
                    <AnimatedSection key={gift.id} delay={i * 0.1}>
                      <FeaturedCard gift={gift} />
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── PIX Highlight ─────────────────────────────────────── */}
      <PIXSection />

      {/* ── Filters ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 pt-14 pb-4">
        <AnimatedSection className="flex flex-col gap-4">
          <div className="relative max-w-sm">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#C8924A' }}>
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar presente..."
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-colors"
              style={inputStyle}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.22)')}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {GIFT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="px-4 py-1.5 rounded-full text-[0.62rem] tracking-[0.15em] uppercase transition-all duration-250"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  background: category === cat
                    ? 'linear-gradient(135deg, #C8924A, #C4673A)'
                    : 'rgba(251,242,232,0.8)',
                  color: category === cat ? '#FBF2E8' : '#8A6A50',
                  border: `1px solid ${category === cat ? 'transparent' : 'rgba(200,146,74,0.22)'}`,
                  boxShadow: category === cat ? '0 2px 12px rgba(200,146,74,0.3)' : 'none',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </AnimatedSection>
      </div>

      {/* ── Masonry Gift Grid ──────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-5 pb-28">
        {filtered.length > 0 ? (
          <div className="columns-2 md:columns-3 xl:columns-4 gap-4 mt-8">
            {filtered.map((gift, i) => (
              <div key={gift.id} style={{ breakInside: 'avoid', marginBottom: '1rem' }}>
                <MosaicCard gift={gift} tall={i % 3 === 0} />
              </div>
            ))}
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

/* ── Featured Card (for highlighted section) ───────────────────── */
function FeaturedCard({ gift, tall }: { gift: Gift; tall?: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden h-full transition-all duration-500 cursor-default"
      style={{
        background: '#FBF2E8',
        border: '1px solid rgba(200,146,74,0.15)',
        boxShadow: hovered
          ? '0 24px 64px rgba(200,146,74,0.22), 0 0 0 1px rgba(200,146,74,0.28)'
          : '0 6px 24px rgba(26,16,10,0.08)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className={`relative overflow-hidden flex-shrink-0 ${tall ? 'h-72 md:h-80' : 'h-48'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gift.image}
          alt={gift.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(180deg, rgba(26,16,10,0.04) 0%, rgba(26,16,10,0.5) 100%)',
            opacity: hovered ? 1 : 0.55,
          }}
        />
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-[0.5rem] px-2.5 py-1 rounded-full tracking-[0.2em] uppercase"
            style={{
              background: 'rgba(200,146,74,0.88)',
              color: '#FBF2E8',
              fontFamily: 'var(--font-montserrat)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {gift.category}
          </span>
        </div>
        {/* Star badge for featured */}
        <div className="absolute top-3 right-3">
          <span
            className="text-[0.45rem] px-2 py-1 rounded-full tracking-[0.15em] uppercase"
            style={{
              background: 'rgba(26,16,10,0.6)',
              color: '#E2C09A',
              fontFamily: 'var(--font-montserrat)',
              backdropFilter: 'blur(8px)',
            }}
          >
            ★ Destaque
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        <h3
          className="text-xl font-light leading-tight"
          style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
        >
          {gift.name}
        </h3>
        <p
          className="text-xs leading-relaxed flex-1"
          style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
        >
          {gift.description}
        </p>
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid rgba(200,146,74,0.15)' }}
        >
          <span
            className="text-xl font-light"
            style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
          >
            {formatBRL(gift.price)}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="text-[0.58rem] tracking-[0.2em] uppercase px-4 py-2 rounded-lg transition-all duration-300"
            style={{
              background: hovered ? 'linear-gradient(135deg, #C8924A, #C4673A)' : 'rgba(200,146,74,0.12)',
              color: hovered ? '#FBF2E8' : '#C8924A',
              fontFamily: 'var(--font-montserrat)',
              border: '1px solid rgba(200,146,74,0.3)',
              boxShadow: hovered ? '0 2px 12px rgba(200,146,74,0.3)' : 'none',
            }}
            onClick={() => alert('Em breve: integração com Mercado Pago 🎁')}
          >
            Presentear
          </motion.button>
        </div>
      </div>
    </div>
  )
}

/* ── Mosaic Card (for the masonry grid) ─────────────────────────── */
function MosaicCard({ gift, tall }: { gift: Gift; tall?: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-500 cursor-default"
      style={{
        background: '#FBF2E8',
        border: '1px solid rgba(200,146,74,0.13)',
        boxShadow: hovered
          ? '0 16px 48px rgba(200,146,74,0.18), 0 0 0 1px rgba(200,146,74,0.22)'
          : '0 4px 16px rgba(26,16,10,0.06)',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className={`relative overflow-hidden flex-shrink-0 ${tall ? 'h-56' : 'h-40'}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={gift.image}
          alt={gift.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700"
          style={{ transform: hovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, transparent 40%, rgba(26,16,10,0.5) 100%)',
            opacity: hovered ? 1 : 0.55,
            transition: 'opacity 0.5s',
          }}
        />
        {/* Sunset glow on hover */}
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{
            background: 'linear-gradient(180deg, transparent 50%, rgba(196,103,58,0.3) 100%)',
            opacity: hovered ? 1 : 0,
          }}
        />
        <div className="absolute top-2.5 left-2.5">
          <span
            className="text-[0.48rem] px-2 py-0.5 rounded-full tracking-[0.18em] uppercase"
            style={{
              background: 'rgba(200,146,74,0.85)',
              color: '#FBF2E8',
              fontFamily: 'var(--font-montserrat)',
              backdropFilter: 'blur(6px)',
            }}
          >
            {gift.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-4 gap-2">
        <h3
          className="text-lg font-light leading-tight"
          style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
        >
          {gift.name}
        </h3>
        <p
          className="text-[0.65rem] leading-relaxed"
          style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
        >
          {gift.description}
        </p>
        <div
          className="flex items-center justify-between pt-2 mt-1"
          style={{ borderTop: '1px solid rgba(200,146,74,0.13)' }}
        >
          <span
            className="text-lg font-light"
            style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
          >
            {formatBRL(gift.price)}
          </span>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="text-[0.52rem] tracking-[0.18em] uppercase px-3 py-1.5 rounded-lg transition-all duration-300"
            style={{
              background: hovered ? 'linear-gradient(135deg, #C8924A, #C4673A)' : 'rgba(200,146,74,0.1)',
              color: hovered ? '#FBF2E8' : '#C8924A',
              fontFamily: 'var(--font-montserrat)',
              border: '1px solid rgba(200,146,74,0.25)',
              boxShadow: hovered ? '0 2px 10px rgba(200,146,74,0.28)' : 'none',
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
