import type { Metadata } from 'next'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import MusicPlayer from '@/components/audio/MusicPlayer'
import BackToTop from '@/components/layout/BackToTop'
import LoadingScreen from '@/components/layout/LoadingScreen'
import Particles from '@/components/ui/Particles'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Natacha & Mauricio — 01.08.2026',
  description:
    'Celebre conosco o dia mais especial das nossas vidas. Confirme sua presença, veja nossa história e muito mais.',
  keywords: ['casamento', 'Natacha', 'Mauricio', 'Mairiporã', '2026'],
  openGraph: {
    title: 'Natacha & Mauricio — 01.08.2026',
    description: 'Venha celebrar o amor conosco em Mairiporã, SP.',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${cormorant.variable} ${montserrat.variable}`}
    >
      <body className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-montserrat), system-ui, sans-serif' }}>
        <LoadingScreen />
        <Particles />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MusicPlayer />
        <BackToTop />
      </body>
    </html>
  )
}
