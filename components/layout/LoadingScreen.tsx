'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 2800)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ background: '#1A100A' }}
        >
          {/* Warm radial glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(200,146,74,0.18) 0%, transparent 65%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative flex flex-col items-center gap-8"
          >
            {/* Spinner ring */}
            <div className="relative w-16 h-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full absolute inset-0"
                style={{
                  border: '1px solid transparent',
                  borderTopColor: '#C8924A',
                  borderRightColor: 'rgba(200,146,74,0.25)',
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.4rem',
                    color: '#C8924A',
                  }}
                >
                  ♥
                </motion.span>
              </div>
            </div>

            {/* Names */}
            <div className="text-center flex flex-col gap-2">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '2.4rem',
                  color: '#FBF2E8',
                  letterSpacing: '0.06em',
                  lineHeight: 1,
                }}
              >
                Natacha &amp; Mauricio
              </motion.p>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.7 }}
                style={{
                  fontFamily: 'var(--font-montserrat)',
                  fontSize: '0.58rem',
                  color: 'rgba(200,146,74,0.75)',
                  letterSpacing: '0.42em',
                  textTransform: 'uppercase',
                }}
              >
                01 · 08 · 2026
              </motion.p>
            </div>

            {/* Progress bar */}
            <motion.div
              className="h-px rounded-full overflow-hidden"
              style={{ width: '100px', background: 'rgba(200,146,74,0.15)' }}
            >
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 2.4, delay: 0.3, ease: 'easeInOut' }}
                className="h-full origin-left rounded-full"
                style={{ background: 'linear-gradient(90deg, #C8924A, #C4673A)' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
