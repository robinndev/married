import Hero from '@/components/home/Hero'
import HistoriaTeaser from '@/components/home/HistoriaTeaser'
import StoryCards from '@/components/home/StoryCards'
import LocationSection from '@/components/home/LocationSection'

export default function HomePage() {
  return (
    <>
      <Hero />
      <HistoriaTeaser />
      <StoryCards />
      <LocationSection />
    </>
  )
}
