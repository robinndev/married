'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { GOOGLE_MAPS_URL, WEDDING_DATE } from '@/constants'
import { useCountdown } from '@/hooks/useCountdown'

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE)

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* ── Parallax photo ─────────────────────────────────── */}
      <motion.div style={{ y }} className="absolute inset-0 scale-[1.15]">
        <Image
          src="/images/book2.png"
          alt="Natacha e Mauricio"
          fill
          className="object-cover object-bottom"
          priority
          quality={88}
        />
      </motion.div>

      {/* ── Sunset cinematic overlay ───────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              180deg,
              rgba(26,16,10,0.30) 0%,
              rgba(180,95,55,0.22) 30%,
              rgba(100,40,15,0.18) 50%,
              rgba(26,16,10,0.55) 75%,
              rgba(26,16,10,0.88) 100%
            )
          `,
        }}
      />

      {/* ── Top vignette ──────────────────────────────────── */}
      <div
        className="absolute top-0 inset-x-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 100%)' }}
      />

      {/* ── Warm ambient glow ──────────────────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(196,103,58,0.18) 0%, transparent 60%)',
        }}
      />

      {/* ── Content ────────────────────────────────────────── */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 text-center px-5 flex flex-col items-center gap-6"
      >
        <motion.p
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.0, duration: 0.9 }}
          className="text-[0.6rem] tracking-[0.55em] uppercase"
          style={{ color: 'rgba(226,192,154,0.85)', fontFamily: 'var(--font-montserrat)' }}
        >
          Convidamos você para celebrar
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3.2, duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-[clamp(4rem,12vw,9rem)] font-light text-white leading-[0.92] tracking-tight"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Natacha
          <br />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.6, duration: 0.8 }}
            style={{ color: '#E2C09A' }}
          >
            &
          </motion.span>
          <br />
          Mauricio
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 3.7, duration: 0.7 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="divider-sunset w-20" />
          <p
            className="text-[#E2C09A] tracking-[0.35em]"
            style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.25rem' }}
          >
            01 · 08 · 2026
          </p>
          <p
            className="text-[0.62rem] tracking-[0.28em] uppercase"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-montserrat)' }}
          >
            15:00 Horas · Mairiporã, SP
          </p>
          <div className="divider-sunset w-20" />
        </motion.div>

        {/* ── Countdown — inline, no background ─────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.0, duration: 1.0 }}
          className="flex items-center gap-6 md:gap-10"
        >
          {[
            { value: days, label: 'dias' },
            { value: hours, label: 'horas' },
            { value: minutes, label: 'min' },
            { value: seconds, label: 'seg' },
          ].map(({ value, label }, i) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span
                className="text-[2.4rem] md:text-[2.8rem] font-light text-white leading-none tabular-nums"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                {pad(value)}
              </span>
              <span
                className="text-[0.44rem] tracking-[0.3em] uppercase"
                style={{ color: 'rgba(200,146,74,0.65)', fontFamily: 'var(--font-montserrat)' }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── CTA buttons ────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 4.2, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-3 mt-1"
        >
          <Link
            href="/confirmar-presenca"
            className="px-9 py-3.5 text-[0.68rem] tracking-[0.22em] uppercase transition-all duration-400 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #C8924A, #C4673A)',
              color: '#FBF2E8',
              fontFamily: 'var(--font-montserrat)',
              boxShadow: '0 4px 24px rgba(200,146,74,0.35)',
            }}
          >
            Confirmar Presença
          </Link>

          <Link
            href="/presentes"
            className="px-9 py-3.5 text-[0.68rem] tracking-[0.22em] uppercase transition-all duration-400 hover:scale-105"
            style={{
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.28)',
              color: 'rgba(255,255,255,0.9)',
              fontFamily: 'var(--font-montserrat)',
            }}
          >
            Ver Presentes
          </Link>

          <a
            href={GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="px-9 py-3.5 text-[0.68rem] tracking-[0.22em] uppercase transition-all duration-400 hover:scale-105"
            style={{
              border: '1px solid rgba(200,146,74,0.45)',
              color: '#E2C09A',
              fontFamily: 'var(--font-montserrat)',
              background: 'rgba(200,146,74,0.08)',
            }}
          >
            Como Chegar
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
