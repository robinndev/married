'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

export function useAudio(src: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    const audio = new Audio(src)
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio

    const onCanPlay = () => setReady(true)
    audio.addEventListener('canplaythrough', onCanPlay)
    return () => {
      audio.removeEventListener('canplaythrough', onCanPlay)
      audio.pause()
    }
  }, [src])

  // Try to play after first user interaction
  useEffect(() => {
    if (started || !ready) return
    const tryPlay = () => {
      if (!started && audioRef.current) {
        audioRef.current.play().then(() => {
          setPlaying(true)
          setStarted(true)
        }).catch(() => {
          // autoplay blocked — user must click manually
        })
        cleanup()
      }
    }
    const cleanup = () => {
      document.removeEventListener('click', tryPlay)
      document.removeEventListener('keydown', tryPlay)
      document.removeEventListener('touchstart', tryPlay)
    }
    document.addEventListener('click', tryPlay, { once: true })
    document.addEventListener('keydown', tryPlay, { once: true })
    document.addEventListener('touchstart', tryPlay, { once: true })
    return cleanup
  }, [ready, started])

  const toggle = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => {
        setPlaying(true)
        setStarted(true)
      }).catch(() => {})
    }
  }, [playing])

  return { playing, toggle, ready }
}
