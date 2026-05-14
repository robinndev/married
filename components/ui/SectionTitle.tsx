import AnimatedSection from './AnimatedSection'

interface Props {
  eyebrow?: string
  title: string
  subtitle?: string
  light?: boolean
  center?: boolean
}

export default function SectionTitle({ eyebrow, title, subtitle, light = false, center = true }: Props) {
  return (
    <AnimatedSection className={`max-w-2xl ${center ? 'mx-auto text-center' : ''} px-5`}>
      {eyebrow && (
        <p
          className="text-[0.6rem] tracking-[0.45em] uppercase mb-4"
          style={{ color: '#C8924A', fontFamily: 'var(--font-montserrat)' }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className="text-4xl md:text-5xl font-light leading-tight"
        style={{
          fontFamily: 'var(--font-cormorant)',
          color: light ? '#FBF2E8' : '#2A1A0F',
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-4 text-sm leading-relaxed"
          style={{
            color: light ? 'rgba(251,242,232,0.65)' : '#8A6A50',
            fontFamily: 'var(--font-montserrat)',
          }}
        >
          {subtitle}
        </p>
      )}
      <div className="divider-sunset mt-6" style={{ width: '4rem', ...(center ? { margin: '1.5rem auto 0' } : {}) }} />
    </AnimatedSection>
  )
}
