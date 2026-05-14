import type { Metadata } from 'next'
import MessageWall from '@/components/recados/MessageWall'

export const metadata: Metadata = {
  title: 'Recados — Natacha & Mauricio',
  description: 'Deixe um recado especial para os noivos.',
}

export default function RecadosPage() {
  return <MessageWall />
}
