import type { Metadata } from 'next'
import RSVPClient from '@/components/confirmar-presenca/RSVPClient'

export const metadata: Metadata = {
  title: 'Confirmar Presença — Natacha & Mauricio',
  description: 'Confirme sua presença no casamento de Natacha e Mauricio.',
}

export default function ConfirmarPage() {
  return <RSVPClient />
}
