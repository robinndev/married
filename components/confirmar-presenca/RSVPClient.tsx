'use client'

import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageHero from '@/components/ui/PageHero'
import { addConfirmation, checkAlreadyConfirmed } from '@/lib/firestore'
import guestsData from '@/mocks/guests.json'
import type { Guest } from '@/types'

const guests: Guest[] = guestsData as Guest[]

const fuse = new Fuse(guests, {
  keys: ['name'],
  threshold: 0.35,
  includeScore: true,
})

type Step = 'search' | 'form' | 'success'

const inputStyle = {
  background: 'rgba(251,242,232,0.8)',
  border: '1px solid rgba(200,146,74,0.22)',
  color: '#2A1A0F',
  fontFamily: 'var(--font-montserrat)',
  outline: 'none',
}

export default function RSVPClient() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Guest | null>(null)
  const [step, setStep] = useState<Step>('search')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [totalPeople, setTotalPeople] = useState(1)
  const [status, setStatus] = useState<'idle' | 'loading' | 'error' | 'duplicate'>('idle')
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    return fuse.search(query).slice(0, 6).map((r) => r.item)
  }, [query])

  const selectGuest = (guest: Guest) => {
    setSelected(guest)
    setQuery(guest.name)
    setStep('form')
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return
    setStatus('loading')
    try {
      const alreadyDone = await checkAlreadyConfirmed(selected.id)
      if (alreadyDone) { setStatus('duplicate'); return }
      await addConfirmation({
        guestId: selected.id,
        guestName: selected.name,
        email: email.trim(),
        message: message.trim(),
        totalPeople,
      })
      setStep('success')
    } catch {
      setStep('success')
    }
    setStatus('idle')
  }

  const reset = () => {
    setSelected(null); setQuery(''); setStep('search')
    setEmail(''); setMessage(''); setTotalPeople(1); setStatus('idle')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const cardStyle = {
    background: 'rgba(251,242,232,0.7)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(200,146,74,0.2)',
    boxShadow: '0 8px 40px rgba(26,16,10,0.07)',
  }

  return (
    <div className="min-h-screen" style={{ background: '#FBF2E8' }}>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <PageHero
        src="/images/book8.png"
        eyebrow="Você está na lista?"
        title="Confirmar Presença"
        subtitle="Busque seu nome e confirme sua presença até 15 de julho de 2026."
      />

      {/* ── Warm gradient section ─────────────────────────────── */}
      <div style={{ background: 'linear-gradient(180deg, #FBF2E8 0%, #F4E5D0 100%)' }}>
        <div className="max-w-xl mx-auto px-5 py-20">
          <AnimatePresence mode="wait">

            {/* ── STEP: SEARCH ──────────────────────────────────── */}
            {step === 'search' && (
              <motion.div
                key="search"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <AnimatedSection>
                  <div className="rounded-2xl p-8 flex flex-col gap-6" style={cardStyle}>
                    <div>
                      <h2
                        className="text-3xl font-light mb-1"
                        style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
                      >
                        Busque seu nome
                      </h2>
                      <div className="divider-sunset w-10 mt-4 mb-5" />
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#C8924A' }}>
                          🔍
                        </span>
                        <input
                          ref={inputRef}
                          type="text"
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          placeholder="Digite seu nome..."
                          className="w-full pl-10 pr-4 py-4 rounded-xl text-sm placeholder-[#BFA080] transition-colors"
                          style={inputStyle}
                          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.22)')}
                          autoFocus
                        />
                      </div>
                    </div>

                    <AnimatePresence>
                      {results.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-col gap-2"
                        >
                          {results.map((guest) => (
                            <motion.button
                              key={guest.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              onClick={() => selectGuest(guest)}
                              className="text-left px-5 py-4 rounded-xl transition-all duration-300 hover:scale-[1.01] flex items-center justify-between group"
                              style={{
                                background: 'rgba(251,242,232,0.9)',
                                border: '1px solid rgba(200,146,74,0.2)',
                              }}
                            >
                              <span
                                className="text-sm"
                                style={{ fontFamily: 'var(--font-montserrat)', color: '#2A1A0F' }}
                              >
                                {guest.name}
                              </span>
                              <span
                                className="text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                style={{ color: '#C8924A' }}
                              >
                                →
                              </span>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                      {query.trim() && results.length === 0 && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center text-sm py-4"
                          style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                        >
                          Nome não encontrado. Entre em contato com os noivos.
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                </AnimatedSection>
              </motion.div>
            )}

            {/* ── STEP: FORM ────────────────────────────────────── */}
            {step === 'form' && selected && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <form onSubmit={submit} className="rounded-2xl p-8 flex flex-col gap-5" style={cardStyle}>
                  <div>
                    <p
                      className="text-[0.58rem] tracking-[0.35em] uppercase mb-2"
                      style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Confirmando presença
                    </p>
                    <h2
                      className="text-3xl font-light"
                      style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
                    >
                      {selected.name}
                    </h2>
                    <button
                      type="button"
                      onClick={reset}
                      className="text-[0.58rem] tracking-widest mt-1 transition-colors hover:opacity-80"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      ← trocar convidado
                    </button>
                  </div>
                  <div className="divider-sunset w-10" />

                  {/* Email */}
                  <div>
                    <label
                      className="text-[0.58rem] tracking-[0.32em] uppercase block mb-2"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Email <span style={{ color: '#C8924A' }}>*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu@email.com"
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm placeholder-[#BFA080] transition-colors"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.22)')}
                    />
                  </div>

                  {/* Total people */}
                  <div>
                    <label
                      className="text-[0.58rem] tracking-[0.32em] uppercase block mb-3"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Total de pessoas
                    </label>
                    <div className="flex items-center gap-3">
                      {[1, 2, 3, 4].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setTotalPeople(n)}
                          className="w-11 h-11 rounded-full text-sm transition-all duration-250"
                          style={{
                            background: totalPeople === n
                              ? 'linear-gradient(135deg, #C8924A, #C4673A)'
                              : 'rgba(251,242,232,0.9)',
                            color: totalPeople === n ? '#FBF2E8' : '#8A6A50',
                            border: `1px solid ${totalPeople === n ? 'transparent' : 'rgba(200,146,74,0.25)'}`,
                            fontFamily: 'var(--font-montserrat)',
                            boxShadow: totalPeople === n ? '0 2px 10px rgba(200,146,74,0.3)' : 'none',
                          }}
                        >
                          {n}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      className="text-[0.58rem] tracking-[0.32em] uppercase block mb-2"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Mensagem (opcional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Algo que queira dizer aos noivos..."
                      rows={3}
                      maxLength={300}
                      className="w-full px-4 py-3 rounded-xl text-sm placeholder-[#BFA080] transition-colors resize-none"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.22)')}
                    />
                  </div>

                  {status === 'duplicate' && (
                    <p className="text-xs text-center" style={{ color: '#C4673A', fontFamily: 'var(--font-montserrat)' }}>
                      Você já confirmou presença. Obrigado!
                    </p>
                  )}
                  {status === 'error' && (
                    <p className="text-xs text-center" style={{ color: '#C4673A', fontFamily: 'var(--font-montserrat)' }}>
                      Erro ao confirmar. Tente novamente.
                    </p>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={status === 'loading'}
                    className="py-4 text-[0.68rem] tracking-[0.25em] uppercase transition-all duration-300 hover:scale-105 disabled:opacity-60 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #C8924A, #C4673A)',
                      color: '#FBF2E8',
                      fontFamily: 'var(--font-montserrat)',
                      boxShadow: '0 4px 20px rgba(200,146,74,0.28)',
                    }}
                  >
                    {status === 'loading' ? 'Confirmando...' : 'Confirmar Presença'}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ── STEP: SUCCESS ─────────────────────────────────── */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div
                  className="rounded-2xl p-12 text-center flex flex-col items-center gap-6"
                  style={cardStyle}
                >
                  {/* Heart icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -15 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 180 }}
                    className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
                    style={{
                      background: 'linear-gradient(135deg, #C8924A, #C4673A)',
                      boxShadow: '0 8px 32px rgba(200,146,74,0.4)',
                    }}
                  >
                    ♥
                  </motion.div>

                  <div className="flex flex-col gap-2">
                    <p
                      className="text-[0.6rem] tracking-[0.45em] uppercase"
                      style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Presença confirmada!
                    </p>
                    <h2
                      className="text-4xl font-light"
                      style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
                    >
                      Mal podemos esperar
                    </h2>
                    <p
                      className="text-sm mt-2 leading-relaxed max-w-xs mx-auto"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      {selected?.name}, sua presença vai tornar o nosso dia ainda mais especial. Até lá! 🌅
                    </p>
                  </div>

                  <div className="divider-sunset w-14" />

                  <button
                    onClick={reset}
                    className="text-[0.6rem] tracking-[0.22em] uppercase transition-colors hover:opacity-70"
                    style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                  >
                    Confirmar outro convidado
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
