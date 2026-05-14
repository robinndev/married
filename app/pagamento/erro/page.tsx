'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ErroPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FBF2E8 0%, #F4E5D0 100%)' }}
    >
      {/* Subtle warm glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(200,146,74,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-7 text-center max-w-md">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 140 }}
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(200,146,74,0.12)',
            border: '1px solid rgba(200,146,74,0.3)',
          }}
        >
          <span style={{ fontSize: '2rem', color: '#C8924A' }}>✕</span>
        </motion.div>

        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-[0.55rem] tracking-[0.45em] uppercase"
          style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
        >
          Pagamento não realizado
        </motion.p>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.7 }}
          className="text-4xl md:text-5xl font-light leading-tight"
          style={{ fontFamily: 'var(--font-cormorant)', color: '#2A1A0F' }}
        >
          Não foi dessa vez...
        </motion.h1>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="w-12 h-px"
          style={{ background: 'linear-gradient(90deg, transparent, #C8924A, transparent)' }}
        />

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.7 }}
          className="text-sm leading-relaxed"
          style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
        >
          Parece que houve um problema com o pagamento. Não se preocupe — nenhum valor foi cobrado. Você pode tentar novamente ou escolher outro presente.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 mt-2 w-full sm:w-auto"
        >
          <Link
            href="/presentes"
            className="px-8 py-3.5 text-[0.65rem] tracking-[0.22em] uppercase text-center transition-all duration-300 hover:scale-105 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #C8924A, #C4673A)',
              color: '#FBF2E8',
              fontFamily: 'var(--font-montserrat)',
              boxShadow: '0 4px 20px rgba(200,146,74,0.28)',
            }}
          >
            Tentar novamente
          </Link>
          <Link
            href="/"
            className="px-8 py-3.5 text-[0.65rem] tracking-[0.22em] uppercase text-center transition-all duration-300 hover:scale-105 rounded-xl"
            style={{
              border: '1px solid rgba(200,146,74,0.3)',
              color: '#C8924A',
              fontFamily: 'var(--font-montserrat)',
              background: 'transparent',
            }}
          >
            Ir para o início
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
