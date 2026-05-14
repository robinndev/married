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
    <div style={{ background: 'linear-gradient(180deg, #F4E5D0 0%, #FBF2E8 100%)' }}>
      <AnimatedSection>
        <div
          className="relative overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #1A100A 0%, #2E1A0E 40%, #3A200E 70%, #1A100A 100%)',
            borderTop: '1px solid rgba(200,146,74,0.18)',
            borderBottom: '1px solid rgba(200,146,74,0.18)',
          }}
        >
          {/* Ambient radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 20%, rgba(200,146,74,0.22) 0%, transparent 55%)',
            }}
          />
          {/* Second warm glow lower */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 70% 80%, rgba(196,103,58,0.14) 0%, transparent 50%)',
            }}
          />

          {/* Top decorative line */}
          <div className="divider-sunset absolute top-0 inset-x-0" />

          {/* Decorative corners */}
          {[
            'top-6 left-6 border-t border-l',
            'top-6 right-6 border-t border-r',
            'bottom-6 left-6 border-b border-l',
            'bottom-6 right-6 border-b border-r',
          ].map((cls) => (
            <div
              key={cls}
              className={`absolute w-8 h-8 ${cls}`}
              style={{ borderColor: 'rgba(200,146,74,0.35)' }}
            />
          ))}

          <div className="relative z-10 max-w-3xl mx-auto px-5 py-24 md:py-32 text-center flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <p
                className="text-[0.55rem] tracking-[0.6em] uppercase"
                style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
              >
                Área Especial
              </p>

              <h2
                className="text-5xl md:text-7xl font-light text-white leading-[0.9]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                PIX
                <br />
                <span style={{ color: '#E2C09A' }}>Surpresa</span>
              </h2>

              <p
                className="text-base md:text-lg font-light mt-2"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  color: 'rgba(226,192,154,0.75)',
                  fontStyle: 'italic',
                }}
              >
                para a lua-de-mel e o novo lar
              </p>
            </div>

            <div className="divider-sunset w-20" />

            <p
              className="text-sm md:text-base max-w-sm mx-auto leading-relaxed"
              style={{ color: 'rgba(255,255,255,0.58)', fontFamily: 'var(--font-montserrat)' }}
            >
              Prefere presentear via PIX? Cada centavo vai direto para a nossa lua-de-mel ou para o lar que estamos construindo juntos — com muito amor.
            </p>

            {/* PIX Key display */}
            <div
              className="px-8 py-4 rounded-2xl"
              style={{
                background: 'rgba(200,146,74,0.08)',
                border: '1px solid rgba(200,146,74,0.25)',
              }}
            >
              <p
                className="text-base tracking-widest"
                style={{ color: '#E2C09A', fontFamily: 'var(--font-montserrat)' }}
              >
                {PIX_KEY}
              </p>
            </div>

            {/* CTA */}
            <motion.button
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: 1.05 }}
              onClick={copy}
              className="px-12 py-5 text-[0.72rem] tracking-[0.25em] uppercase rounded-2xl transition-all duration-300"
              style={{
                background: copied
                  ? 'linear-gradient(135deg, #5A8A4A, #3A6A2E)'
                  : 'linear-gradient(135deg, #C8924A, #C4673A)',
                color: '#FBF2E8',
                fontFamily: 'var(--font-montserrat)',
                boxShadow: copied
                  ? '0 8px 32px rgba(90,138,74,0.35)'
                  : '0 8px 32px rgba(200,146,74,0.4)',
              }}
            >
              {copied ? '✓ Chave copiada!' : 'Copiar Chave PIX'}
            </motion.button>

            <p
              className="text-[0.55rem] tracking-wider italic"
              style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
            >
              Em breve: checkout integrado com Mercado Pago
            </p>
          </div>
        </div>
      </AnimatedSection>
    </div>
  )
}
