import { HeroSection } from '@/components/home/hero-section'
import { MissionSection } from '@/components/home/mission-section'
import { HowItWorks } from '@/components/home/how-it-works'
import { LatestStories } from '@/components/home/latest-stories'
import { WeeklySpotlight } from '@/components/home/weekly-spotlight'
import { ChangemakerPreview } from '@/components/home/changemaker-preview'
import { LatestArticles } from '@/components/home/latest-articles'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MissionSection />
      <HowItWorks />
      <LatestStories />
      <WeeklySpotlight />
      <ChangemakerPreview />
      <LatestArticles />
    </>
  )
}
