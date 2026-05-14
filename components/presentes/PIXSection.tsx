'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PIX_KEY } from '@/constants'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function PIXSection() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY)
      setCopied(true)
      setTimeout(() => setCopied(false), 2800)
    } catch {
      alert(`Chave PIX: ${PIX_KEY}`)
    }
  }

  return (
    <AnimatedSection>
      <div className="max-w-4xl mx-auto px-5 pt-12 pb-2">
        <div
          className="relative rounded-2xl overflow-hidden px-8 py-8 md:py-10"
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

          <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-10">
            {/* Left: text */}
            <div className="flex flex-col gap-1 flex-1">
              <p
                className="text-[0.52rem] tracking-[0.45em] uppercase"
                style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
              >
                Área especial
              </p>
              <h3
                className="text-2xl md:text-3xl font-light text-white"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                PIX Surpresa
              </h3>
              <p
                className="text-xs italic mt-0.5"
                style={{ color: '#E2C09A', fontFamily: 'var(--font-cormorant)', fontStyle: 'italic' }}
              >
                para a lua-de-mel e o novo lar
              </p>
            </div>

            {/* Center: key */}
            <div
              className="px-5 py-2.5 rounded-xl flex-shrink-0"
              style={{
                background: 'rgba(200,146,74,0.08)',
                border: '1px solid rgba(200,146,74,0.22)',
              }}
            >
              <p
                className="text-xs tracking-widest"
                style={{ color: '#E2C09A', fontFamily: 'var(--font-montserrat)' }}
              >
                {PIX_KEY}
              </p>
            </div>

            {/* Right: CTA */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.04 }}
              onClick={copy}
              className="flex-shrink-0 px-7 py-3 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-all duration-300"
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
              {copied ? '✓ Copiado!' : 'Copiar Chave PIX'}
            </motion.button>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
