'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscribeToGuests, confirmGuest, unconfirmGuest, unconfirmGroup, updateGuestInfo } from '@/lib/firestore'
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
        fontSize: '0.44rem',
        letterSpacing: '0.14em',
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
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
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

// ── Confirm Dialog ────────────────────────────────────────
function ConfirmDialog({ guest, onConfirm, onCancel }: { guest: Guest; onConfirm: () => void; onCancel: () => void }) {
  const hasGroup = (guest.companions?.length ?? 0) > 0
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-xs rounded-2xl p-8 flex flex-col items-center gap-5 text-center"
        style={{ background: '#1E100A', border: '1px solid rgba(196,103,58,0.3)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ fontSize: '2rem' }}>⚠</span>
        <div>
          <p className="text-white text-lg font-light mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>Remover confirmação?</p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            {hasGroup
              ? `${guest.name} e ${guest.companions!.length} acompanhante(s) voltarão para pendentes.`
              : `${guest.name} voltará para a lista de pendentes.`}
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button onClick={onCancel} className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl"
            style={{ border: '1px solid rgba(200,146,74,0.2)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            Cancelar
          </button>
          <button onClick={onConfirm} className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl"
            style={{ background: 'rgba(196,103,58,0.25)', color: '#C4673A', border: '1px solid rgba(196,103,58,0.3)', fontFamily: 'var(--font-montserrat)' }}>
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
  actionLoading: boolean
  leaderName?: string
}

function GuestCard({
  guest, companions, expanded, onToggleExpand,
  onEdit, onUnconfirm, onConfirm, actionLoading, leaderName,
}: GuestCardProps) {
  const hasCompanions = companions.length > 0
  const isCompanion = leaderName !== undefined

  // ── Companion search result ───────────────────────────────
  if (isCompanion) {
    return (
      <div
        className="rounded-xl px-4 py-3 flex flex-wrap items-center gap-x-3 gap-y-2"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderLeft: '3px solid rgba(200,146,74,0.5)',
        }}
      >
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#6FCF5E' }} />
        <span style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.92)', fontSize: '1rem', fontWeight: 300 }}>
          {guest.name}
        </span>
        {guest.nucleus && <NucleusBadge nucleus={guest.nucleus} />}
        <span
          className="flex items-center gap-1 px-3 py-1 rounded-full flex-shrink-0"
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.52rem',
            letterSpacing: '0.12em',
            background: 'rgba(200,146,74,0.18)',
            color: '#E8C070',
            border: '1px solid rgba(200,146,74,0.45)',
            whiteSpace: 'nowrap',
          }}
        >
          ↳ junto com <strong style={{ color: '#F0D090' }}>{leaderName}</strong>
        </span>
        <span
          className="ml-auto px-2.5 py-1 rounded-full text-[0.44rem] tracking-[0.16em] uppercase"
          style={{
            fontFamily: 'var(--font-montserrat)',
            background: 'rgba(111,207,94,0.12)',
            color: '#6FCF5E',
            border: '1px solid rgba(111,207,94,0.28)',
            whiteSpace: 'nowrap',
          }}
        >
          Acompanhante
        </span>
      </div>
    )
  }

  // ── Primary guest card ────────────────────────────────────
  const accentColor = guest.confirmed ? '#6FCF5E' : 'rgba(200,146,74,0.35)'
  const accentBorder = guest.confirmed ? 'rgba(111,207,94,0.5)' : 'rgba(200,146,74,0.22)'

  return (
    <div
      className="rounded-xl overflow-hidden transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderLeft: `3px solid ${accentBorder}`,
      }}
    >
      {/* ── Main area — click to expand ──────────────────── */}
      <div
        onClick={hasCompanions ? onToggleExpand : undefined}
        className="px-4 py-3.5 flex flex-col gap-2"
        style={{ cursor: hasCompanions ? 'pointer' : 'default' }}
        onMouseEnter={(e) => { if (hasCompanions) (e.currentTarget.style.background = 'rgba(255,255,255,0.02)') }}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        {/* Row 1: dot + name + badges + expand + actions */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: accentColor }} />

          <span
            className="font-light"
            style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.92)', fontSize: '1.05rem' }}
          >
            {guest.name}
          </span>

          {guest.nucleus && <NucleusBadge nucleus={guest.nucleus} />}

          <span
            className="px-2.5 py-0.5 rounded-full text-[0.44rem] tracking-[0.16em] uppercase flex-shrink-0"
            style={{
              fontFamily: 'var(--font-montserrat)',
              background: guest.confirmed ? 'rgba(111,207,94,0.14)' : 'rgba(200,146,74,0.1)',
              color: guest.confirmed ? '#6FCF5E' : 'rgba(200,146,74,0.8)',
              border: `1px solid ${guest.confirmed ? 'rgba(111,207,94,0.3)' : 'rgba(200,146,74,0.22)'}`,
              whiteSpace: 'nowrap',
            }}
          >
            {guest.confirmed ? '✓ Confirmado' : 'Pendente'}
          </span>

          {/* Spacer + actions (stop propagation so clicks don't toggle) */}
          <div className="ml-auto flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            {guest.confirmed ? (
              <>
                <button
                  onClick={onEdit}
                  disabled={actionLoading}
                  className="px-3 py-1 rounded-lg text-[0.46rem] tracking-[0.14em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                  style={{
                    cursor: 'pointer',
                    background: 'rgba(200,146,74,0.12)',
                    color: '#E0AD6A',
                    border: '1px solid rgba(200,146,74,0.28)',
                    fontFamily: 'var(--font-montserrat)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Editar
                </button>
                <button
                  onClick={onUnconfirm}
                  disabled={actionLoading}
                  className="px-3 py-1 rounded-lg text-[0.46rem] tracking-[0.14em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                  style={{
                    cursor: 'pointer',
                    background: 'rgba(196,103,58,0.1)',
                    color: 'rgba(230,130,90,0.95)',
                    border: '1px solid rgba(196,103,58,0.28)',
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
                className="px-3 py-1 rounded-lg text-[0.46rem] tracking-[0.14em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                style={{
                  cursor: 'pointer',
                  background: 'rgba(111,207,94,0.1)',
                  color: '#6FCF5E',
                  border: '1px solid rgba(111,207,94,0.28)',
                  fontFamily: 'var(--font-montserrat)',
                  whiteSpace: 'nowrap',
                }}
              >
                {actionLoading ? '...' : 'Confirmar'}
              </button>
            )}

            {hasCompanions && (
              <div
                className="flex items-center gap-1 px-2 py-1 rounded-lg"
                style={{
                  background: expanded ? 'rgba(200,146,74,0.18)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(200,146,74,0.22)',
                  color: 'rgba(200,146,74,0.85)',
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.5rem',
                  letterSpacing: '0.1em',
                  userSelect: 'none',
                }}
              >
                <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
                {companions.length} acomp.
              </div>
            )}
          </div>
        </div>

        {/* Row 2: meta info (confirmed only) */}
        {guest.confirmed && (
          <div className="flex items-center gap-4 ml-5 flex-wrap">
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.55)' }}>
              {formatPhone(guest.phone)}
            </span>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.62rem', color: 'rgba(255,255,255,0.55)' }}>
              {guest.totalGuests ?? 1} pessoa{(guest.totalGuests ?? 1) > 1 ? 's' : ''}
            </span>
            <span style={{ fontFamily: 'var(--font-montserrat)', fontSize: '0.58rem', color: 'rgba(255,255,255,0.3)' }}>
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
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(0,0,0,0.1)' }}>
              {companions.map((companion, i) => (
                <div
                  key={companion.id}
                  className="flex items-center gap-3 px-5 py-2.5"
                  style={{
                    borderBottom: i < companions.length - 1 ? '1px solid rgba(255,255,255,0.04)' : undefined,
                    borderLeft: '2px solid rgba(200,146,74,0.25)',
                    marginLeft: '1.25rem',
                  }}
                >
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(111,207,94,0.5)' }} />
                  <span style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.65)', fontSize: '0.9rem', fontWeight: 300 }}>
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

// ── Dashboard ─────────────────────────────────────────────
function Dashboard({ guests }: { guests: Guest[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all')
  const [editing, setEditing] = useState<Guest | null>(null)
  const [unconfirming, setUnconfirming] = useState<Guest | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())
  const countdown = useCountdown()

  // Companion map: leaderId → companion guests
  const companionMap = useMemo(() => {
    const map: Record<string, Guest[]> = {}
    guests.filter((g) => g.groupLeaderId).forEach((g) => {
      if (!map[g.groupLeaderId!]) map[g.groupLeaderId!] = []
      map[g.groupLeaderId!].push(g)
    })
    return map
  }, [guests])

  // Guest lookup map for finding a leader by id
  const guestById = useMemo(() => {
    const map: Record<string, Guest> = {}
    guests.forEach((g) => { map[g.id] = g })
    return map
  }, [guests])

  // Only primary guests (no groupLeaderId)
  const primaryGuests = useMemo(() => guests.filter((g) => !g.groupLeaderId), [guests])
  const confirmed = useMemo(() => primaryGuests.filter((g) => g.confirmed), [primaryGuests])
  const pending = useMemo(() => primaryGuests.filter((g) => !g.confirmed), [primaryGuests])
  const totalPeople = useMemo(() => confirmed.reduce((acc, g) => acc + (g.totalGuests ?? 1), 0), [confirmed])
  const pct = primaryGuests.length ? Math.round((confirmed.length / primaryGuests.length) * 100) : 0

  // Search result item type — either a primary guest or a companion with its leader name
  type SearchItem =
    | { kind: 'primary'; guest: Guest }
    | { kind: 'companion'; guest: Guest; leaderName: string }

  const trimmedSearch = search.trim()

  // When search is active: search ALL guests. When empty: filter by tab (primaries only).
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

  // ── Stats pill data ───────────────────────────────────────
  const statPills = [
    { label: 'Confirmados', value: `${confirmed.length} de ${primaryGuests.length}` },
    { label: 'Pendentes', value: String(pending.length) },
    { label: 'Pessoas confirmadas', value: String(totalPeople) },
    { label: 'Taxa', value: `${pct}%` },
  ]

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #151008 0%, #271610 55%, #1A0E08 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 25% 15%, rgba(200,146,74,0.09) 0%, transparent 55%)' }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pb-10 flex flex-col gap-5 pt-24">

        {/* ── Compact header card ─────────────────────────── */}
        <div
          className="rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(200,146,74,0.2)',
            boxShadow: '0 4px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(200,146,74,0.1)',
          }}
        >
          {/* Title */}
          <div className="flex flex-col gap-0.5">
            <p
              className="text-[0.46rem] tracking-[0.55em] uppercase"
              style={{ color: 'rgba(200,146,74,0.7)', fontFamily: 'var(--font-montserrat)' }}
            >
              Painel dos Noivos · 01.08.2026 · Mairiporã, SP
            </p>
            <h1
              className="text-3xl sm:text-4xl font-light leading-tight"
              style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.95)' }}
            >
              Natacha <span style={{ color: '#C8924A' }}>&</span> Mauricio
            </h1>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-5 flex-shrink-0">
            {[{ v: pad(countdown.days), l: 'dias' }, { v: pad(countdown.hours), l: 'horas' }, { v: pad(countdown.minutes), l: 'min' }].map(({ v, l }, i) => (
              <div key={l} className="flex items-center gap-5">
                {i > 0 && <div className="h-7 w-px" style={{ background: 'rgba(200,146,74,0.2)' }} />}
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className="text-3xl font-light leading-none tabular-nums"
                    style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.92)' }}
                  >
                    {v}
                  </span>
                  <span
                    className="text-[0.4rem] tracking-[0.3em] uppercase"
                    style={{ color: 'rgba(200,146,74,0.65)', fontFamily: 'var(--font-montserrat)' }}
                  >
                    {l}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stat pills row ──────────────────────────────── */}
        <div className="flex flex-wrap gap-2">
          {statPills.map(({ label, value }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(200,146,74,0.18)',
              }}
            >
              <span
                className="text-[0.46rem] tracking-[0.3em] uppercase"
                style={{ color: 'rgba(200,146,74,0.65)', fontFamily: 'var(--font-montserrat)' }}
              >
                {label}
              </span>
              <span
                className="text-sm font-light"
                style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem' }}
              >
                {value}
              </span>
            </div>
          ))}

          {/* Progress bar pill */}
          <div
            className="flex items-center gap-3 px-4 py-2 rounded-full flex-1"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(200,146,74,0.18)',
              minWidth: '160px',
            }}
          >
            <span
              className="text-[0.46rem] tracking-[0.3em] uppercase flex-shrink-0"
              style={{ color: 'rgba(200,146,74,0.65)', fontFamily: 'var(--font-montserrat)' }}
            >
              Progresso
            </span>
            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #C8924A, #C4673A)' }}
              />
            </div>
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
          {/* Toolbar: filter tabs + search in one row */}
          <div
            className="px-4 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'confirmed', 'pending'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-full text-[0.48rem] tracking-[0.18em] uppercase transition-all"
                  style={{
                    background: filter === f ? 'linear-gradient(135deg, #C8924A, #C4673A)' : 'rgba(255,255,255,0.05)',
                    color: filter === f ? '#FBF2E8' : 'rgba(255,255,255,0.45)',
                    border: `1px solid ${filter === f ? 'transparent' : 'rgba(255,255,255,0.1)'}`,
                    fontFamily: 'var(--font-montserrat)',
                  }}
                >
                  {f === 'all'
                    ? `Todos (${primaryGuests.length})`
                    : f === 'confirmed'
                    ? `Confirmados (${confirmed.length})`
                    : `Pendentes (${pending.length})`}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar convidado ou acompanhante..."
              className="w-full sm:w-64 px-4 py-2 rounded-xl text-xs transition-colors"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.88)',
                fontFamily: 'var(--font-montserrat)',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
            />
          </div>

          {/* Cards */}
          {listItems.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-2xl font-light" style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.3)' }}>
                Nenhum convidado encontrado
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 p-3">
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
                    actionLoading={actionLoading === item.guest.id}
                  />
                )
              })}
            </div>
          )}
        </div>

        <p
          className="text-center text-[0.46rem] tracking-[0.3em] uppercase pb-4"
          style={{ color: 'rgba(200,146,74,0.3)', fontFamily: 'var(--font-montserrat)' }}
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
