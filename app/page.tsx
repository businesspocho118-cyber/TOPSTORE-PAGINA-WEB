import { HeroSection } from '@/components/home/HeroSection'
import { CategoriesSection } from '@/components/home/CategoriesSection'
import { GiftCardAnnouncement } from '@/components/home/GiftCardAnnouncement'
import { GiftCardsSection } from '@/components/home/GiftCardsSection'
import { ActiveCollectionSection } from '@/components/home/ActiveCollectionSection'
import StoryScrollSection from '@/components/home/StoryScrollSection'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <GiftCardAnnouncement />
      <HeroSection />
      <CategoriesSection />
      <ActiveCollectionSection />
      <GiftCardsSection />
      <StoryScrollSection />
    </>
  )
}
