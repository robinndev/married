'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { PIX_KEY } from '@/constants'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function PIXSection() {
  const [copied, setCopied] = useState(false)
  const [amount, setAmount] = useState('')
  const [mpLoading, setMpLoading] = useState(false)
  const [mpError, setMpError] = useState<string | null>(null)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(PIX_KEY)
      setCopied(true)
      setTimeout(() => setCopied(false), 2800)
    } catch {
      alert(`Chave PIX: ${PIX_KEY}`)
    }
  }

  const contribute = async () => {
    const numeric = parseFloat(amount.replace(',', '.'))
    if (!numeric || numeric < 1) {
      setMpError('Valor mínimo: R$ 1,00')
      return
    }
    if (numeric > 50_000) {
      setMpError('Valor máximo: R$ 50.000,00')
      return
    }

    setMpLoading(true)
    setMpError(null)

    try {
      const res = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contribution', amount: numeric }),
      })
      const data: { init_point?: string; error?: string } = await res.json()

      if (!res.ok || !data.init_point) {
        setMpError(data.error ?? 'Erro ao processar. Tente novamente.')
        return
      }

      window.location.href = data.init_point
    } catch {
      setMpError('Erro de conexão. Verifique sua internet.')
    } finally {
      setMpLoading(false)
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

          <div className="relative z-10 flex flex-col gap-6">
            {/* ── PIX manual copy ───────────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-center gap-5 md:gap-8">
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

              <div
                className="px-5 py-2.5 rounded-xl flex-shrink-0"
                style={{ background: 'rgba(200,146,74,0.08)', border: '1px solid rgba(200,146,74,0.22)' }}
              >
                <p
                  className="text-xs tracking-widest"
                  style={{ color: '#E2C09A', fontFamily: 'var(--font-montserrat)' }}
                >
                  {PIX_KEY}
                </p>
              </div>

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

            {/* ── Separator ─────────────────────────────────────── */}
            <div
              className="h-px w-full"
              style={{ background: 'rgba(200,146,74,0.15)' }}
            />

            {/* ── MP Checkout contribution ───────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label
                  className="text-[0.5rem] tracking-[0.35em] uppercase"
                  style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                >
                  Ou contribua qualquer valor via Mercado Pago
                </label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-medium"
                    style={{ color: '#E2C09A', fontFamily: 'var(--font-montserrat)' }}
                  >
                    R$
                  </span>
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setMpError(null) }}
                    onKeyDown={(e) => e.key === 'Enter' && contribute()}
                    placeholder="100"
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm transition-colors"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      border: mpError
                        ? '1px solid rgba(196,103,58,0.6)'
                        : '1px solid rgba(200,146,74,0.22)',
                      color: '#FBF2E8',
                      fontFamily: 'var(--font-montserrat)',
                      outline: 'none',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.55)')}
                    onBlur={(e) =>
                      (e.currentTarget.style.borderColor = mpError
                        ? 'rgba(196,103,58,0.6)'
                        : 'rgba(200,146,74,0.22)')
                    }
                  />
                </div>
                {mpError && (
                  <p className="text-[0.55rem]" style={{ color: '#C4673A', fontFamily: 'var(--font-montserrat)' }}>
                    {mpError}
                  </p>
                )}
              </div>

              <motion.button
                whileTap={!mpLoading ? { scale: 0.96 } : {}}
                whileHover={!mpLoading ? { scale: 1.03 } : {}}
                onClick={contribute}
                disabled={mpLoading}
                className="flex-shrink-0 px-7 py-3 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  background: mpLoading
                    ? 'rgba(200,146,74,0.25)'
                    : 'linear-gradient(135deg, #C8924A, #C4673A)',
                  color: '#FBF2E8',
                  fontFamily: 'var(--font-montserrat)',
                  boxShadow: mpLoading ? 'none' : '0 4px 20px rgba(200,146,74,0.3)',
                  cursor: mpLoading ? 'not-allowed' : 'pointer',
                  minWidth: '12rem',
                }}
              >
                {mpLoading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      style={{ display: 'inline-block' }}
                    >
                      ◌
                    </motion.span>
                    aguardando...
                  </>
                ) : (
                  'Ir para o Checkout →'
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
