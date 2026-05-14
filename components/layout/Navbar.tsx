'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { href: '/', label: 'Início' },
  { href: '/historia', label: 'Nossa História' },
  { href: '/manual', label: 'Manual' },
  { href: '/presentes', label: 'Presentes' },
  { href: '/recados', label: 'Recados' },
  { href: '/confirmar-presenca', label: 'Confirmar' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  if (pathname === '/') return null

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 2.9, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 inset-x-0 z-50 transition-all duration-500"
        style={{
          paddingTop: scrolled ? '12px' : '20px',
          paddingBottom: scrolled ? '12px' : '20px',
          background: scrolled
            ? 'rgba(26, 16, 10, 0.7)'
            : 'rgba(20, 10, 5, 0.32)',
          backdropFilter: scrolled ? 'blur(24px)' : 'blur(10px)',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(10px)',
          borderBottom: scrolled ? '1px solid rgba(200, 146, 74, 0.18)' : '1px solid transparent',
          boxShadow: scrolled ? '0 8px 32px rgba(26,16,10,0.22)' : 'none',
        }}
      >
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none" style={{ fontFamily: 'var(--font-cormorant)' }}>
            <span className="text-xl font-light tracking-widest text-white">
              N &amp; M
            </span>
            <span
              className="text-[0.5rem] tracking-[0.38em] uppercase"
              style={{ color: '#E2C09A', marginTop: '1px' }}
            >
              01 · 08 · 2026
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="relative text-[0.68rem] tracking-[0.22em] uppercase transition-all duration-300 group"
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  color: pathname === href ? '#E2C09A' : 'rgba(255,255,255,0.82)',
                }}
              >
                {label}
                <span
                  className="absolute -bottom-0.5 left-0 h-px transition-all duration-300 origin-left"
                  style={{
                    background: '#C8924A',
                    width: pathname === href ? '100%' : '0',
                    transform: 'scaleX(1)',
                  }}
                />
              </Link>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden flex flex-col gap-1.5 p-2 text-white"
            aria-label="Menu"
          >
            <motion.span
              animate={open ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-px bg-current"
            />
            <motion.span
              animate={open ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
              className="block w-6 h-px bg-current origin-center"
            />
            <motion.span
              animate={open ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
              className="block w-6 h-px bg-current"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center"
            style={{
              background: 'linear-gradient(160deg, #1A100A 0%, #2E1A0E 100%)',
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(200,146,74,0.1) 0%, transparent 65%)' }}
            />
            <nav className="relative z-10 flex flex-col items-center gap-9">
              {links.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.45, ease: 'easeOut' }}
                >
                  <Link
                    href={href}
                    className="text-3xl tracking-widest transition-colors duration-300"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      color: pathname === href ? '#E2C09A' : 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="absolute bottom-10 text-center">
              <p
                className="text-[0.55rem] tracking-[0.4em] uppercase"
                style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
              >
                Natacha &amp; Mauricio · 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
