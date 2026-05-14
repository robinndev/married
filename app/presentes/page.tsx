import type { Metadata } from 'next'
import GiftsClient from '@/components/presentes/GiftsClient'

export const metadata: Metadata = {
  title: 'Lista de Presentes — Natacha & Mauricio',
  description: 'Lista de presentes do casamento de Natacha e Mauricio.',
}

export default function PresentesPage() {
  return <GiftsClient />
}
