'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  subscribeToGuests, confirmGuest, unconfirmGuest, unconfirmGroup,
  updateGuestInfo, addGuest, deleteGuest,
} from '@/lib/firestore'
import type { Guest } from '@/types'

const WEDDING_DATE = new Date('2026-08-01T13:00:00-03:00')
const PASSWORD = '135426'

const NUCLEUS_LABELS: Record<string, string> = {
  'Noivo':              'Lado do Noivo',
  'Noiva':              'Lado da Noiva',
  'Familia Noivo':      'Família do Noivo',
  'Familia Noiva':      'Família da Noiva',
  'Amigos Noivo':       'Amigos do Noivo',
  'Amigos Noiva':       'Amigos da Noiva',
  'Criança menor de 7': 'Criança',
  'Fotografo':          'Fotógrafo',
  'Pastores':           'Pastores',
}

const NUCLEUS_OPTIONS = [
  'Noivo', 'Noiva', 'Familia Noivo', 'Familia Noiva',
  'Amigos Noivo', 'Amigos Noiva', 'Criança menor de 7', 'Fotografo', 'Pastores',
]

interface GuestEntry { name: string; nucleus: string }

function nucleusLabel(nucleus?: string) {
  return NUCLEUS_LABELS[nucleus ?? ''] ?? nucleus ?? ''
}

function nucleusStyle(nucleus?: string) {
  const n = nucleus ?? ''
  if (n.includes('Noivo')) return { bg: 'rgba(74,120,220,0.14)', color: '#8BB5F5', border: 'rgba(74,120,220,0.3)' }
  if (n.includes('Noiva')) return { bg: 'rgba(220,80,150,0.14)', color: '#F090C8', border: 'rgba(220,80,150,0.3)' }
  if (n === 'Criança menor de 7') return { bg: 'rgba(80,200,100,0.14)', color: '#80E090', border: 'rgba(80,200,100,0.3)' }
  return { bg: 'rgba(220,170,80,0.14)', color: '#F0C878', border: 'rgba(220,170,80,0.3)' }
}

function NucleusBadge({ nucleus }: { nucleus?: string }) {
  if (!nucleus) return null
  const label = nucleusLabel(nucleus)
  if (!label) return null
  const s = nucleusStyle(nucleus)
  return (
    <span style={{
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem',
      letterSpacing: '0.08em', padding: '2px 9px', borderRadius: 999,
      textTransform: 'uppercase', whiteSpace: 'nowrap', flexShrink: 0,
    }}>
      {label}
    </span>
  )
}

function pad(n: number) { return String(n).padStart(2, '0') }

function useCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = WEDDING_DATE.getTime() - Date.now()
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 }); return }
      setTime({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
        seconds: Math.floor((diff % 60_000) / 1_000),
      })
    }
    tick()
    const id = setInterval(tick, 1_000)
    return () => clearInterval(id)
  }, [])
  return time
}

function formatPhone(phone?: string) { return phone || '—' }

function formatDate(val: unknown): string {
  if (!val) return '—'
  try {
    const date =
      val && typeof val === 'object' && 'seconds' in val
        ? new Date((val as { seconds: number }).seconds * 1000)
        : new Date(val as string)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })
  } catch { return '—' }
}

