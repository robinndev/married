'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface Props {
  src: string
  eyebrow?: string
  title: string
  subtitle?: string
  minHeight?: string
  objectPosition?: string
}

export default function PageHero({
  src,
  eyebrow,
  title,
  subtitle,
  minHeight = 'min-h-[58vh]',
  objectPosition = 'center',
}: Props) {
  return (
    <section
      className={`relative flex items-end justify-center ${minHeight} overflow-hidden`}
    >
      {/* Photo */}
      <div className="absolute inset-0">
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          style={{ objectPosition }}
          priority
          quality={82}
        />
      </div>

      {/* Sunset cinematic overlay */}
      <div className="cinematic-overlay absolute inset-0" />

      {/* Top gradient — guarantees navbar readability */}
      <div className="nav-top-gradient absolute top-0 inset-x-0 h-36 pointer-events-none" />

      {/* Content — anchored to bottom */}
      <div className="relative z-10 w-full text-center px-5 pb-16 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-4"
        >
          {eyebrow && (
            <p
              className="text-[0.6rem] tracking-[0.5em] uppercase"
              style={{ color: '#E2C09A', fontFamily: 'var(--font-montserrat)' }}
            >
              {eyebrow}
            </p>
          )}
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight"
            style={{ fontFamily: 'var(--font-cormorant)', letterSpacing: '0.03em' }}
          >
            {title}
          </h1>
          <div className="w-14 h-px" style={{ background: '#C8924A' }} />
          {subtitle && (
            <p
              className="text-white/60 text-sm max-w-md mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-montserrat)' }}
            >
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
