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
          style={{
            background: 'linear-gradient(160deg, #FBF2E8 0%, #F0DBBE 40%, #E4CBА0 100%)',
          }}
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(200,146,74,0.12) 0%, transparent 70%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative flex flex-col items-center gap-7"
          >
            {/* Spinner ring */}
            <div className="relative w-18 h-18">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 rounded-full"
                style={{
                  border: '1px solid transparent',
                  borderTopColor: '#C8924A',
                  borderRightColor: 'rgba(200,146,74,0.3)',
                }}
              />
              {/* Inner glow dot */}
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <motion.span
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    fontFamily: 'var(--font-cormorant)',
                    fontSize: '1.35rem',
                    color: '#C8924A',
                  }}
                >
                  ♥
                </motion.span>
              </div>
            </div>

            {/* Names */}
            <div className="text-center flex flex-col gap-1">
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                style={{
                  fontFamily: 'var(--font-cormorant)',
                  fontSize: '2.2rem',
                  color: '#1A100A',
                  letterSpacing: '0.08em',
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
                  fontSize: '0.62rem',
                  color: '#8A6A50',
                  letterSpacing: '0.38em',
                  textTransform: 'uppercase',
                }}
              >
                01 · 08 · 2026
              </motion.p>
            </div>

            {/* Progress bar */}
            <motion.div
              className="h-px rounded-full overflow-hidden"
              style={{ width: '120px', background: 'rgba(200,146,74,0.2)' }}
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