// ── Password Modal ────────────────────────────────────────
function PasswordModal({ onSuccess }: { onSuccess: () => void }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 400) }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      if (value === PASSWORD) {
        onSuccess()
      } else {
        setError(true)
        setValue('')
        setLoading(false)
        setTimeout(() => setError(false), 2000)
      }
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #080503 0%, #180C06 55%, #0F0805 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.35, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', width: 700, height: 700,
            top: -250, left: -200,
            background: 'radial-gradient(circle, rgba(200,146,74,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
          style={{
            position: 'absolute', width: 500, height: 500,
            bottom: -180, right: -100,
            background: 'radial-gradient(circle, rgba(196,103,58,0.09) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.94 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <form onSubmit={submit}
          className="flex flex-col items-center gap-8 rounded-3xl px-9 py-12"
          style={{
            background: 'rgba(255,248,235,0.03)',
            backdropFilter: 'blur(32px)',
            border: '1px solid rgba(200,146,74,0.18)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.65), inset 0 1px 0 rgba(200,146,74,0.1)',
          }}
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(200,146,74,0.18), rgba(196,103,58,0.12))',
                border: '1px solid rgba(200,146,74,0.28)',
                boxShadow: '0 0 50px rgba(200,146,74,0.15)',
              }}
            >
              <span style={{ fontSize: '2rem' }}>♥</span>
            </motion.div>
          </div>

          <div className="text-center flex flex-col gap-2">
            <p className="text-[0.6rem] tracking-[0.55em] uppercase" style={{ color: 'rgba(200,146,74,0.65)', fontFamily: 'var(--font-montserrat)' }}>
              Área exclusiva
            </p>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'var(--font-cormorant)', color: '#FBF2E8' }}>
              Painel dos Noivos
            </h1>
            <p className="text-[0.7rem]" style={{ color: 'rgba(255,248,235,0.28)', fontFamily: 'var(--font-montserrat)', letterSpacing: '0.1em' }}>
              01 · 08 · 2026 — Mairiporã, SP
            </p>
          </div>

          <div className="w-16 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,74,0.5), transparent)' }} />

          <div className="w-full flex flex-col gap-4">
            <label className="text-[0.62rem] tracking-[0.4em] uppercase text-center block"
              style={{ color: 'rgba(200,146,74,0.6)', fontFamily: 'var(--font-montserrat)' }}>
              Senha de acesso
            </label>
            <motion.input
              ref={inputRef}
              animate={error ? { x: [-8, 8, -6, 6, -3, 3, 0] } : {}}
              transition={{ duration: 0.4 }}
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="••••••"
              maxLength={20}
              className="w-full px-6 py-4 rounded-2xl text-center text-xl tracking-[0.5em] transition-all"
              style={{
                background: error ? 'rgba(196,103,58,0.1)' : 'rgba(255,255,255,0.05)',
                border: `1.5px solid ${error ? 'rgba(196,103,58,0.55)' : 'rgba(200,146,74,0.22)'}`,
                color: '#FBF2E8',
                fontFamily: 'var(--font-montserrat)',
                outline: 'none',
                boxShadow: error ? '0 0 24px rgba(196,103,58,0.15)' : 'none',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'rgba(200,146,74,0.55)'
                e.currentTarget.style.boxShadow = '0 0 24px rgba(200,146,74,0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = error ? 'rgba(196,103,58,0.55)' : 'rgba(200,146,74,0.22)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[0.65rem] text-center tracking-widest"
                  style={{ color: '#E07850', fontFamily: 'var(--font-montserrat)' }}
                >
                  Senha incorreta
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            type="submit"
            disabled={loading || !value}
            className="w-full py-4 text-[0.68rem] tracking-[0.3em] uppercase rounded-2xl transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #C8924A, #C4673A)',
              color: '#FBF2E8',
              fontFamily: 'var(--font-montserrat)',
              boxShadow: '0 8px 32px rgba(200,146,74,0.3)',
            }}
          >
            {loading
              ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>◌</motion.span>
              : 'Entrar'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

// ── Edit Modal ────────────────────────────────────────────
function EditModal({ guest, onClose, onSave }: { guest: Guest; onClose: () => void; onSave: (d: { phone: string; totalGuests: number }) => Promise<void> }) {
  const [phone, setPhone] = useState(guest.phone ?? '')
  const [total, setTotal] = useState(guest.totalGuests ?? 1)
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await onSave({ phone, totalGuests: total })
    setLoading(false)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl p-8 flex flex-col gap-6"
        style={{
          background: 'linear-gradient(145deg, #1A0E08, #120A05)',
          border: '1px solid rgba(200,146,74,0.25)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(200,146,74,0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-[0.6rem] tracking-[0.4em] uppercase mb-1.5" style={{ color: 'rgba(200,146,74,0.6)', fontFamily: 'var(--font-montserrat)' }}>
            Editar convidado
          </p>
          <h3 className="text-3xl font-light" style={{ fontFamily: 'var(--font-cormorant)', color: '#FBF2E8' }}>{guest.name}</h3>
        </div>
        <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(200,146,74,0.3), transparent)' }} />
        <div>
          <label className="text-[0.62rem] tracking-[0.3em] uppercase block mb-2.5" style={{ color: 'rgba(200,146,74,0.65)', fontFamily: 'var(--font-montserrat)' }}>
            Telefone
          </label>
          <input
            type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999"
            className="w-full px-4 py-3.5 rounded-xl text-sm"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,146,74,0.2)', color: '#FBF2E8', fontFamily: 'var(--font-montserrat)', outline: 'none' }}
          />
        </div>
        <div>
          <label className="text-[0.62rem] tracking-[0.3em] uppercase block mb-3" style={{ color: 'rgba(200,146,74,0.65)', fontFamily: 'var(--font-montserrat)' }}>
            Total de pessoas
          </label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button key={n} type="button" onClick={() => setTotal(n)}
                className="w-11 h-11 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: total === n ? 'linear-gradient(135deg, #C8924A, #C4673A)' : 'rgba(255,255,255,0.05)',
                  color: total === n ? '#FBF2E8' : 'rgba(255,255,255,0.45)',
                  border: `1px solid ${total === n ? 'transparent' : 'rgba(200,146,74,0.18)'}`,
                  fontFamily: 'var(--font-montserrat)',
                  boxShadow: total === n ? '0 4px 16px rgba(200,146,74,0.3)' : 'none',
                }}
              >{n}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-1">
          <button type="button" onClick={onClose}
            className="flex-1 py-3.5 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-all hover:opacity-70"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading}
            className="flex-1 py-3.5 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #C8924A, #C4673A)', color: '#FBF2E8', fontFamily: 'var(--font-montserrat)', boxShadow: '0 4px 20px rgba(200,146,74,0.25)' }}>
            {loading ? '...' : 'Salvar'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

// ── Add Guest Modal ───────────────────────────────────────
function AddGuestModal({ onClose, onApply }: { onClose: () => void; onApply: (entries: GuestEntry[]) => Promise<void> }) {
  const [entries, setEntries] = useState<GuestEntry[]>([{ name: '', nucleus: '' }])
  const [loading, setLoading] = useState(false)

  const updateEntry = (i: number, field: keyof GuestEntry, value: string) =>
    setEntries((prev) => prev.map((e, idx) => idx === i ? { ...e, [field]: value } : e))

  const removeEntry = (i: number) =>
    setEntries((prev) => prev.filter((_, idx) => idx !== i))

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const valid = entries.filter((e) => e.name.trim())
    if (!valid.length) return
    setLoading(true)
    await onApply(valid)
    setLoading(false)
    onClose()
  }

  const fieldStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(200,146,74,0.2)',
    color: '#FBF2E8',
    fontFamily: 'var(--font-montserrat)',
    outline: 'none',
    fontSize: '0.85rem',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center px-5 py-10 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        onSubmit={submit}
        className="w-full max-w-lg rounded-3xl flex flex-col gap-6 my-auto"
        style={{
          background: 'linear-gradient(145deg, #1A0E08, #120A05)',
          border: '1px solid rgba(200,146,74,0.25)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), inset 0 1px 0 rgba(200,146,74,0.08)',
          padding: '2.5rem',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-[0.6rem] tracking-[0.4em] uppercase mb-1.5" style={{ color: 'rgba(200,146,74,0.6)', fontFamily: 'var(--font-montserrat)' }}>
            Painel dos noivos
          </p>
          <h3 className="text-3xl font-light" style={{ fontFamily: 'var(--font-cormorant)', color: '#FBF2E8' }}>
            Adicionar convidados
          </h3>
        </div>
        <div className="h-px" style={{ background: 'linear-gradient(90deg, rgba(200,146,74,0.3), transparent)' }} />

        <div className="flex flex-col gap-3 max-h-[55vh] overflow-y-auto pr-1">
          {entries.map((entry, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-2xl p-4 relative"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {entries.length > 1 && (
                <button type="button" onClick={() => removeEntry(i)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'rgba(196,103,58,0.15)', color: '#E07850', border: '1px solid rgba(196,103,58,0.25)', fontSize: '1rem' }}
                >
                  ×
                </button>
              )}
              <p className="text-[0.58rem] tracking-[0.3em] uppercase" style={{ color: 'rgba(200,146,74,0.45)', fontFamily: 'var(--font-montserrat)' }}>
                Convidado {i + 1}
              </p>
              <input
                type="text" value={entry.name}
                onChange={(e) => updateEntry(i, 'name', e.target.value)}
                placeholder="Nome completo"
                className="w-full px-4 py-3 rounded-xl"
                style={fieldStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.2)')}
              />
              <select
                value={entry.nucleus}
                onChange={(e) => updateEntry(i, 'nucleus', e.target.value)}
                className="w-full px-4 py-3 rounded-xl"
                style={{ ...fieldStyle, cursor: 'pointer' }}
              >
                <option value="">Núcleo (opcional)</option>
                {NUCLEUS_OPTIONS.map((n) => (
                  <option key={n} value={n} style={{ background: '#1A0E08' }}>{nucleusLabel(n)}</option>
                ))}
              </select>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setEntries((prev) => [...prev, { name: '', nucleus: '' }])}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-[0.65rem] tracking-[0.2em] uppercase transition-all hover:opacity-80"
          style={{ border: '1px dashed rgba(200,146,74,0.3)', color: 'rgba(200,146,74,0.75)', fontFamily: 'var(--font-montserrat)' }}
        >
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span> Adicionar mais um
        </button>

        <div className="flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-3.5 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-all hover:opacity-70"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading || !entries.some((e) => e.name.trim())}
            className="flex-1 py-3.5 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #C8924A, #C4673A)', color: '#FBF2E8', fontFamily: 'var(--font-montserrat)', boxShadow: '0 4px 20px rgba(200,146,74,0.25)' }}>
            {loading ? '...' : `Aplicar${entries.filter((e) => e.name.trim()).length > 1 ? ` (${entries.filter((e) => e.name.trim()).length})` : ''}`}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

// ── Delete Dialog ─────────────────────────────────────────
function DeleteDialog({ guest, onConfirm, onCancel }: { guest: Guest; onConfirm: () => void; onCancel: () => void }) {
  const hasCompanions = (guest.companions?.length ?? 0) > 0
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(20px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="w-full max-w-xs rounded-3xl p-8 flex flex-col items-center gap-6 text-center"
        style={{
          background: 'linear-gradient(145deg, #1A0808, #100505)',
          border: '1px solid rgba(196,103,58,0.35)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(196,103,58,0.07)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(196,103,58,0.15)', border: '1px solid rgba(196,103,58,0.3)', boxShadow: '0 0 30px rgba(196,103,58,0.12)' }}>
          <span style={{ fontSize: '1.5rem' }}>🗑</span>
        </div>
        <div>
          <p className="text-2xl font-light mb-2" style={{ fontFamily: 'var(--font-cormorant)', color: '#FBF2E8' }}>Excluir convidado?</p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)', fontFamily: 'var(--font-montserrat)' }}>
            {hasCompanions
              ? `${guest.name} e ${guest.companions!.length} acompanhante(s) serão removidos permanentemente.`
              : `${guest.name} será removido permanentemente da lista.`}
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel}
            className="flex-1 py-3.5 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-all hover:opacity-70"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3.5 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-all hover:opacity-85"
            style={{ background: 'rgba(196,103,58,0.25)', color: '#F08060', border: '1px solid rgba(196,103,58,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            Excluir
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Confirm Dialog ────────────────────────────────────────
function ConfirmDialog({ guest, onConfirm, onCancel }: { guest: Guest; onConfirm: () => void; onCancel: () => void }) {
  const hasGroup = (guest.companions?.length ?? 0) > 0
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(20px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="w-full max-w-xs rounded-3xl p-8 flex flex-col items-center gap-6 text-center"
        style={{
          background: 'linear-gradient(145deg, #1A0E08, #120A05)',
          border: '1px solid rgba(196,103,58,0.3)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-14 h-14 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(196,103,58,0.12)', border: '1px solid rgba(196,103,58,0.28)' }}>
          <span style={{ fontSize: '1.5rem' }}>⚠</span>
        </div>
        <div>
          <p className="text-2xl font-light mb-2" style={{ fontFamily: 'var(--font-cormorant)', color: '#FBF2E8' }}>Remover confirmação?</p>
          <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.42)', fontFamily: 'var(--font-montserrat)' }}>
            {hasGroup
              ? `${guest.name} e ${guest.companions!.length} acompanhante(s) voltarão para pendentes.`
              : `${guest.name} voltará para a lista de pendentes.`}
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel}
            className="flex-1 py-3.5 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-all hover:opacity-70"
            style={{ border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            Cancelar
          </button>
          <button onClick={onConfirm}
            className="flex-1 py-3.5 text-[0.65rem] tracking-[0.2em] uppercase rounded-xl transition-all"
            style={{ background: 'rgba(196,103,58,0.2)', color: '#F08060', border: '1px solid rgba(196,103,58,0.35)', fontFamily: 'var(--font-montserrat)' }}>
            Remover
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Guest Card ────────────────────────────────────────────
interface GuestCardProps {
  guest: Guest
  companions: Guest[]
  expanded: boolean
  onToggleExpand: () => void
  onEdit: () => void
  onUnconfirm: () => void
  onConfirm: () => void
  onDelete: () => void
  actionLoading: boolean
  leaderName?: string
}

function GuestCard({
  guest, companions, expanded, onToggleExpand,
  onEdit, onUnconfirm, onConfirm, onDelete, actionLoading, leaderName,
}: GuestCardProps) {
  const hasCompanions = companions.length > 0
  const isCompanion = leaderName !== undefined

  if (isCompanion) {
    return (
      <div className="rounded-2xl px-5 py-4 flex flex-wrap items-center gap-3"
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: '3px solid rgba(200,146,74,0.4)',
        }}
      >
        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ background: '#6FCF5E', boxShadow: '0 0 8px rgba(111,207,94,0.4)' }} />
        <span style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.9)', fontSize: '1.15rem', fontWeight: 300 }}>
          {guest.name}
        </span>
        {guest.nucleus && <NucleusBadge nucleus={guest.nucleus} />}
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full flex-shrink-0"
          style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', letterSpacing: '0.06em', background: 'rgba(200,146,74,0.1)', color: '#E8C070', border: '1px solid rgba(200,146,74,0.28)' }}
        >
          junto com <strong style={{ color: '#F5D88A' }}>{leaderName}</strong>
        </span>
        <span className="ml-auto px-3 py-1.5 rounded-full text-[0.62rem] tracking-[0.1em] uppercase"
          style={{ fontFamily: 'var(--font-montserrat)', background: 'rgba(111,207,94,0.1)', color: '#6FCF5E', border: '1px solid rgba(111,207,94,0.25)' }}
        >
          Acompanhante
        </span>
        <button onClick={onDelete} disabled={actionLoading} title="Excluir"
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30"
          style={{ background: 'rgba(196,103,58,0.08)', color: 'rgba(196,103,58,0.55)', border: '1px solid rgba(196,103,58,0.18)', cursor: 'pointer', fontSize: '0.85rem' }}
        >
          🗑
        </button>
      </div>
    )
  }

  const isConfirmed = guest.confirmed
  const borderColor = isConfirmed ? 'rgba(111,207,94,0.5)' : 'rgba(200,146,74,0.35)'
  const dotColor = isConfirmed ? '#6FCF5E' : '#C8924A'
  const dotGlow = isConfirmed ? 'rgba(111,207,94,0.4)' : 'rgba(200,146,74,0.38)'

  return (
    <div className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: `3px solid ${borderColor}`,
      }}
    >
      <div
        onClick={hasCompanions ? onToggleExpand : undefined}
        className="px-5 py-4 flex flex-col gap-3"
        style={{ cursor: hasCompanions ? 'pointer' : 'default' }}
      >
        {/* Row 1: name + status + actions */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: dotColor, boxShadow: `0 0 8px ${dotGlow}` }} />

          <span className="font-light" style={{ fontFamily: 'var(--font-cormorant)', color: '#FBF2E8', fontSize: '1.2rem' }}>
            {guest.name}
          </span>

          {guest.nucleus && <NucleusBadge nucleus={guest.nucleus} />}

          <span className="px-3 py-1 rounded-full text-[0.6rem] tracking-[0.12em] uppercase flex-shrink-0"
            style={{
              fontFamily: 'var(--font-montserrat)',
              background: isConfirmed ? 'rgba(111,207,94,0.12)' : 'rgba(200,146,74,0.1)',
              color: isConfirmed ? '#6FCF5E' : 'rgba(200,146,74,0.9)',
              border: `1px solid ${isConfirmed ? 'rgba(111,207,94,0.3)' : 'rgba(200,146,74,0.25)'}`,
            }}
          >
            {isConfirmed ? '✓ Confirmado' : 'Pendente'}
          </span>

          <div className="ml-auto flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {isConfirmed ? (
              <>
                <button onClick={onEdit} disabled={actionLoading}
                  className="px-3.5 py-2 rounded-xl text-[0.62rem] tracking-[0.1em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                  style={{ cursor: 'pointer', background: 'rgba(200,146,74,0.1)', color: '#E8C070', border: '1px solid rgba(200,146,74,0.25)', fontFamily: 'var(--font-montserrat)' }}
                >
                  Editar
                </button>
                <button onClick={onUnconfirm} disabled={actionLoading}
                  className="px-3.5 py-2 rounded-xl text-[0.62rem] tracking-[0.1em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                  style={{ cursor: 'pointer', background: 'rgba(196,103,58,0.1)', color: '#F08060', border: '1px solid rgba(196,103,58,0.25)', fontFamily: 'var(--font-montserrat)' }}
                >
                  {actionLoading ? '...' : 'Remover'}
                </button>
              </>
            ) : (
              <button onClick={onConfirm} disabled={actionLoading}
                className="px-3.5 py-2 rounded-xl text-[0.62rem] tracking-[0.1em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                style={{ cursor: 'pointer', background: 'rgba(111,207,94,0.1)', color: '#6FCF5E', border: '1px solid rgba(111,207,94,0.28)', fontFamily: 'var(--font-montserrat)' }}
              >
                {actionLoading ? '...' : 'Confirmar'}
              </button>
            )}

            <button onClick={onDelete} disabled={actionLoading} title="Excluir permanentemente"
              className="w-8 h-8 rounded-lg flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30"
              style={{ cursor: 'pointer', background: 'rgba(196,103,58,0.08)', color: 'rgba(196,103,58,0.55)', border: '1px solid rgba(196,103,58,0.16)', fontSize: '0.85rem', flexShrink: 0 }}
            >
              🗑
            </button>

            {hasCompanions && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl"
                style={{
                  background: expanded ? 'rgba(200,146,74,0.15)' : 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(200,146,74,0.2)', color: 'rgba(200,146,74,0.85)',
                  fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', letterSpacing: '0.06em', userSelect: 'none',
                }}
              >
                <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '0.55rem' }}>▼</span>
                {companions.length} acomp.
              </div>
            )}
          </div>
        </div>

        {/* Row 2: meta */}
        {isConfirmed && (
          <div className="flex items-center gap-5 ml-[22px] flex-wrap">
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
              📞 {formatPhone(guest.phone)}
            </span>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
              👥 {guest.totalGuests ?? 1} pessoa{(guest.totalGuests ?? 1) > 1 ? 's' : ''}
            </span>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.68rem', color: 'rgba(255,255,255,0.22)' }}>
              {formatDate(guest.confirmedAt)}
            </span>
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && hasCompanions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }} className="overflow-hidden"
          >
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.15)' }}>
              {companions.map((companion, i) => (
                <div key={companion.id}
                  className="flex items-center gap-3"
                  style={{
                    padding: '10px 20px 10px 42px',
                    borderBottom: i < companions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                    borderLeft: '2px solid rgba(200,146,74,0.2)', marginLeft: '22px',
                  }}
                >
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: 'rgba(111,207,94,0.5)' }} />
                  <span style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.7)', fontSize: '1rem', fontWeight: 300 }}>
                    {companion.name}
                  </span>
                  {companion.nucleus && <NucleusBadge nucleus={companion.nucleus} />}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────
