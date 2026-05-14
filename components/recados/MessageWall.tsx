'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedSection from '@/components/ui/AnimatedSection'
import PageHero from '@/components/ui/PageHero'
import { addMessage, subscribeToMessages } from '@/lib/firestore'
import type { Message } from '@/types'

function timeAgo(val: unknown): string {
  try {
    const date =
      val && typeof val === 'object' && 'seconds' in val
        ? new Date((val as { seconds: number }).seconds * 1000)
        : new Date(val as string)
    const diff = Date.now() - date.getTime()
    if (diff < 60_000) return 'agora mesmo'
    if (diff < 3_600_000) return `há ${Math.floor(diff / 60_000)} min`
    if (diff < 86_400_000) return `há ${Math.floor(diff / 3_600_000)}h`
    return date.toLocaleDateString('pt-BR')
  } catch {
    return ''
  }
}

export default function MessageWall() {
  const [messages, setMessages] = useState<Message[]>([])
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [firebaseAvailable, setFirebaseAvailable] = useState(true)

  useEffect(() => {
    try {
      const unsub = subscribeToMessages((msgs) => setMessages(msgs))
      return unsub
    } catch {
      setFirebaseAvailable(false)
    }
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !text.trim()) return
    setStatus('loading')
    try {
      if (firebaseAvailable) {
        await addMessage({ name: name.trim(), text: text.trim() })
      } else {
        setMessages((prev) => [
          {
            id: Date.now().toString(),
            name: name.trim(),
            text: text.trim(),
            createdAt: new Date().toISOString(),
          },
          ...prev,
        ])
      }
      setName('')
      setText('')
      setStatus('success')
      setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const inputStyle = {
    background: 'rgba(251,242,232,0.75)',
    border: '1px solid rgba(200,146,74,0.25)',
    fontFamily: 'var(--font-montserrat)',
    color: '#2A1A0F',
    outline: 'none',
  }

  return (
    <div className="min-h-screen" style={{ background: '#FBF2E8' }}>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <PageHero
        src="/images/book7.png"
        eyebrow="Para os noivos"
        title="Mural de Recados"
        subtitle="Deixe uma mensagem que ficará guardada para sempre no coração dos noivos."
      />

      {/* ── Warm ambient bg ───────────────────────────────────── */}
      <div
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #FBF2E8 0%, #F4E5D0 100%)' }}
      >
        {/* Glow shape */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(200,146,74,0.08) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }}
        />

        <div className="max-w-3xl mx-auto px-5 py-20 relative z-10 flex flex-col gap-14">
          {/* ── Form ──────────────────────────────────────────── */}
          <AnimatedSection>
            <form
              onSubmit={submit}
              className="rounded-2xl p-8 flex flex-col gap-5"
              style={{
                background: 'rgba(251,242,232,0.7)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(200,146,74,0.2)',
                boxShadow: '0 8px 40px rgba(26,16,10,0.07)',
              }}
            >
              <div>
                <h2
                  className="text-2xl font-light"
                  style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
                >
                  Escreva seu recado
                </h2>
                <div className="divider-sunset w-10 mt-4" />
              </div>

              {/* Name */}
              <div>
                <label
                  className="text-[0.58rem] tracking-[0.32em] uppercase block mb-2"
                  style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                >
                  Seu nome
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Como posso te chamar?"
                  maxLength={80}
                  className="w-full px-4 py-3 rounded-xl text-sm placeholder-[#BFA080] transition-colors"
                  style={{ ...inputStyle }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(200,146,74,0.55)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(200,146,74,0.25)')}
                  required
                />
              </div>

              {/* Message */}
              <div>
                <label
                  className="text-[0.58rem] tracking-[0.32em] uppercase block mb-2"
                  style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
                >
                  Mensagem
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Escreva algo especial para Natacha e Mauricio..."
                  maxLength={400}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm placeholder-[#BFA080] transition-colors resize-none"
                  style={{ ...inputStyle }}
                  onFocus={(e) => (e.target.style.borderColor = 'rgba(200,146,74,0.55)')}
                  onBlur={(e) => (e.target.style.borderColor = 'rgba(200,146,74,0.25)')}
                  required
                />
                <p
                  className="text-right text-[0.58rem] mt-1"
                  style={{ color: '#BFA080', fontFamily: 'var(--font-montserrat)' }}
                >
                  {text.length}/400
                </p>
              </div>

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
                {status === 'loading'
                  ? 'Enviando...'
                  : status === 'success'
                  ? '✓ Recado enviado!'
                  : 'Enviar Recado'}
              </motion.button>

              {status === 'error' && (
                <p
                  className="text-xs text-center"
                  style={{ color: '#C4673A', fontFamily: 'var(--font-montserrat)' }}
                >
                  Algo deu errado. Tente novamente.
                </p>
              )}
            </form>
          </AnimatedSection>

          {/* ── Messages list ─────────────────────────────────── */}
          <AnimatedSection delay={0.15}>
            <h2
              className="text-2xl font-light mb-8"
              style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
            >
              {messages.length > 0
                ? `${messages.length} recado${messages.length > 1 ? 's' : ''} recebido${messages.length > 1 ? 's' : ''}`
                : 'Seja o primeiro a deixar um recado'}
            </h2>

            <div className="flex flex-col gap-4">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: -14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.45 }}
                    className="rounded-2xl p-6 flex flex-col gap-3"
                    style={{
                      background: 'rgba(251,242,232,0.65)',
                      backdropFilter: 'blur(16px)',
                      border: '1px solid rgba(200,146,74,0.18)',
                      boxShadow: '0 4px 20px rgba(26,16,10,0.05)',
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className="text-lg font-light"
                        style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
                      >
                        {msg.name}
                      </p>
                      <span
                        className="text-[0.58rem]"
                        style={{ color: '#BFA080', fontFamily: 'var(--font-montserrat)' }}
                      >
                        {timeAgo(msg.createdAt)}
                      </span>
                    </div>
                    <div className="divider-sunset w-8" />
                    <p
                      className="text-sm leading-relaxed"
                      style={{ fontFamily: 'var(--font-montserrat)', color: '#4A2E1A' }}
                    >
                      {msg.text}
                    </p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </div>
  )
}
