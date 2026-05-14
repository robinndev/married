'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function SucessoPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden"
      style={{ background: '#1A100A' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, rgba(200,146,74,0.18) 0%, transparent 60%)',
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 70% 70%, rgba(196,103,58,0.08) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-lg">
        {/* Heart icon */}
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, type: 'spring', stiffness: 160, damping: 12 }}
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #C8924A, #C4673A)',
            boxShadow: '0 0 60px rgba(200,146,74,0.4), 0 0 0 1px rgba(200,146,74,0.25)',
          }}
        >
          <motion.span
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ fontSize: '2.2rem' }}
          >
            ♥
          </motion.span>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-[0.55rem] tracking-[0.5em] uppercase"
          style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
        >
          Presente confirmado
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.8 }}
          className="text-4xl md:text-5xl font-light text-white leading-tight"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Obrigado por fazer parte
          <br />
          <span style={{ color: '#E2C09A' }}>desse momento tão especial</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.75, duration: 0.6 }}
          className="w-16 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #C8924A, transparent)' }}
        />

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.7 }}
          className="flex flex-col gap-3"
        >
          <p
            className="text-xl md:text-2xl font-light"
            style={{ fontFamily: 'var(--font-cormorant)', color: '#E2C09A' }}
          >
            Natacha & Mauricio agradecem de coração.
          </p>
          <p
            className="text-xs leading-relaxed max-w-sm mx-auto"
            style={{ color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-montserrat)' }}
          >
            Seu presente vai ajudar a tornar a nossa lua-de-mel e o nosso novo lar ainda mais especiais.
          </p>
        </motion.div>

        {/* Date */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.7 }}
          className="text-[0.6rem] tracking-[0.4em] uppercase"
          style={{ color: 'rgba(200,146,74,0.5)', fontFamily: 'var(--font-montserrat)' }}
        >
          01 · 08 · 2026 · Mairiporã, SP
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.25, duration: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto"
        >
          <Link
            href="/"
            className="px-8 py-3.5 text-[0.65rem] tracking-[0.22em] uppercase text-center transition-all duration-300 hover:scale-105 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #C8924A, #C4673A)',
              color: '#FBF2E8',
              fontFamily: 'var(--font-montserrat)',
              boxShadow: '0 4px 20px rgba(200,146,74,0.3)',
            }}
          >
            Ir para o início
          </Link>
          <Link
            href="/presentes"
            className="px-8 py-3.5 text-[0.65rem] tracking-[0.22em] uppercase text-center transition-all duration-300 hover:scale-105 rounded-xl"
            style={{
              border: '1px solid rgba(200,146,74,0.35)',
              color: '#E2C09A',
              fontFamily: 'var(--font-montserrat)',
              background: 'rgba(200,146,74,0.06)',
            }}
          >
            Ver outros presentes
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
