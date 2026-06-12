'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscribeToGuests, confirmGuest, unconfirmGuest, unconfirmGroup, updateGuestInfo, addGuest, deleteGuest } from '@/lib/firestore'
import type { Guest } from '@/types'

const WEDDING_DATE = new Date('2026-08-01T13:00:00-03:00')
const PASSWORD = '135426'

// ── Nucleus helpers ───────────────────────────────────────
const NUCLEUS_LABELS: Record<string, string> = {
  'Noivo':             'Lado do Noivo',
  'Noiva':             'Lado da Noiva',
  'Familia Noivo':     'Família do Noivo',
  'Familia Noiva':     'Família da Noiva',
  'Amigos Noivo':      'Amigos do Noivo',
  'Amigos Noiva':      'Amigos da Noiva',
  'Criança menor de 7':'Criança',
  'Fotografo':         'Fotógrafo',
  'Pastores':          'Pastores',
}

function nucleusLabel(nucleus?: string) {
  return NUCLEUS_LABELS[nucleus ?? ''] ?? nucleus ?? ''
}

function nucleusStyle(nucleus?: string) {
  const n = nucleus ?? ''
  if (n.includes('Noivo')) return { bg: 'rgba(74,120,220,0.18)', color: '#8AABEE', border: 'rgba(74,120,220,0.35)' }
  if (n.includes('Noiva')) return { bg: 'rgba(210,80,140,0.18)', color: '#E080B0', border: 'rgba(210,80,140,0.35)' }
  if (n === 'Criança menor de 7') return { bg: 'rgba(90,178,74,0.18)', color: '#8EDB7A', border: 'rgba(90,178,74,0.35)' }
  return { bg: 'rgba(220,160,74,0.18)', color: '#E0AD6A', border: 'rgba(220,160,74,0.35)' }
}

function NucleusBadge({ nucleus }: { nucleus?: string }) {
  if (!nucleus) return null
  const label = nucleusLabel(nucleus)
  if (!label) return null
  const s = nucleusStyle(nucleus)
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        fontFamily: 'var(--font-montserrat)',
        fontSize: '0.52rem',
        letterSpacing: '0.12em',
        padding: '2px 8px',
        borderRadius: 999,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        flexShrink: 0,
      }}
    >
      {label}
    </span>
  )
}

// ── Helpers ───────────────────────────────────────────────
function pad(n: number) { return String(n).padStart(2, '0') }

