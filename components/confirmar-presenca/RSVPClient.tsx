'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Fuse from 'fuse.js'
import PageHero from '@/components/ui/PageHero'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { subscribeToGuests, confirmGuest, unconfirmGuest } from '@/lib/firestore'
import type { Guest } from '@/types'

type Step = 'search' | 'already' | 'removing' | 'form' | 'success' | 'unconfirmed'

const inputStyle = {
  background: 'rgba(251,242,232,0.8)',
  border: '1px solid rgba(200,146,74,0.22)',
  color: '#2A1A0F',
  fontFamily: 'var(--font-montserrat)',
  outline: 'none',
}

const cardStyle = {
  background: 'rgba(251,242,232,0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(200,146,74,0.2)',
  boxShadow: '0 8px 40px rgba(26,16,10,0.07)',
}

export default function RSVPClient() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [firestoreReady, setFirestoreReady] = useState(false)
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Guest | null>(null)
  const [step, setStep] = useState<Step>('search')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [totalGuests, setTotalGuests] = useState(1)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Load guests from Firestore in real-time
  useEffect(() => {
    const unsub = subscribeToGuests((data) => {
      setGuests(data)
      setFirestoreReady(true)
    })
    return unsub
  }, [])

  const fuse = useMemo(
    () => new Fuse(guests, { keys: ['name'], threshold: 0.35, includeScore: true }),
    [guests]
  )

  const results = useMemo(() => {
    if (!search.trim() || !firestoreReady) return []
    return fuse.search(search).slice(0, 6).map((r) => r.item)
  }, [search, fuse, firestoreReady])

  const selectGuest = (guest: Guest) => {
    setSelected(guest)
    setSearch(guest.name)
    setError(null)
    if (guest.confirmed) {
      setStep('already')
    } else {
      setStep('form')
    }
  }

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected || !phone.trim()) return
    setActionLoading(true)
    setError(null)
    try {
      await confirmGuest(selected.id, { phone: phone.trim(), message: message.trim(), totalGuests })
      setStep('success')
    } catch {
      setError('Erro ao confirmar. Verifique sua conexão e tente novamente.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnconfirm = async () => {
    if (!selected) return
    setStep('removing')
    setActionLoading(true)
    try {
      await unconfirmGuest(selected.id)
      setStep('unconfirmed')
    } catch {
      setError('Erro ao remover confirmação. Tente novamente.')
      setStep('already')
    } finally {
      setActionLoading(false)
    }
  }

  const reset = () => {
    setSelected(null)
    setSearch('')
    setStep('search')
    setPhone('')
    setMessage('')
    setTotalGuests(1)
    setError(null)
    setActionLoading(false)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div className="min-h-screen" style={{ background: '#FBF2E8' }}>
      <PageHero
        src="/images/book8.png"
        eyebrow="Você está na lista?"
        title="Confirmar Presença"
        subtitle="Busque seu nome e confirme sua presença até 15 de julho de 2026."
      />

      <div style={{ background: 'linear-gradient(180deg, #FBF2E8 0%, #F4E5D0 100%)' }}>
        <div className="max-w-xl mx-auto px-5 py-20">
          <AnimatePresence mode="wait">

            {/* ── SEARCH ───────────────────────────────────────── */}
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
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: '#C8924A' }}>
                          🔍
                        </span>
                        <input
                          ref={inputRef}
                          type="text"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                          placeholder={firestoreReady ? 'Digite seu nome...' : 'Carregando lista...'}
                          disabled={!firestoreReady}
                          className="w-full pl-10 pr-10 py-4 rounded-xl text-sm placeholder-[#BFA080] transition-colors disabled:opacity-60"
                          style={inputStyle}
                          onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
                          onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.22)')}
                          autoFocus
                        />
                        {!firestoreReady && (
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
                            style={{ display: 'inline-block', color: '#C8924A' }}
                          >
                            ◌
                          </motion.span>
                        )}
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
                              <div className="flex items-center gap-3">
                                <div
                                  className="w-2 h-2 rounded-full flex-shrink-0"
                                  style={{ background: guest.confirmed ? '#5A8A4A' : 'rgba(200,146,74,0.4)' }}
                                />
                                <span
                                  className="text-sm"
                                  style={{ fontFamily: 'var(--font-montserrat)', color: '#2A1A0F' }}
                                >
                                  {guest.name}
                                </span>
                                {guest.confirmed && (
                                  <span
                                    className="text-[0.45rem] tracking-[0.15em] uppercase px-2 py-0.5 rounded-full"
                                    style={{
                                      background: 'rgba(90,138,74,0.1)',
                                      color: '#5A8A4A',
                                      border: '1px solid rgba(90,138,74,0.25)',
                                      fontFamily: 'var(--font-montserrat)',
                                    }}
                                  >
                                    confirmado
                                  </span>
                                )}
                              </div>
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
                      {search.trim() && firestoreReady && results.length === 0 && (
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

            {/* ── ALREADY CONFIRMED ────────────────────────────── */}
            {step === 'already' && selected && (
              <motion.div
                key="already"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="rounded-2xl p-10 flex flex-col items-center text-center gap-6" style={cardStyle}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(90,138,74,0.15), rgba(90,138,74,0.1))',
                      border: '1px solid rgba(90,138,74,0.3)',
                      color: '#5A8A4A',
                    }}
                  >
                    ✓
                  </motion.div>

                  <div className="flex flex-col gap-1">
                    <p
                      className="text-[0.52rem] tracking-[0.45em] uppercase"
                      style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Presença já confirmada
                    </p>
                    <h2
                      className="text-3xl font-light mt-1"
                      style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
                    >
                      {selected.name}
                    </h2>
                    {selected.totalGuests && (
                      <p className="text-xs mt-1" style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}>
                        {selected.totalGuests} pessoa{selected.totalGuests > 1 ? 's' : ''} confirmada{selected.totalGuests > 1 ? 's' : ''}
                      </p>
                    )}
                  </div>

                  <div className="divider-sunset w-10" />

                  <div className="flex flex-col gap-3 w-full max-w-xs">
                    <p
                      className="text-sm leading-relaxed"
                      style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
                    >
                      Sua presença está confirmada. Deseja remover a confirmação?
                    </p>

                    <div className="flex flex-col gap-2 pt-1">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setStep('removing')}
                        className="w-full py-3 text-[0.62rem] tracking-[0.2em] uppercase rounded-xl transition-all duration-300 hover:opacity-80"
                        style={{
                          background: 'rgba(196,103,58,0.08)',
                          color: '#C4673A',
                          border: '1px solid rgba(196,103,58,0.25)',
                          fontFamily: 'var(--font-montserrat)',
                        }}
                      >
                        Sim, remover minha confirmação
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={reset}
                        className="w-full py-3 text-[0.62rem] tracking-[0.2em] uppercase rounded-xl transition-all duration-300 hover:opacity-80"
                        style={{
                          background: 'linear-gradient(135deg, #C8924A, #C4673A)',
                          color: '#FBF2E8',
                          fontFamily: 'var(--font-montserrat)',
                          boxShadow: '0 4px 16px rgba(200,146,74,0.28)',
                        }}
                      >
                        Não, manter confirmação
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── REMOVING CONFIRM ─────────────────────────────── */}
            {step === 'removing' && selected && (
              <motion.div
                key="removing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <div className="rounded-2xl p-10 flex flex-col items-center text-center gap-6" style={cardStyle}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 180, delay: 0.1 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: 'rgba(196,103,58,0.08)',
                      border: '1px solid rgba(196,103,58,0.25)',
                    }}
                  >
                    ⚠
                  </motion.div>

                  <div className="flex flex-col gap-2">
                    <p
                      className="text-[0.52rem] tracking-[0.45em] uppercase"
                      style={{ color: '#C4673A', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Tem certeza?
                    </p>
                    <h2
                      className="text-2xl font-light"
                      style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
                    >
                      Remover a confirmação de
                      <br />
                      <span style={{ color: '#C8924A' }}>{selected.name}</span>?
                    </h2>
                    <p
                      className="text-xs leading-relaxed max-w-xs mx-auto mt-1"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Você poderá confirmar novamente a qualquer momento antes do casamento.
                    </p>
                  </div>

                  {error && (
                    <p className="text-xs" style={{ color: '#C4673A', fontFamily: 'var(--font-montserrat)' }}>
                      {error}
                    </p>
                  )}

                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleUnconfirm}
                      disabled={actionLoading}
                      className="w-full py-3.5 text-[0.62rem] tracking-[0.2em] uppercase rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      style={{
                        background: 'rgba(196,103,58,0.1)',
                        color: '#C4673A',
                        border: '1px solid rgba(196,103,58,0.3)',
                        fontFamily: 'var(--font-montserrat)',
                      }}
                    >
                      {actionLoading ? (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            style={{ display: 'inline-block' }}
                          >
                            ◌
                          </motion.span>
                          Removendo...
                        </>
                      ) : (
                        'Confirmar remoção'
                      )}
                    </motion.button>
                    <button
                      onClick={() => setStep('already')}
                      disabled={actionLoading}
                      className="w-full py-3 text-[0.62rem] tracking-[0.2em] uppercase rounded-xl transition-opacity hover:opacity-60 disabled:opacity-30"
                      style={{
                        color: '#8A6A50',
                        fontFamily: 'var(--font-montserrat)',
                        border: '1px solid rgba(200,146,74,0.2)',
                      }}
                    >
                      ← Voltar
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── FORM ─────────────────────────────────────────── */}
            {step === 'form' && selected && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <form onSubmit={handleConfirm} className="rounded-2xl p-8 flex flex-col gap-5" style={cardStyle}>
                  <div>
                    <p
                      className="text-[0.52rem] tracking-[0.45em] uppercase mb-2"
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
                      className="text-[0.52rem] tracking-widest mt-1 transition-opacity hover:opacity-60"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      ← trocar convidado
                    </button>
                  </div>
                  <div className="divider-sunset w-10" />

                  {/* Phone */}
                  <div>
                    <label
                      className="text-[0.52rem] tracking-[0.32em] uppercase block mb-2"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Telefone / WhatsApp <span style={{ color: '#C8924A' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => { setPhone(e.target.value); setError(null) }}
                      placeholder="(11) 99999-9999"
                      required
                      className="w-full px-4 py-3 rounded-xl text-sm placeholder-[#BFA080] transition-colors"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.22)')}
                    />
                  </div>

                  {/* Total guests */}
                  <div>
                    <label
                      className="text-[0.52rem] tracking-[0.32em] uppercase block mb-3"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Quantas pessoas virão?
                    </label>
                    <div className="flex items-center gap-3 flex-wrap">
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setTotalGuests(n)}
                          className="w-11 h-11 rounded-full text-sm transition-all duration-200"
                          style={{
                            background: totalGuests === n
                              ? 'linear-gradient(135deg, #C8924A, #C4673A)'
                              : 'rgba(251,242,232,0.9)',
                            color: totalGuests === n ? '#FBF2E8' : '#8A6A50',
                            border: `1px solid ${totalGuests === n ? 'transparent' : 'rgba(200,146,74,0.25)'}`,
                            fontFamily: 'var(--font-montserrat)',
                            boxShadow: totalGuests === n ? '0 2px 10px rgba(200,146,74,0.3)' : 'none',
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
                      className="text-[0.52rem] tracking-[0.32em] uppercase block mb-2"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Mensagem (opcional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Algo especial para os noivos..."
                      rows={3}
                      maxLength={300}
                      className="w-full px-4 py-3 rounded-xl text-sm placeholder-[#BFA080] transition-colors resize-none"
                      style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.22)')}
                    />
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-center"
                      style={{ color: '#C4673A', fontFamily: 'var(--font-montserrat)' }}
                    >
                      {error}
                    </motion.p>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    disabled={actionLoading}
                    className="py-4 text-[0.65rem] tracking-[0.25em] uppercase transition-all duration-300 hover:scale-105 disabled:opacity-60 rounded-xl flex items-center justify-center gap-2"
                    style={{
                      background: 'linear-gradient(135deg, #C8924A, #C4673A)',
                      color: '#FBF2E8',
                      fontFamily: 'var(--font-montserrat)',
                      boxShadow: '0 4px 20px rgba(200,146,74,0.28)',
                    }}
                  >
                    {actionLoading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          style={{ display: 'inline-block' }}
                        >
                          ◌
                        </motion.span>
                        Confirmando...
                      </>
                    ) : (
                      'Confirmar Presença'
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* ── SUCCESS ──────────────────────────────────────── */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="rounded-2xl p-12 text-center flex flex-col items-center gap-6" style={cardStyle}>
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
                      className="text-[0.55rem] tracking-[0.45em] uppercase"
                      style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Presença confirmada!
                    </p>
                    <h2 className="text-4xl font-light" style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}>
                      Mal podemos esperar
                    </h2>
                    <p
                      className="text-sm mt-2 leading-relaxed max-w-xs mx-auto"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      {selected?.name}, sua presença vai tornar nosso dia ainda mais especial. Até 01.08.2026!
                    </p>
                  </div>

                  <div className="divider-sunset w-14" />
                  <button
                    onClick={reset}
                    className="text-[0.58rem] tracking-[0.22em] uppercase transition-opacity hover:opacity-60"
                    style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                  >
                    Confirmar outro convidado
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── UNCONFIRMED ───────────────────────────────────── */}
            {step === 'unconfirmed' && (
              <motion.div
                key="unconfirmed"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="rounded-2xl p-12 text-center flex flex-col items-center gap-6" style={cardStyle}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 180 }}
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                    style={{
                      background: 'rgba(200,146,74,0.1)',
                      border: '1px solid rgba(200,146,74,0.25)',
                    }}
                  >
                    ◌
                  </motion.div>

                  <div className="flex flex-col gap-2">
                    <p
                      className="text-[0.55rem] tracking-[0.45em] uppercase"
                      style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Confirmação removida
                    </p>
                    <h2 className="text-3xl font-light" style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}>
                      Tudo certo,{' '}
                      <span style={{ color: '#C8924A' }}>{selected?.name?.split(' ')[0]}</span>
                    </h2>
                    <p
                      className="text-sm mt-1 leading-relaxed max-w-xs mx-auto"
                      style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                    >
                      Sua confirmação foi removida. Você pode confirmar novamente quando quiser.
                    </p>
                  </div>

                  <div className="divider-sunset w-10" />
                  <button
                    onClick={reset}
                    className="px-8 py-3.5 text-[0.62rem] tracking-[0.22em] uppercase rounded-xl transition-all hover:scale-105"
                    style={{
                      background: 'linear-gradient(135deg, #C8924A, #C4673A)',
                      color: '#FBF2E8',
                      fontFamily: 'var(--font-montserrat)',
                      boxShadow: '0 4px 16px rgba(200,146,74,0.28)',
                    }}
                  >
                    Voltar ao início
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