function StatCard({ label, value, sub, accent, icon }: { label: string; value: string; sub?: string; accent?: string; icon?: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -2 }}
      transition={{ duration: 0.18 }}
      className="flex flex-col gap-2 rounded-2xl px-6 py-5 relative overflow-hidden"
      style={{
        background: 'rgba(255,248,235,0.04)',
        border: `1px solid ${accent ? `${accent}30` : 'rgba(255,255,255,0.08)'}`,
        boxShadow: accent ? `0 0 40px ${accent}10` : 'none',
      }}
    >
      {accent && (
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 0% 0%, ${accent}0D 0%, transparent 65%)` }} />
      )}
      <div className="flex items-center justify-between">
        <p className="text-[0.62rem] tracking-[0.28em] uppercase" style={{ color: 'rgba(200,146,74,0.62)', fontFamily: 'var(--font-montserrat)' }}>
          {label}
        </p>
        {icon && <span style={{ fontSize: '1rem', opacity: 0.4 }}>{icon}</span>}
      </div>
      <p className="text-5xl font-light leading-none" style={{ fontFamily: 'var(--font-cormorant)', color: accent ?? '#FBF2E8' }}>
        {value}
      </p>
      {sub && (
        <p className="text-[0.68rem]" style={{ color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--font-montserrat)' }}>
          {sub}
        </p>
      )}
    </motion.div>
  )
}

// ── Dashboard ─────────────────────────────────────────────
function Dashboard({ guests }: { guests: Guest[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all')
  const [editing, setEditing] = useState<Guest | null>(null)
  const [unconfirming, setUnconfirming] = useState<Guest | null>(null)
  const [deleting, setDeleting] = useState<Guest | null>(null)
  const [adding, setAdding] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const countdown = useCountdown()

  const companionMap = useMemo(() => {
    const map: Record<string, Guest[]> = {}
    guests.filter((g) => g.groupLeaderId).forEach((g) => {
      if (!map[g.groupLeaderId!]) map[g.groupLeaderId!] = []
      map[g.groupLeaderId!].push(g)
    })
    return map
  }, [guests])

  const guestById = useMemo(() => {
    const map: Record<string, Guest> = {}
    guests.forEach((g) => { map[g.id] = g })
    return map
  }, [guests])

  const primaryGuests = useMemo(() => guests.filter((g) => !g.groupLeaderId), [guests])
  const confirmed = useMemo(() => primaryGuests.filter((g) => g.confirmed), [primaryGuests])
  const pending = useMemo(() => primaryGuests.filter((g) => !g.confirmed), [primaryGuests])
  const totalPeople = useMemo(() => confirmed.reduce((acc, g) => acc + (g.totalGuests ?? 1), 0), [confirmed])
  const pct = primaryGuests.length ? Math.round((confirmed.length / primaryGuests.length) * 100) : 0

  type SearchItem =
    | { kind: 'primary'; guest: Guest }
    | { kind: 'companion'; guest: Guest; leaderName: string }

  const trimmedSearch = search.trim()

  const listItems = useMemo<SearchItem[]>(() => {
    if (!trimmedSearch) {
      const base = filter === 'confirmed' ? confirmed : filter === 'pending' ? pending : primaryGuests
      return base.map((g) => ({ kind: 'primary' as const, guest: g }))
    }
    const q = trimmedSearch.toLowerCase()
    const results: SearchItem[] = []
    guests.forEach((g) => {
      if (!g.name.toLowerCase().includes(q)) return
      if (!g.groupLeaderId) {
        results.push({ kind: 'primary', guest: g })
      } else {
        const leader = guestById[g.groupLeaderId]
        results.push({ kind: 'companion', guest: g, leaderName: leader?.name ?? 'Desconhecido' })
      }
    })
    return results
  }, [guests, primaryGuests, confirmed, pending, filter, trimmedSearch, guestById])

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id); else next.add(id)
      return next
    })
  }

  const handleUnconfirm = async (guest: Guest) => {
    setActionLoading(guest.id)
    try {
      if ((guest.companions?.length ?? 0) > 0) await unconfirmGroup(guest.id, guest.companions!)
      else await unconfirmGuest(guest.id)
    } finally {
      setActionLoading(null)
      setUnconfirming(null)
    }
  }

  const handleConfirm = async (guest: Guest) => {
    setActionLoading(guest.id)
    try { await confirmGuest(guest.id, { phone: guest.phone ?? '—', totalGuests: guest.totalGuests ?? 1 }) }
    finally { setActionLoading(null) }
  }

  const handleEdit = async (data: { phone: string; totalGuests: number }) => {
    if (!editing) return
    await updateGuestInfo(editing.id, data)
  }

  const handleDelete = async (guest: Guest) => {
    setActionLoading(guest.id)
    try { await deleteGuest(guest.id, guest.companions ?? []) }
    finally { setActionLoading(null); setDeleting(null) }
  }

  const handleAddGuests = async (entries: GuestEntry[]) => {
    await Promise.all(entries.map((e) => addGuest({ name: e.name, nucleus: e.nucleus || undefined })))
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(145deg, #080503 0%, #150B05 50%, #0C0703 100%)' }}>
      <div className="fixed inset-0 pointer-events-none">
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 0%, rgba(200,146,74,0.1) 0%, transparent 50%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 80% 85%, rgba(196,103,58,0.06) 0%, transparent 45%)' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-16 flex flex-col gap-8">

        {/* ── Hero Header ──────────────────────────────────── */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 max-w-10" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,74,0.4))' }} />
            <p className="text-[0.58rem] tracking-[0.6em] uppercase" style={{ color: 'rgba(200,146,74,0.5)', fontFamily: 'var(--font-montserrat)' }}>
              Área exclusiva · Mairiporã, SP
            </p>
            <div className="h-px flex-1 max-w-10" style={{ background: 'linear-gradient(90deg, rgba(200,146,74,0.4), transparent)' }} />
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="font-light leading-none"
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: 'clamp(2.6rem, 8vw, 4.8rem)',
                  background: 'linear-gradient(135deg, #F5D890 0%, #C8924A 40%, #E8A860 70%, #F8E0A0 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Natacha <span style={{ opacity: 0.65 }}>&</span> Mauricio
              </h1>
              <p className="mt-2 text-[0.72rem]" style={{ color: 'rgba(255,248,235,0.3)', fontFamily: 'var(--font-montserrat)', letterSpacing: '0.1em' }}>
                01 de agosto de 2026
              </p>
            </div>

            {/* Countdown pills */}
            <div className="flex items-stretch gap-2.5 self-start sm:self-auto">
              {[
                { v: pad(countdown.days), l: 'dias' },
                { v: pad(countdown.hours), l: 'horas' },
                { v: pad(countdown.minutes), l: 'min' },
                { v: pad(countdown.seconds), l: 'seg' },
              ].map(({ v, l }) => (
                <div key={l} className="flex flex-col items-center justify-center gap-1 w-[3.5rem] py-3 rounded-2xl"
                  style={{
                    background: 'rgba(255,248,235,0.04)',
                    border: '1px solid rgba(200,146,74,0.18)',
                    boxShadow: 'inset 0 1px 0 rgba(200,146,74,0.07)',
                  }}
                >
                  <span className="tabular-nums font-light" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.9rem', color: '#FBF2E8', lineHeight: 1 }}>
                    {v}
                  </span>
                  <span className="text-[0.5rem] tracking-[0.2em] uppercase" style={{ color: 'rgba(200,146,74,0.5)', fontFamily: 'var(--font-montserrat)' }}>
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,74,0.28), transparent)' }} />

        {/* ── Stats Grid ───────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Confirmados" value={String(confirmed.length)} sub={`de ${primaryGuests.length} convidados`} accent="#6FCF5E" icon="✓" />
          <StatCard label="Pendentes" value={String(pending.length)} sub="aguardando resposta" accent="#C8924A" icon="◌" />
          <StatCard label="Pessoas" value={String(totalPeople)} sub="confirmadas no total" icon="👥" />
          <StatCard label="Taxa" value={`${pct}%`} sub="de confirmação" accent={pct >= 70 ? '#6FCF5E' : pct >= 40 ? '#C8924A' : '#E07850'} icon="📊" />
        </div>

        {/* ── Progress ─────────────────────────────────────── */}
        <div className="rounded-2xl px-6 py-5"
          style={{ background: 'rgba(255,248,235,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[0.62rem] tracking-[0.28em] uppercase" style={{ color: 'rgba(200,146,74,0.58)', fontFamily: 'var(--font-montserrat)' }}>
              Progresso das confirmações
            </p>
            <span className="font-light" style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', color: 'rgba(255,255,255,0.45)' }}>
              {confirmed.length} <span style={{ color: 'rgba(255,255,255,0.18)' }}>/</span> {primaryGuests.length}
            </span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <motion.div
              initial={{ width: 0 }} animate={{ width: `${pct}%` }}
              transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #C8924A, #8BCF70)', boxShadow: '0 0 12px rgba(200,146,74,0.3)' }}
            />
          </div>
          <p className="mt-2 text-right text-[0.62rem]" style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-montserrat)' }}>
            {pct}% confirmados
          </p>
        </div>

        {/* ── Guest Table ──────────────────────────────────── */}
        <div className="rounded-3xl overflow-hidden"
          style={{ background: 'rgba(255,248,235,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Toolbar */}
          <div className="px-5 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
          >
            <div className="flex gap-2 flex-wrap items-center">
              <motion.button
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                onClick={() => setAdding(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-[0.65rem] tracking-[0.12em] uppercase"
                style={{
                  background: 'linear-gradient(135deg, rgba(200,146,74,0.22), rgba(196,103,58,0.16))',
                  color: '#F0C878', border: '1px solid rgba(200,146,74,0.35)',
                  fontFamily: 'var(--font-montserrat)', boxShadow: '0 2px 12px rgba(200,146,74,0.1)',
                }}
              >
                <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span> Adicionar
              </motion.button>

              <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.12)' }} />

              {(['all', 'confirmed', 'pending'] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className="px-4 py-2 rounded-xl text-[0.62rem] tracking-[0.12em] uppercase transition-all"
                  style={{
                    background: filter === f ? 'linear-gradient(135deg, #C8924A, #C4673A)' : 'rgba(255,255,255,0.04)',
                    color: filter === f ? '#FBF2E8' : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${filter === f ? 'transparent' : 'rgba(255,255,255,0.08)'}`,
                    fontFamily: 'var(--font-montserrat)',
                    boxShadow: filter === f ? '0 2px 12px rgba(200,146,74,0.2)' : 'none',
                  }}
                >
                  {f === 'all' ? `Todos · ${primaryGuests.length}` : f === 'confirmed' ? `Confirmados · ${confirmed.length}` : `Pendentes · ${pending.length}`}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar convidado..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl transition-all"
                style={{
                  fontSize: '0.8rem',
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.88)', fontFamily: 'var(--font-montserrat)', outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.45)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(255,255,255,0.22)' }}>⌕</span>
            </div>
          </div>

          {/* List */}
          {listItems.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-4xl font-light mb-3" style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.18)' }}>
                Nenhum convidado
              </p>
              <p className="text-[0.65rem] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.1)', fontFamily: 'var(--font-montserrat)' }}>
                Tente outro filtro ou busca
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-4">
              {listItems.map((item) => {
                if (item.kind === 'companion') {
                  return (
                    <GuestCard key={`companion-${item.guest.id}`}
                      guest={item.guest} companions={[]} expanded={false}
                      onToggleExpand={() => {}} onEdit={() => {}} onUnconfirm={() => {}} onConfirm={() => {}}
                      onDelete={() => setDeleting(item.guest)} actionLoading={false} leaderName={item.leaderName}
                    />
                  )
                }
                return (
                  <GuestCard key={item.guest.id}
                    guest={item.guest}
                    companions={companionMap[item.guest.id] ?? []}
                    expanded={expanded.has(item.guest.id)}
                    onToggleExpand={() => toggleExpanded(item.guest.id)}
                    onEdit={() => setEditing(item.guest)}
                    onUnconfirm={() => setUnconfirming(item.guest)}
                    onConfirm={() => handleConfirm(item.guest)}
                    onDelete={() => setDeleting(item.guest)}
                    actionLoading={actionLoading === item.guest.id}
                  />
                )
              })}
            </div>
          )}
        </div>

        <p className="text-center text-[0.55rem] tracking-[0.35em] uppercase pt-2"
          style={{ color: 'rgba(200,146,74,0.18)', fontFamily: 'var(--font-montserrat)' }}
        >
          Feito com ♥ para Natacha & Mauricio · 01.08.2026
        </p>
      </div>

      <AnimatePresence>
        {editing && <EditModal guest={editing} onClose={() => setEditing(null)} onSave={handleEdit} />}
        {unconfirming && (
          <ConfirmDialog guest={unconfirming} onConfirm={() => handleUnconfirm(unconfirming)} onCancel={() => setUnconfirming(null)} />
        )}
        {deleting && (
          <DeleteDialog guest={deleting} onConfirm={() => handleDelete(deleting)} onCancel={() => setDeleting(null)} />
        )}
        {adding && (
          <AddGuestModal onClose={() => setAdding(false)} onApply={handleAddGuests} />
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────
export default function NoivosPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authenticated) return
    const unsub = subscribeToGuests((data) => {
      setGuests(data)
      setLoading(false)
    })
    return unsub
  }, [authenticated])

  if (!authenticated) return <PasswordModal onSuccess={() => setAuthenticated(true)} />

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#080503' }}>
        <div className="flex flex-col items-center gap-5">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 rounded-full"
            style={{ border: '1.5px solid rgba(200,146,74,0.15)', borderTopColor: '#C8924A' }}
          />
          <p className="text-[0.6rem] tracking-[0.45em] uppercase"
            style={{ color: 'rgba(200,146,74,0.4)', fontFamily: 'var(--font-montserrat)' }}
          >
            Carregando...
          </p>
        </div>
      </div>
    )
  }

  return <Dashboard guests={guests} />
}
