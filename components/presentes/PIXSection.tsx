'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PIX_KEY, PIX_DISPLAY, PIX_NAME } from '@/constants'
import AnimatedSection from '@/components/ui/AnimatedSection'

function MpBadge() {
  return (
    <div
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
      style={{
        background: 'linear-gradient(135deg, #00186A 0%, #009EE3 100%)',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="12" fill="white" fillOpacity="0.2" />
        <path d="M7 12.5l3.5 3.5 6.5-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span
        className="text-[0.6rem] tracking-widest uppercase text-white font-semibold"
        style={{ fontFamily: 'var(--font-montserrat)' }}
      >
        Mercado Pago
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
          className="relative rounded-2xl overflow-hidden px-8 py-10 md:py-12"
          style={{
            background: 'linear-gradient(135deg, #1A100A 0%, #2E1A0E 60%, #3A200E 100%)',
            border: '1px solid rgba(200,146,74,0.25)',
            boxShadow: '0 16px 56px rgba(26,16,10,0.28)',
          }}
        >
          {/* Ambient glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 25% 60%, rgba(200,146,74,0.12) 0%, transparent 65%)',
            }}
          />
          <div className="divider-sunset absolute top-0 inset-x-0" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-14">

            {/* Left: text */}
            <div className="flex flex-col gap-5 flex-1 min-w-0">

              {/* Header */}
              <div className="flex flex-col gap-1">
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
                  className="text-sm leading-relaxed mt-0.5"
                  style={{ color: 'rgba(226,192,154,0.7)', fontFamily: 'var(--font-cormorant)', fontStyle: 'italic' }}
                >
                  Prefere escolher o valor você mesmo? Manda um PIX com carinho —
                  qualquer quantia é recebida com muita gratidão.
                </p>
              </div>

              {/* PIX Key card */}
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  border: '1px solid rgba(200,146,74,0.25)',
                }}
              >
                {/* Top: badge strip */}
                <div
                  className="flex items-center justify-between gap-3 px-5 py-3"
                  style={{ background: 'rgba(200,146,74,0.06)', borderBottom: '1px solid rgba(200,146,74,0.12)' }}
                >
                  <p
                    className="text-[0.55rem] tracking-[0.3em] uppercase"
                    style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                  >
                    Chave PIX · E-mail
                  </p>
                  <MpBadge />
                </div>

                {/* Bottom: key + name */}
                <div
                  className="flex flex-col gap-1 px-5 py-4"
                  style={{ background: 'rgba(200,146,74,0.04)' }}
                >
                  <p
                    className="text-base md:text-lg font-light break-all leading-snug"
                    style={{ color: '#E2C09A', fontFamily: 'var(--font-cormorant)' }}
                  >
                    {PIX_DISPLAY}
                  </p>
                  <p
                    className="text-[0.65rem] tracking-wide"
                    style={{ color: 'rgba(200,146,74,0.6)', fontFamily: 'var(--font-montserrat)' }}
                  >
                    {PIX_NAME}
                  </p>
                </div>
              </div>

              {/* CTA button */}
              <motion.button
                whileTap={{ scale: 0.96 }}
                whileHover={{ scale: 1.02 }}
                onClick={copy}
                className="self-start px-8 py-3 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-colors duration-300 flex items-center gap-2"
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
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={copied ? 'copied' : 'copy'}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                  >
                    {copied ? '✓ Chave copiada!' : 'Copiar Chave PIX'}
                  </motion.span>
                </AnimatePresence>
              </motion.button>
            </div>

            {/* Right: decorative heart */}
            <div className="hidden md:flex flex-col items-center justify-center gap-2 opacity-20 select-none">
              <div className="text-7xl leading-none" style={{ color: '#E2C09A' }}>♥</div>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
