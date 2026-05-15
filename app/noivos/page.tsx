'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscribeToGuests, confirmGuest, unconfirmGuest, updateGuestInfo } from '@/lib/firestore'
import type { Guest } from '@/types'

const WEDDING_DATE = new Date('2026-08-01T13:00:00-03:00')
const PASSWORD = '135426'

// ── Helpers ───────────────────────────────────────────────
function pad(n: number) {
  return String(n).padStart(2, '0')
}

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

function formatPhone(phone?: string) {
  if (!phone) return '—'
  return phone
}

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

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 400)
  }, [])

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
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 35%, rgba(200,146,74,0.16) 0%, transparent 60%)' }}
      />

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
          {/* Icon */}
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(200,146,74,0.2), rgba(196,103,58,0.2))',
              border: '1px solid rgba(200,146,74,0.3)',
            }}
          >
            <span style={{ fontSize: '1.6rem' }}>♥</span>
          </motion.div>

          <div className="text-center flex flex-col gap-1">
            <p
              className="text-[0.52rem] tracking-[0.5em] uppercase"
              style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
            >
              Área exclusiva
            </p>
            <h1
              className="text-3xl font-light text-white"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Painel dos Noivos
            </h1>
          </div>

          <div
            className="w-10 h-px"
            style={{ background: 'linear-gradient(90deg, transparent, rgba(200,146,74,0.5), transparent)' }}
          />

          {/* Input */}
          <div className="w-full flex flex-col gap-3">
            <label
              className="text-[0.52rem] tracking-[0.4em] uppercase text-center"
              style={{ color: 'rgba(200,146,74,0.7)', fontFamily: 'var(--font-montserrat)' }}
            >
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
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ◌
              </motion.span>
            ) : (
              'Entrar'
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}

