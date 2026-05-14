import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="relative py-20 px-5 text-center overflow-hidden" style={{ background: '#1A100A' }}>
      {/* Ambient sunset glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, rgba(200,146,74,0.1) 0%, transparent 65%)',
        }}
      />
      {/* Top border */}
      <div className="divider-sunset absolute top-0 inset-x-0" />

      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-7">
        <p
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '2.5rem',
            color: '#F0DBBE',
            letterSpacing: '0.07em',
            lineHeight: 1,
          }}
        >
          Natacha &amp; Mauricio
        </p>

        <div className="divider-sunset w-20" />

        <p
          style={{
            fontFamily: 'var(--font-montserrat)',
            fontSize: '0.6rem',
            color: '#8A6A50',
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
          }}
        >
          01 · 08 · 2026 — Mairiporã, SP
        </p>

        <nav className="flex flex-wrap justify-center gap-7 mt-1">
          {[
            ['/historia', 'Nossa História'],
            ['/manual', 'Manual'],
            ['/presentes', 'Presentes'],
            ['/recados', 'Recados'],
            ['/confirmar-presenca', 'Confirmar'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="text-[0.62rem] tracking-[0.22em] uppercase transition-colors duration-300 hover:text-[#E2C09A]"
              style={{ color: '#8A6A50', fontFamily: 'var(--font-montserrat)' }}
            >
              {label}
            </Link>
          ))}
        </nav>

        <p
          className="text-[0.58rem] tracking-widest mt-2"
          style={{ color: 'rgba(138,106,80,0.6)', fontFamily: 'var(--font-montserrat)' }}
        >
          Feito com ♥ para o dia mais lindo das nossas vidas
        </p>
      </div>
    </footer>
  )
}
