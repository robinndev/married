'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PIX_KEY, PIX_DISPLAY, PIX_NAME } from '@/constants'
import AnimatedSection from '@/components/ui/AnimatedSection'

function ItauBadge() {
  return (
    <div
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{
        background: 'rgba(236,112,0,0.15)',
        border: '1px solid rgba(236,112,0,0.35)',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="#EC7000" />
        <text x="12" y="16" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="bold" fontFamily="Arial">i</text>
      </svg>
      <span
        style={{
          color: '#EC7000',
          fontFamily: 'var(--font-montserrat)',
          fontSize: '0.55rem',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}
      >
        Itaú
      </span>
    </div>
  )
}

export default function PIXSection() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY)
      setCopied(true)
      setTimeout(() => setCopied(false), 2800)
    } catch {
      alert(`Chave PIX: ${PIX_DISPLAY}`)
    }
  }

  return (
    <AnimatedSection>
      <div className="max-w-4xl mx-auto px-5 pt-12 pb-2">
        <div
          className="relative rounded-2xl overflow-hidden px-8 py-9 md:py-11"
          style={{
            background: 'linear-gradient(135deg, #1A100A 0%, #2E1A0E 60%, #3A200E 100%)',
            border: '1px solid rgba(200,146,74,0.22)',
            boxShadow: '0 12px 48px rgba(26,16,10,0.22)',
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 30% 50%, rgba(200,146,74,0.14) 0%, transparent 60%)',
            }}
          />
          <div className="divider-sunset absolute top-0 inset-x-0" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-12">
            {/* Left: text */}
            <div className="flex flex-col gap-4 flex-1">
              <div className="flex flex-col gap-1.5">
                <p
                  className="text-[0.5rem] tracking-[0.45em] uppercase"
                  style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
                >
                  Presente do coração
                </p>
                <h3
                  className="text-3xl md:text-4xl font-light text-white"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  PIX Surpresa
                </h3>
                <p
                  className="text-sm leading-relaxed mt-1"
                  style={{ color: 'rgba(226,192,154,0.75)', fontFamily: 'var(--font-cormorant)', fontStyle: 'italic' }}
                >
                  Prefere escolher o valor você mesmo? Manda um PIX com carinho —
                  qualquer quantia é recebida com muita gratidão e amor.
                </p>
              </div>

              {/* PIX Key card */}
              <div
                className="rounded-xl px-5 py-4 flex flex-col gap-3"
                style={{ background: 'rgba(200,146,74,0.07)', border: '1px solid rgba(200,146,74,0.2)' }}
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex flex-col gap-0.5">
                    <p
                      className="text-[0.48rem] tracking-[0.3em] uppercase"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Telefone · Chave PIX
                    </p>
                    <p
                      className="text-xl font-light tracking-wider"
                      style={{ color: '#E2C09A', fontFamily: 'var(--font-cormorant)' }}
                    >
                      {PIX_DISPLAY}
                    </p>
                  </div>
                  <ItauBadge />
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'rgba(200,146,74,0.5)' }} />
                  <p
                    className="text-xs"
                    style={{ color: 'rgba(226,192,154,0.7)', fontFamily: 'var(--font-montserrat)' }}
                  >
                    {PIX_NAME}
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.03 }}
                onClick={copy}
                className="self-start px-8 py-3 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-all duration-300"
                style={{
                  background: copied
                    ? 'linear-gradient(135deg, #5A8A4A, #3A6A2E)'
                    : 'linear-gradient(135deg, #C8924A, #C4673A)',
                  color: '#FBF2E8',
                  fontFamily: 'var(--font-montserrat)',
                  boxShadow: copied
                    ? '0 4px 20px rgba(90,138,74,0.3)'
                    : '0 4px 20px rgba(200,146,74,0.3)',
                }}
              >
                {copied ? '✓ Chave copiada!' : 'Copiar Chave PIX'}
              </motion.button>
            </div>

            {/* Right: decorative */}
            <div className="hidden md:flex flex-col items-center gap-3 opacity-30">
              <div className="text-6xl" style={{ color: '#E2C09A' }}>♥</div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