function useCountdown() {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0 })
  useEffect(() => {
    const tick = () => {
      const diff = WEDDING_DATE.getTime() - Date.now()
      if (diff <= 0) { setTime({ days: 0, hours: 0, minutes: 0 }); return }
      setTime({
        days: Math.floor(diff / 86_400_000),
        hours: Math.floor((diff % 86_400_000) / 3_600_000),
        minutes: Math.floor((diff % 3_600_000) / 60_000),
      })
    }
    tick()
    const id = setInterval(tick, 30_000)
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
    <div
      className="min-h-screen flex items-center justify-center px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1A100A 0%, #2E1A0E 60%, #3A200E 100%)' }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(200,146,74,0.16) 0%, transparent 60%)' }} />
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        className="relative z-10 w-full max-w-sm"
      >
        <form
          onSubmit={submit}
          className="flex flex-col items-center gap-7 rounded-3xl px-8 py-10"
          style={{
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(200,146,74,0.2)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.4)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(200,146,74,0.2), rgba(196,103,58,0.2))', border: '1px solid rgba(200,146,74,0.3)' }}
          >
            <span style={{ fontSize: '1.6rem' }}>♥</span>
          </motion.div>
          <div className="text-center flex flex-col gap-1">
            <p className="text-[0.52rem] tracking-[0.5em] uppercase" style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}>
              Área exclusiva
            </p>
            <h1 className="text-3xl font-light text-white" style={{ fontFamily: 'var(--font-cormorant)' }}>
              Painel dos Noivos
            </h1>
          </div>
          <div className="w-10 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,74,0.5), transparent)' }} />
          <div className="w-full flex flex-col gap-3">
            <label className="text-[0.52rem] tracking-[0.4em] uppercase text-center" style={{ color: 'rgba(200,146,74,0.7)', fontFamily: 'var(--font-montserrat)' }}>
              Senha de acesso
            </label>
            <motion.input
              ref={inputRef}
              animate={error ? { x: [-6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.3 }}
              type="password"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="••••••"
              maxLength={20}
              className="w-full px-5 py-4 rounded-xl text-center text-lg tracking-[0.4em] transition-all"
              style={{
                background: error ? 'rgba(196,103,58,0.12)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${error ? 'rgba(196,103,58,0.5)' : 'rgba(200,146,74,0.25)'}`,
                color: '#FBF2E8',
                fontFamily: 'var(--font-montserrat)',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.55)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = error ? 'rgba(196,103,58,0.5)' : 'rgba(200,146,74,0.25)')}
            />
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-[0.58rem] text-center tracking-widest"
                  style={{ color: '#C4673A', fontFamily: 'var(--font-montserrat)' }}
                >
                  Senha incorreta
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading || !value}
            className="w-full py-4 text-[0.65rem] tracking-[0.25em] uppercase rounded-xl transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #C8924A, #C4673A)',
              color: '#FBF2E8',
              fontFamily: 'var(--font-montserrat)',
              boxShadow: '0 4px 24px rgba(200,146,74,0.25)',
            }}
          >
            {loading ? (
              <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} style={{ display: 'inline-block' }}>◌</motion.span>
            ) : 'Entrar'}
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
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-5"
        style={{ background: '#1E100A', border: '1px solid rgba(200,146,74,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-[0.52rem] tracking-[0.4em] uppercase mb-1" style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}>Editar convidado</p>
          <h3 className="text-2xl font-light text-white" style={{ fontFamily: 'var(--font-cormorant)' }}>{guest.name}</h3>
        </div>
        <div>
          <label className="text-[0.52rem] tracking-[0.35em] uppercase block mb-2" style={{ color: 'rgba(200,146,74,0.7)', fontFamily: 'var(--font-montserrat)' }}>Telefone</label>
          <input
            type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 99999-9999"
            className="w-full px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,146,74,0.22)', color: '#FBF2E8', fontFamily: 'var(--font-montserrat)', outline: 'none' }}
          />
        </div>
        <div>
          <label className="text-[0.52rem] tracking-[0.35em] uppercase block mb-2" style={{ color: 'rgba(200,146,74,0.7)', fontFamily: 'var(--font-montserrat)' }}>Total de pessoas</label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <button key={n} type="button" onClick={() => setTotal(n)} className="w-10 h-10 rounded-full text-sm transition-all"
                style={{
                  background: total === n ? 'linear-gradient(135deg, #C8924A, #C4673A)' : 'rgba(255,255,255,0.06)',
                  color: total === n ? '#FBF2E8' : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${total === n ? 'transparent' : 'rgba(200,146,74,0.2)'}`,
                  fontFamily: 'var(--font-montserrat)',
                }}
              >{n}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onClose} className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl transition-opacity hover:opacity-70"
            style={{ border: '1px solid rgba(200,146,74,0.2)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            Cancelar
          </button>
          <button type="submit" disabled={loading} className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #C8924A, #C4673A)', color: '#FBF2E8', fontFamily: 'var(--font-montserrat)' }}>
            {loading ? '...' : 'Salvar'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

// ── Add Guest Modal ───────────────────────────────────────
const NUCLEUS_OPTIONS = [
  'Noivo', 'Noiva', 'Familia Noivo', 'Familia Noiva',
  'Amigos Noivo', 'Amigos Noiva', 'Criança menor de 7', 'Fotografo', 'Pastores',
]

interface GuestEntry { name: string; nucleus: string }

function AddGuestModal({ onClose, onApply }: { onClose: () => void; onApply: (entries: GuestEntry[]) => Promise<void> }) {
  const [entries, setEntries] = useState<GuestEntry[]>([{ name: '', nucleus: '' }])
  const [loading, setLoading] = useState(false)

  const updateEntry = (i: number, field: keyof GuestEntry, value: string) =>
    setEntries((prev) => prev.map((e, idx) => (idx === i ? { ...e, [field]: value } : e)))

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

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(200,146,74,0.22)',
    color: '#FBF2E8',
    fontFamily: 'var(--font-montserrat)',
    outline: 'none',
    fontSize: '0.8rem',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-start justify-center px-5 py-8 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onSubmit={submit}
        className="w-full max-w-lg rounded-2xl flex flex-col gap-5 my-auto"
        style={{ background: '#1A0E08', border: '1px solid rgba(200,146,74,0.25)', boxShadow: '0 32px 80px rgba(0,0,0,0.6)', padding: '2rem' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-[0.52rem] tracking-[0.4em] uppercase mb-1" style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}>
            Painel dos noivos
          </p>
          <h3 className="text-2xl font-light text-white" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Adicionar convidados
          </h3>
        </div>

        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,74,0.2), transparent)' }} />

        <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {entries.map((entry, i) => (
            <div
              key={i}
              className="flex flex-col gap-2 rounded-xl p-4 relative"
              style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {entries.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeEntry(i)}
                  className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-opacity hover:opacity-100"
                  style={{ background: 'rgba(196,103,58,0.15)', color: '#E07850', border: '1px solid rgba(196,103,58,0.25)', opacity: 0.7 }}
                >
                  ×
                </button>
              )}
              <p className="text-[0.5rem] tracking-[0.3em] uppercase" style={{ color: 'rgba(200,146,74,0.5)', fontFamily: 'var(--font-montserrat)' }}>
                Convidado {i + 1}
              </p>
              <input
                type="text"
                value={entry.name}
                onChange={(e) => updateEntry(i, 'name', e.target.value)}
                placeholder="Nome completo"
                required={i === 0}
                className="w-full px-4 py-2.5 rounded-xl"
                style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.22)')}
              />
              <select
                value={entry.nucleus}
                onChange={(e) => updateEntry(i, 'nucleus', e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl"
                style={{ ...inputStyle, cursor: 'pointer' }}
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
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-[0.6rem] tracking-[0.2em] uppercase transition-all hover:opacity-80"
          style={{ border: '1px dashed rgba(200,146,74,0.3)', color: 'rgba(200,146,74,0.7)', fontFamily: 'var(--font-montserrat)' }}
        >
          <span style={{ fontSize: '1rem', lineHeight: 1 }}>+</span> Adicionar mais um
        </button>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl transition-opacity hover:opacity-70"
            style={{ border: '1px solid rgba(200,146,74,0.2)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || !entries.some((e) => e.name.trim())}
            className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #C8924A, #C4673A)', color: '#FBF2E8', fontFamily: 'var(--font-montserrat)' }}
          >
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
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-xs rounded-2xl p-8 flex flex-col items-center gap-5 text-center"
        style={{ background: '#1E100A', border: '1px solid rgba(196,103,58,0.35)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(196,103,58,0.15)', border: '1px solid rgba(196,103,58,0.3)' }}>
          <span style={{ fontSize: '1.3rem' }}>🗑</span>
        </div>
        <div>
          <p className="text-white text-xl font-light mb-1.5" style={{ fontFamily: 'var(--font-cormorant)' }}>Excluir convidado?</p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            {hasCompanions
              ? `${guest.name} e ${guest.companions!.length} acompanhante(s) serão removidos permanentemente.`
              : `${guest.name} será removido permanentemente da lista.`}
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl transition-opacity hover:opacity-70"
            style={{ border: '1px solid rgba(200,146,74,0.2)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl"
            style={{ background: 'rgba(196,103,58,0.25)', color: '#E07850', border: '1px solid rgba(196,103,58,0.4)', fontFamily: 'var(--font-montserrat)' }}
          >
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
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(10px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-xs rounded-2xl p-8 flex flex-col items-center gap-5 text-center"
        style={{ background: '#1E100A', border: '1px solid rgba(196,103,58,0.3)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'rgba(196,103,58,0.15)', border: '1px solid rgba(196,103,58,0.3)' }}>
          <span style={{ fontSize: '1.3rem' }}>⚠</span>
        </div>
        <div>
          <p className="text-white text-xl font-light mb-1.5" style={{ fontFamily: 'var(--font-cormorant)' }}>Remover confirmação?</p>
          <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            {hasGroup
              ? `${guest.name} e ${guest.companions!.length} acompanhante(s) voltarão para pendentes.`
              : `${guest.name} voltará para a lista de pendentes.`}
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel} className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl transition-opacity hover:opacity-70"
            style={{ border: '1px solid rgba(200,146,74,0.2)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl"
            style={{ background: 'rgba(196,103,58,0.2)', color: '#E07850', border: '1px solid rgba(196,103,58,0.35)', fontFamily: 'var(--font-montserrat)' }}>
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

  // ── Companion search result ───────────────────────────────
  if (isCompanion) {
    return (
      <div
        className="rounded-xl px-4 py-3.5 flex flex-wrap items-center gap-x-3 gap-y-2"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderLeft: '3px solid rgba(200,146,74,0.4)',
        }}
      >
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#6FCF5E' }} />
        <span style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.9)', fontSize: '1rem', fontWeight: 300 }}>
          {guest.name}
        </span>
        {guest.nucleus && <NucleusBadge nucleus={guest.nucleus} />}
        <span
          className="flex items-center gap-1 px-3 py-1 rounded-full flex-shrink-0"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.54rem',
            letterSpacing: '0.1em',
            background: 'rgba(200,146,74,0.15)',
            color: '#E8C070',
            border: '1px solid rgba(200,146,74,0.35)',
            whiteSpace: 'nowrap',
          }}
        >
          junto com <strong style={{ color: '#F0D090' }}>{leaderName}</strong>
        </span>
        <span
          className="ml-auto px-2.5 py-1 rounded-full text-[0.5rem] tracking-[0.14em] uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            background: 'rgba(111,207,94,0.1)',
            color: '#6FCF5E',
            border: '1px solid rgba(111,207,94,0.25)',
            whiteSpace: 'nowrap',
          }}
        >
          Acompanhante
        </span>
      </div>
    )
  }

  // ── Primary guest card ────────────────────────────────────
  const isConfirmed = guest.confirmed
  const accentBorder = isConfirmed ? 'rgba(111,207,94,0.5)' : 'rgba(200,146,74,0.22)'
  const dotColor = isConfirmed ? '#6FCF5E' : 'rgba(200,146,74,0.5)'

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderLeft: `3px solid ${accentBorder}`,
      }}
    >
      {/* ── Main row ─────────────────────────────────────── */}
      <div
        onClick={hasCompanions ? onToggleExpand : undefined}
        className="px-4 py-4 flex flex-col gap-2.5"
        style={{ cursor: hasCompanions ? 'pointer' : 'default' }}
        onMouseEnter={(e) => { if (hasCompanions) (e.currentTarget.style.background = 'rgba(255,255,255,0.02)') }}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Row 1: status dot · name · nucleus badge · status pill · [actions] */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dotColor }} />

          <span
            className="font-light"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.93)', fontSize: '1.1rem' }}
          >
            {guest.name}
          </span>

          {guest.nucleus && <NucleusBadge nucleus={guest.nucleus} />}

          <span
            className="px-2.5 py-0.5 rounded-full text-[0.5rem] tracking-[0.14em] uppercase flex-shrink-0"
            style={{
              fontFamily: 'var(--font-montserrat)',
              background: isConfirmed ? 'rgba(111,207,94,0.12)' : 'rgba(200,146,74,0.1)',
              color: isConfirmed ? '#6FCF5E' : 'rgba(200,146,74,0.8)',
              border: `1px solid ${isConfirmed ? 'rgba(111,207,94,0.28)' : 'rgba(200,146,74,0.2)'}`,
              whiteSpace: 'nowrap',
            }}
          >
            {isConfirmed ? '✓ Confirmado' : 'Pendente'}
          </span>

          {/* Actions (stop propagation) */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {isConfirmed ? (
              <>
                <button
                  onClick={onEdit}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg text-[0.52rem] tracking-[0.12em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                  style={{
                    cursor: 'pointer',
                    background: 'rgba(200,146,74,0.1)',
                    color: '#E0AD6A',
                    border: '1px solid rgba(200,146,74,0.25)',
                    fontFamily: 'var(--font-montserrat)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={onUnconfirm}
                  disabled={actionLoading}
                  className="px-3 py-1.5 rounded-lg text-[0.52rem] tracking-[0.12em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                  style={{
                    cursor: 'pointer',
                    background: 'rgba(196,103,58,0.1)',
                    color: '#E07850',
                    border: '1px solid rgba(196,103,58,0.25)',
                    fontFamily: 'var(--font-montserrat)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {actionLoading ? '...' : 'Remover'}
                </button>
              </>
            ) : (
              <button
                onClick={onConfirm}
                disabled={actionLoading}
                className="px-3 py-1.5 rounded-lg text-[0.52rem] tracking-[0.12em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                style={{
                  cursor: 'pointer',
                  background: 'rgba(111,207,94,0.1)',
                  color: '#6FCF5E',
                  border: '1px solid rgba(111,207,94,0.25)',
                  fontFamily: 'var(--font-montserrat)',
                  whiteSpace: 'nowrap',
                }}
              >
                {actionLoading ? '...' : 'Confirmar'}
              </button>
            )}

            <button
              onClick={onDelete}
              disabled={actionLoading}
              title="Excluir permanentemente"
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:opacity-80 disabled:opacity-30"
              style={{
                cursor: 'pointer',
                background: 'rgba(196,103,58,0.08)',
                color: 'rgba(196,103,58,0.6)',
                border: '1px solid rgba(196,103,58,0.18)',
                fontSize: '0.75rem',
                flexShrink: 0,
              }}
            >
              🗑
            </button>

            {hasCompanions && (
              <div
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg"
                style={{
                  background: expanded ? 'rgba(200,146,74,0.15)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(200,146,74,0.2)',
                  color: 'rgba(200,146,74,0.85)',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.52rem',
                  letterSpacing: '0.08em',
                  userSelect: 'none',
                }}
              >
                <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', fontSize: '0.5rem' }}>▼</span>
                {companions.length} acomp.
              </div>
            )}
          </div>
        </div>

        {/* Row 2: meta — phone · total guests · date */}
        {isConfirmed && (
          <div className="flex items-center gap-5 ml-[18px] flex-wrap">
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
              📞 {formatPhone(guest.phone)}
            </span>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)' }}>
              👥 {guest.totalGuests ?? 1} pessoa{(guest.totalGuests ?? 1) > 1 ? 's' : ''}
            </span>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.28)' }}>
              {formatDate(guest.confirmedAt)}
            </span>
          </div>
        )}
      </div>

      {/* ── Companions collapse ───────────────────────────── */}
      <AnimatePresence>
        {expanded && hasCompanions && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(0,0,0,0.12)' }}>
              {companions.map((companion, i) => (
                <div
                  key={companion.id}
                  className="flex items-center gap-3 py-3"
                  style={{
                    padding: '10px 20px 10px 36px',
                    borderBottom: i < companions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                    borderLeft: '2px solid rgba(200,146,74,0.2)',
                    marginLeft: '20px',
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(111,207,94,0.5)' }} />
                  <span style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.65)', fontSize: '0.95rem', fontWeight: 300 }}>
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
function StatCard({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: string }) {
  return (
    <div
      className="flex flex-col gap-1 rounded-2xl px-5 py-4"
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: 'inset 0 1px 0 rgba(200,146,74,0.06)',
      }}
    >
      <p
        className="text-[0.5rem] tracking-[0.35em] uppercase"
        style={{ color: 'rgba(200,146,74,0.6)', fontFamily: 'var(--font-montserrat)' }}
      >
        {label}
      </p>
      <p
        className="text-3xl font-light leading-none"
        style={{ fontFamily: 'var(--font-cormorant)', color: accent ?? 'rgba(255,255,255,0.93)' }}
      >
        {value}
      </p>
      {sub && (
        <p
          className="text-[0.58rem]"
          style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-montserrat)' }}
        >
          {sub}
        </p>
      )}
    </div>
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
      if (next.has(id)) { next.delete(id) } else { next.add(id) }
      return next
    })
  }

  const handleUnconfirm = async (guest: Guest) => {
    setActionLoading(guest.id)
    try {
      const companions = guest.companions ?? []
      if (companions.length > 0) {
        await unconfirmGroup(guest.id, companions)
      } else {
        await unconfirmGuest(guest.id)
      }
    } finally {
      setActionLoading(null)
      setUnconfirming(null)
    }
  }

  const handleConfirm = async (guest: Guest) => {
    setActionLoading(guest.id)
    try {
      await confirmGuest(guest.id, { phone: guest.phone ?? '—', totalGuests: guest.totalGuests ?? 1 })
    } finally { setActionLoading(null) }
  }

  const handleEdit = async (data: { phone: string; totalGuests: number }) => {
    if (!editing) return
    await updateGuestInfo(editing.id, data)
  }

  const handleDelete = async (guest: Guest) => {
    setActionLoading(guest.id)
    try {
      await deleteGuest(guest.id, guest.companions ?? [])
    } finally {
      setActionLoading(null)
      setDeleting(null)
    }
  }

  const handleAddGuests = async (entries: GuestEntry[]) => {
    await Promise.all(entries.map((e) => addGuest({ name: e.name, nucleus: e.nucleus || undefined })))
  }

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #151008 0%, #271610 55%, #1A0E08 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 20% 10%, rgba(200,146,74,0.1) 0%, transparent 55%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-16 pb-12 flex flex-col gap-6">

        {/* ── Header ──────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div className="flex flex-col gap-1">
            <p
              className="text-[0.5rem] tracking-[0.5em] uppercase"
              style={{ color: 'rgba(200,146,74,0.65)', fontFamily: 'var(--font-montserrat)' }}
            >
              Área exclusiva · 01.08.2026 · Mairiporã, SP
            </p>
            <h1
              className="text-4xl sm:text-5xl font-light leading-tight"
              style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.95)' }}
            >
              Natacha <span style={{ color: '#C8924A' }}>&</span> Mauricio
            </h1>
          </div>

          {/* Countdown */}
          <div
            className="flex items-center gap-5 px-5 py-3 rounded-2xl flex-shrink-0 self-start sm:self-auto"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(200,146,74,0.2)',
            }}
          >
            {[{ v: pad(countdown.days), l: 'dias' }, { v: pad(countdown.hours), l: 'horas' }, { v: pad(countdown.minutes), l: 'min' }].map(({ v, l }, i) => (
              <div key={l} className="flex items-center gap-5">
                {i > 0 && <div className="h-6 w-px" style={{ background: 'rgba(200,146,74,0.2)' }} />}
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className="text-3xl font-light leading-none tabular-nums"
                    style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.92)' }}
                  >
                    {v}
                  </span>
                  <span
                    className="text-[0.42rem] tracking-[0.28em] uppercase"
                    style={{ color: 'rgba(200,146,74,0.6)', fontFamily: 'var(--font-montserrat)' }}
                  >
                    {l}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,74,0.25), transparent)' }} />

        {/* ── Stats grid ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard
            label="Confirmados"
            value={String(confirmed.length)}
            sub={`de ${primaryGuests.length} convidados`}
            accent="#6FCF5E"
          />
          <StatCard
            label="Pendentes"
            value={String(pending.length)}
            sub="aguardando resposta"
            accent="rgba(200,146,74,0.9)"
          />
          <StatCard
            label="Pessoas"
            value={String(totalPeople)}
            sub="confirmadas no total"
          />
          <StatCard
            label="Taxa"
            value={`${pct}%`}
            sub="de confirmação"
            accent={pct >= 70 ? '#6FCF5E' : pct >= 40 ? '#E0AD6A' : '#E07850'}
          />
        </div>

        {/* Progress bar */}
        <div
          className="rounded-2xl px-5 py-4 flex flex-col gap-2"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-center justify-between">
            <p className="text-[0.5rem] tracking-[0.35em] uppercase" style={{ color: 'rgba(200,146,74,0.6)', fontFamily: 'var(--font-montserrat)' }}>
              Progresso das confirmações
            </p>
            <p className="text-[0.6rem]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-montserrat)' }}>
              {confirmed.length} / {primaryGuests.length}
            </p>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #C8924A, #6FCF5E)' }}
            />
          </div>
        </div>

        {/* ── Guest table ─────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          {/* Toolbar */}
          <div
            className="px-4 py-3.5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex gap-1.5 flex-wrap items-center">
              <button
                onClick={() => setAdding(true)}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[0.52rem] tracking-[0.16em] uppercase transition-all hover:opacity-80"
                style={{
                  background: 'linear-gradient(135deg, rgba(200,146,74,0.2), rgba(196,103,58,0.2))',
                  color: '#E0AD6A',
                  border: '1px solid rgba(200,146,74,0.35)',
                  fontFamily: 'var(--font-montserrat)',
                }}
              >
                <span style={{ fontSize: '0.9rem', lineHeight: 1 }}>+</span> Adicionar
              </button>
              <div className="w-px h-4 mx-1" style={{ background: 'rgba(255,255,255,0.1)' }} />
              {(['all', 'confirmed', 'pending'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-1.5 rounded-full text-[0.52rem] tracking-[0.16em] uppercase transition-all"
                  style={{
                    background: filter === f ? 'linear-gradient(135deg, #C8924A, #C4673A)' : 'rgba(255,255,255,0.05)',
                    color: filter === f ? '#FBF2E8' : 'rgba(255,255,255,0.45)',
                    border: `1px solid ${filter === f ? 'transparent' : 'rgba(255,255,255,0.09)'}`,
                    fontFamily: 'var(--font-montserrat)',
                  }}
                >
                  {f === 'all'
                    ? `Todos · ${primaryGuests.length}`
                    : f === 'confirmed'
                    ? `Confirmados · ${confirmed.length}`
                    : `Pendentes · ${pending.length}`}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar convidado..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs transition-colors"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.88)',
                  fontFamily: 'var(--font-montserrat)',
                  outline: 'none',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.45)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
                ⌕
              </span>
            </div>
          </div>

          {/* List */}
          {listItems.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-3xl font-light mb-2" style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.25)' }}>
                Nenhum convidado encontrado
              </p>
              <p className="text-[0.58rem] tracking-widest uppercase" style={{ color: 'rgba(255,255,255,0.15)', fontFamily: 'var(--font-montserrat)' }}>
                Tente outro filtro ou busca
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 p-3">
              {listItems.map((item) => {
                if (item.kind === 'companion') {
                  return (
                    <GuestCard
                      key={`companion-${item.guest.id}`}
                      guest={item.guest}
                      companions={[]}
                      expanded={false}
                      onToggleExpand={() => {}}
                      onEdit={() => {}}
                      onUnconfirm={() => {}}
                      onConfirm={() => {}}
                      onDelete={() => setDeleting(item.guest)}
                      actionLoading={false}
                      leaderName={item.leaderName}
                    />
                  )
                }
                return (
                  <GuestCard
                    key={item.guest.id}
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

        <p
          className="text-center text-[0.46rem] tracking-[0.3em] uppercase pt-2"
          style={{ color: 'rgba(200,146,74,0.25)', fontFamily: 'var(--font-montserrat)' }}
        >
          Feito com ♥ para Natacha & Mauricio · 01.08.2026
        </p>
      </div>

      <AnimatePresence>
        {editing && <EditModal guest={editing} onClose={() => setEditing(null)} onSave={handleEdit} />}
        {unconfirming && (
          <ConfirmDialog
            guest={unconfirming}
            onConfirm={() => handleUnconfirm(unconfirming)}
            onCancel={() => setUnconfirming(null)}
          />
        )}
        {deleting && (
          <DeleteDialog
            guest={deleting}
            onConfirm={() => handleDelete(deleting)}
            onCancel={() => setDeleting(null)}
          />
        )}
        {adding && (
          <AddGuestModal
            onClose={() => setAdding(false)}
            onApply={handleAddGuests}
          />
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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#151008' }}>
        <div className="flex flex-col items-center gap-4">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'inline-block', fontSize: '1.8rem', color: '#C8924A' }}
          >
            ◌
          </motion.span>
          <p
            className="text-[0.55rem] tracking-[0.4em] uppercase"
            style={{ color: 'rgba(200,146,74,0.5)', fontFamily: 'var(--font-montserrat)' }}
          >
            Carregando convidados...
          </p>
        </div>
      </div>
    )
  }

  return <Dashboard guests={guests} />
}