// ── Stat Card ─────────────────────────────────────────────
function StatCard({ label, value, sub, glow }: { label: string; value: string | number; sub?: string; glow?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-2 rounded-2xl px-6 py-5"
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${glow ? 'rgba(200,146,74,0.35)' : 'rgba(200,146,74,0.14)'}`,
        boxShadow: glow ? '0 4px 32px rgba(200,146,74,0.15)' : 'none',
      }}
    >
      <p
        className="text-[0.48rem] tracking-[0.4em] uppercase"
        style={{ color: 'rgba(200,146,74,0.7)', fontFamily: 'var(--font-montserrat)' }}
      >
        {label}
      </p>
      <p
        className="text-4xl font-light text-white leading-none"
        style={{ fontFamily: 'var(--font-cormorant)' }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[0.55rem]" style={{ color: 'rgba(255,255,255,0.35)', fontFamily: 'var(--font-montserrat)' }}>
          {sub}
        </p>
      )}
    </motion.div>
  )
}

// ── Edit Modal ────────────────────────────────────────────
interface EditModalProps {
  guest: Guest
  onClose: () => void
  onSave: (data: { phone: string; totalGuests: number }) => Promise<void>
}

function EditModal({ guest, onClose, onSave }: EditModalProps) {
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <motion.form
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col gap-5"
        style={{
          background: '#1E100A',
          border: '1px solid rgba(200,146,74,0.25)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <p className="text-[0.52rem] tracking-[0.4em] uppercase mb-1" style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}>
            Editar convidado
          </p>
          <h3 className="text-2xl font-light text-white" style={{ fontFamily: 'var(--font-cormorant)' }}>
            {guest.name}
          </h3>
        </div>

        <div>
          <label className="text-[0.52rem] tracking-[0.35em] uppercase block mb-2" style={{ color: 'rgba(200,146,74,0.7)', fontFamily: 'var(--font-montserrat)' }}>
            Telefone
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(11) 99999-9999"
            className="w-full px-4 py-3 rounded-xl text-sm"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(200,146,74,0.22)',
              color: '#FBF2E8',
              fontFamily: 'var(--font-montserrat)',
              outline: 'none',
            }}
          />
        </div>

        <div>
          <label className="text-[0.52rem] tracking-[0.35em] uppercase block mb-2" style={{ color: 'rgba(200,146,74,0.7)', fontFamily: 'var(--font-montserrat)' }}>
            Total de pessoas
          </label>
          <div className="flex gap-2 flex-wrap">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setTotal(n)}
                className="w-10 h-10 rounded-full text-sm transition-all"
                style={{
                  background: total === n ? 'linear-gradient(135deg, #C8924A, #C4673A)' : 'rgba(255,255,255,0.06)',
                  color: total === n ? '#FBF2E8' : 'rgba(255,255,255,0.5)',
                  border: `1px solid ${total === n ? 'transparent' : 'rgba(200,146,74,0.2)'}`,
                  fontFamily: 'var(--font-montserrat)',
                }}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-2">
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
            disabled={loading}
            className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #C8924A, #C4673A)',
              color: '#FBF2E8',
              fontFamily: 'var(--font-montserrat)',
            }}
          >
            {loading ? '...' : 'Salvar'}
          </button>
        </div>
      </motion.form>
    </motion.div>
  )
}

// ── Confirm Unconfirm Dialog ──────────────────────────────
function ConfirmDialog({ name, onConfirm, onCancel }: { name: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 20 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        className="w-full max-w-xs rounded-2xl p-8 flex flex-col items-center gap-5 text-center"
        style={{
          background: '#1E100A',
          border: '1px solid rgba(196,103,58,0.3)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span style={{ fontSize: '2rem' }}>⚠</span>
        <div>
          <p className="text-white text-lg font-light mb-1" style={{ fontFamily: 'var(--font-cormorant)' }}>
            Remover confirmação?
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}>
            {name} voltará para a lista de pendentes.
          </p>
        </div>
        <div className="flex gap-3 w-full">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl"
            style={{ border: '1px solid rgba(200,146,74,0.2)', color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 text-[0.6rem] tracking-[0.2em] uppercase rounded-xl"
            style={{ background: 'rgba(196,103,58,0.25)', color: '#C4673A', border: '1px solid rgba(196,103,58,0.3)', fontFamily: 'var(--font-montserrat)' }}
          >
            Remover
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Dashboard ─────────────────────────────────────────────
function Dashboard({ guests }: { guests: Guest[] }) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'pending'>('all')
  const [editing, setEditing] = useState<Guest | null>(null)
  const [unconfirming, setUnconfirming] = useState<Guest | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const countdown = useCountdown()

  const confirmed = guests.filter((g) => g.confirmed)
  const pending = guests.filter((g) => !g.confirmed)
  const totalPeople = confirmed.reduce((acc, g) => acc + (g.totalGuests ?? 1), 0)
  const pct = guests.length ? Math.round((confirmed.length / guests.length) * 100) : 0

  const filtered = useMemo(() => {
    let base = filter === 'confirmed' ? confirmed : filter === 'pending' ? pending : guests
    if (!search.trim()) return base
    const q = search.toLowerCase()
    return base.filter((g) => g.name.toLowerCase().includes(q))
  }, [guests, filter, search, confirmed, pending])

  const handleUnconfirm = async (guest: Guest) => {
    setActionLoading(guest.id)
    try { await unconfirmGuest(guest.id) } finally {
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

  return (
    <div
      className="min-h-screen"
      style={{ background: 'linear-gradient(160deg, #1A100A 0%, #2E1A0E 60%, #1A100A 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 30% 20%, rgba(200,146,74,0.1) 0%, transparent 55%)' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 pb-10 flex flex-col gap-8">

        {/* ── Hero header ─────────────────────────────────────── */}
        <div
          className="rounded-3xl px-8 py-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-28"
          style={{
            background: 'linear-gradient(135deg, rgba(200,146,74,0.1) 0%, rgba(196,103,58,0.06) 60%, rgba(255,255,255,0.03) 100%)',
            border: '1px solid rgba(200,146,74,0.22)',
            boxShadow: '0 8px 48px rgba(0,0,0,0.25), inset 0 1px 0 rgba(200,146,74,0.15)',
          }}
        >
          <div className="flex flex-col gap-2">
            <p
              className="text-[0.5rem] tracking-[0.55em] uppercase"
              style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
            >
              Painel exclusivo · Área dos noivos
            </p>
            <h1
              className="text-5xl md:text-6xl font-light text-white leading-tight"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Natacha <span style={{ color: '#C8924A' }}>&</span> Mauricio
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <div className="h-px w-8" style={{ background: 'rgba(200,146,74,0.4)' }} />
              <p
                className="text-[0.58rem] tracking-[0.3em] uppercase"
                style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-montserrat)' }}
              >
                01 · 08 · 2026 · Mairiporã, SP
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex gap-6 sm:gap-8 flex-shrink-0">
            {[
              { v: pad(countdown.days), l: 'dias' },
              { v: pad(countdown.hours), l: 'horas' },
              { v: pad(countdown.minutes), l: 'min' },
            ].map(({ v, l }) => (
              <div key={l} className="flex flex-col items-center gap-1">
                <span
                  className="text-4xl font-light text-white leading-none tabular-nums"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  {v}
                </span>
                <span
                  className="text-[0.42rem] tracking-[0.3em] uppercase"
                  style={{ color: 'rgba(200,146,74,0.6)', fontFamily: 'var(--font-montserrat)' }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stats ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total confirmados" value={confirmed.length} sub={`de ${guests.length} convidados`} glow />
          <StatCard label="Pendentes" value={pending.length} sub="aguardando resposta" />
          <StatCard label="Pessoas confirmadas" value={totalPeople} sub="incluindo acompanhantes" />
          <StatCard label="Taxa de confirmação" value={`${pct}%`} sub="do total de convidados" glow={pct >= 50} />
        </div>

        {/* ── Progress bar ────────────────────────────────────── */}
        <div
          className="rounded-xl px-6 py-4 flex flex-col gap-2"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(200,146,74,0.12)',
          }}
        >
          <div className="flex justify-between items-center">
            <p className="text-[0.52rem] tracking-[0.35em] uppercase" style={{ color: 'rgba(200,146,74,0.6)', fontFamily: 'var(--font-montserrat)' }}>
              Progresso das confirmações
            </p>
            <p className="text-[0.52rem]" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-montserrat)' }}>
              {confirmed.length}/{guests.length}
            </p>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #C8924A, #C4673A)' }}
            />
          </div>
        </div>

        {/* ── Guest list ──────────────────────────────────────── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(200,146,74,0.14)',
          }}
        >
          {/* List header */}
          <div
            className="px-5 py-4 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between"
            style={{ borderBottom: '1px solid rgba(200,146,74,0.1)' }}
          >
            <div className="flex gap-2 flex-wrap">
              {(['all', 'confirmed', 'pending'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-4 py-1.5 rounded-full text-[0.52rem] tracking-[0.18em] uppercase transition-all"
                  style={{
                    background: filter === f ? 'linear-gradient(135deg, #C8924A, #C4673A)' : 'rgba(255,255,255,0.05)',
                    color: filter === f ? '#FBF2E8' : 'rgba(255,255,255,0.4)',
                    border: `1px solid ${filter === f ? 'transparent' : 'rgba(200,146,74,0.15)'}`,
                    fontFamily: 'var(--font-montserrat)',
                  }}
                >
                  {f === 'all' ? `Todos (${guests.length})` : f === 'confirmed' ? `Confirmados (${confirmed.length})` : `Pendentes (${pending.length})`}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar convidado..."
              className="w-full sm:w-48 px-4 py-2 rounded-xl text-xs transition-colors"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(200,146,74,0.2)',
                color: '#FBF2E8',
                fontFamily: 'var(--font-montserrat)',
                outline: 'none',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.5)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(200,146,74,0.2)')}
            />
          </div>

          {/* Guest rows */}
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-2xl font-light mb-2" style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.3)' }}>
                Nenhum convidado encontrado
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(200,146,74,0.07)' }}>
              <AnimatePresence initial={false}>
                {filtered.map((guest) => (
                  <motion.div
                    key={guest.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 group"
                    style={{ transition: 'background 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200,146,74,0.04)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Name + status */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: guest.confirmed ? '#5A8A4A' : 'rgba(200,146,74,0.35)' }}
                      />
                      <p
                        className="text-sm font-light truncate"
                        style={{ fontFamily: 'var(--font-cormorant)', color: 'rgba(255,255,255,0.88)', fontSize: '1rem' }}
                      >
                        {guest.name}
                      </p>
                    </div>

                    {/* Meta */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                      {/* Status badge */}
                      <span
                        className="px-3 py-1 rounded-full text-[0.48rem] tracking-[0.2em] uppercase flex-shrink-0"
                        style={{
                          background: guest.confirmed ? 'rgba(90,138,74,0.15)' : 'rgba(200,146,74,0.08)',
                          color: guest.confirmed ? '#7EC86E' : 'rgba(200,146,74,0.6)',
                          border: `1px solid ${guest.confirmed ? 'rgba(90,138,74,0.3)' : 'rgba(200,146,74,0.18)'}`,
                          fontFamily: 'var(--font-montserrat)',
                        }}
                      >
                        {guest.confirmed ? '✓ Confirmado' : 'Pendente'}
                      </span>

                      {/* Phone */}
                      <span
                        className="text-[0.58rem] hidden md:block"
                        style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-montserrat)', minWidth: '9rem' }}
                      >
                        {formatPhone(guest.phone)}
                      </span>

                      {/* Total */}
                      <span
                        className="text-[0.58rem] hidden md:block"
                        style={{ color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-montserrat)', minWidth: '5rem' }}
                      >
                        {guest.confirmed ? `${guest.totalGuests ?? 1} pessoa${(guest.totalGuests ?? 1) > 1 ? 's' : ''}` : '—'}
                      </span>

                      {/* Date */}
                      <span
                        className="text-[0.55rem] hidden lg:block"
                        style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-montserrat)', minWidth: '8rem' }}
                      >
                        {guest.confirmed ? formatDate(guest.confirmedAt) : '—'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {guest.confirmed ? (
                        <>
                          <button
                            onClick={() => setEditing(guest)}
                            disabled={actionLoading === guest.id}
                            className="px-3 py-1.5 rounded-lg text-[0.5rem] tracking-[0.15em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                            style={{
                              background: 'rgba(200,146,74,0.1)',
                              color: 'rgba(200,146,74,0.8)',
                              border: '1px solid rgba(200,146,74,0.2)',
                              fontFamily: 'var(--font-montserrat)',
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setUnconfirming(guest)}
                            disabled={actionLoading === guest.id}
                            className="px-3 py-1.5 rounded-lg text-[0.5rem] tracking-[0.15em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                            style={{
                              background: 'rgba(196,103,58,0.08)',
                              color: 'rgba(196,103,58,0.7)',
                              border: '1px solid rgba(196,103,58,0.2)',
                              fontFamily: 'var(--font-montserrat)',
                            }}
                          >
                            {actionLoading === guest.id ? '...' : 'Remover'}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleConfirm(guest)}
                          disabled={actionLoading === guest.id}
                          className="px-3 py-1.5 rounded-lg text-[0.5rem] tracking-[0.15em] uppercase transition-all hover:opacity-80 disabled:opacity-30"
                          style={{
                            background: 'rgba(90,138,74,0.1)',
                            color: 'rgba(90,138,74,0.8)',
                            border: '1px solid rgba(90,138,74,0.2)',
                            fontFamily: 'var(--font-montserrat)',
                          }}
                        >
                          {actionLoading === guest.id ? '...' : 'Confirmar'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* ── Message from the guest (expanded on mobile) ──── */}
        <p
          className="text-center text-[0.52rem] tracking-[0.3em] uppercase pb-4"
          style={{ color: 'rgba(200,146,74,0.3)', fontFamily: 'var(--font-montserrat)' }}
        >
          Feito com ♥ para Natacha & Mauricio · 01.08.2026
        </p>
      </div>

      {/* ── Modals ──────────────────────────────────────────── */}
      <AnimatePresence>
        {editing && (
          <EditModal
            guest={editing}
            onClose={() => setEditing(null)}
            onSave={handleEdit}
          />
        )}
        {unconfirming && (
          <ConfirmDialog
            name={unconfirming.name}
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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: '#1A100A' }}
      >
        <div className="flex flex-col items-center gap-4">
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'inline-block', fontSize: '1.8rem', color: '#C8924A' }}
          >
            ◌
          </motion.span>
          <p className="text-[0.55rem] tracking-[0.4em] uppercase" style={{ color: 'rgba(200,146,74,0.5)', fontFamily: 'var(--font-montserrat)' }}>
            Carregando convidados...
          </p>
        </div>
      </div>
    )
  }

  return <Dashboard guests={guests} />
}
