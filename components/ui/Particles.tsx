'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; opacity: number; life: number; maxLife: number
  r: number; g: number; b: number
}

export default function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = window.innerWidth, h = window.innerHeight
    canvas.width = w; canvas.height = h

    const onResize = () => {
      w = window.innerWidth; h = window.innerHeight
      canvas.width = w; canvas.height = h
    }
    window.addEventListener('resize', onResize)

    // Warm sunset color variants for particles
    const colors = [
      { r: 200, g: 146, b: 74 },  // amber gold
      { r: 196, g: 103, b: 58 },  // burnt orange
      { r: 226, g: 192, b: 154 }, // warm sand
      { r: 212, g: 160, b: 90 },  // golden amber
    ]

    const MAX = 32
    const particles: Particle[] = []

    const spawn = (): Particle => {
      const c = colors[Math.floor(Math.random() * colors.length)]
      return {
        x: Math.random() * w, y: h + 10,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(Math.random() * 0.55 + 0.18),
        size: Math.random() * 2.2 + 0.4,
        opacity: 0, life: 0,
        maxLife: Math.random() * 240 + 180,
        ...c,
      }
    }

    for (let i = 0; i < MAX; i++) {
      const p = spawn()
      p.y = Math.random() * h
      p.life = Math.random() * p.maxLife
      particles.push(p)
    }

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.life++; p.x += p.vx; p.y += p.vy
        const t = p.life / p.maxLife
        p.opacity = t < 0.3 ? t / 0.3 : t > 0.7 ? (1 - t) / 0.3 : 1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity * 0.22})`
        ctx.fill()
        if (p.life >= p.maxLife || p.y < -10) Object.assign(p, spawn())
      }
      animId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  )
}
