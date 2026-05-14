'use client'

import { useAudio } from '@/hooks/useAudio'
import { motion } from 'framer-motion'

export default function MusicPlayer() {
  const { playing, toggle } = useAudio('/music/romantic.mp3')

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 3.4, duration: 0.6 }}
      onClick={toggle}
      aria-label={playing ? 'Pausar música' : 'Tocar música'}
      className="fixed bottom-6 right-5 z-50 w-13 h-13 rounded-full flex flex-col items-center justify-center hover:scale-110 transition-transform duration-300"
      style={{
        width: '52px',
        height: '52px',
        background: 'linear-gradient(135deg, rgba(200,146,74,0.25), rgba(196,103,58,0.2))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(200,146,74,0.35)',
        boxShadow: '0 4px 20px rgba(200,146,74,0.2)',
      }}
    >
      {playing ? (
        <div className="flex items-end gap-[3px] h-5">
          {[1, 2, 3, 2, 1].map((h, i) => (
            <motion.span
              key={i}
              animate={{ scaleY: [1, h * 0.9 + 0.4, 1] }}
              transition={{ duration: 0.65, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }}
              className="block w-[3px] rounded-full"
              style={{ height: `${h * 4 + 4}px`, background: '#C8924A', transformOrigin: 'bottom' }}
            />
          ))}
        </div>
      ) : (
        <span style={{ color: '#C8924A', fontSize: '1.1rem' }}>♪</span>
      )}
    </motion.button>
  )
}
