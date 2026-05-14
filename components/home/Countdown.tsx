'use client'

import { useCountdown } from '@/hooks/useCountdown'
import { WEDDING_DATE } from '@/constants'
import AnimatedSection from '@/components/ui/AnimatedSection'

export default function Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE)

  const units = [
    { value: days, label: 'Dias' },
    { value: hours, label: 'Horas' },
    { value: minutes, label: 'Minutos' },
    { value: seconds, label: 'Segundos' },
  ]

  return (
    <section
      className="relative py-28 px-5 overflow-hidden"
      style={{ background: 'linear-gradient(160deg, #1A100A 0%, #2E1A0E 50%, #1A100A 100%)' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 100%, rgba(196,103,58,0.2) 0%, transparent 60%)',
        }}
      />
      <div className="divider-sunset absolute top-0 inset-x-0" />
      <div className="divider-sunset absolute bottom-0 inset-x-0" />

      <AnimatedSection className="relative z-10 text-center mb-14">
        <p
          className="text-[0.6rem] tracking-[0.45em] uppercase mb-4"
          style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
        >
          A data se aproxima
        </p>
        <h2
          className="text-4xl md:text-5xl font-light text-white"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Contagem Regressiva
        </h2>
      </AnimatedSection>

      <AnimatedSection delay={0.15} className="relative z-10 max-w-3xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {units.map(({ value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center py-9 px-4 rounded-xl relative overflow-hidden"
              style={{
                background: 'rgba(200,146,74,0.08)',
                border: '1px solid rgba(200,146,74,0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Inner glow */}
              <div
                className="absolute inset-x-0 bottom-0 h-12 pointer-events-none"
                style={{
                  background: 'linear-gradient(0deg, rgba(200,146,74,0.08) 0%, transparent 100%)',
                }}
              />
              <span
                className="text-5xl md:text-6xl font-light tabular-nums relative z-10"
                style={{ fontFamily: 'var(--font-cormorant)', color: '#F0DBBE' }}
              >
                {String(value).padStart(2, '0')}
              </span>
              <span
                className="text-[0.58rem] tracking-[0.32em] uppercase mt-2 relative z-10"
                style={{ fontFamily: 'var(--font-montserrat)', color: '#8A6A50' }}
              >
                {label}
              </span>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  )
}
