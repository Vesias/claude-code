import Navbar from "@/components/landing/navbar"
import LivingHeroSection from "@/components/landing/living-hero-section"
import FeaturesSection from "@/components/landing/features-section"
import PipelineViz from "@/components/landing/pipeline-viz"
import PricingSection from "@/components/landing/pricing-section"
import Footer from "@/components/landing/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <LivingHeroSection />
      <FeaturesSection />
      <PipelineViz />
      <PricingSection />
      <Footer />
    </main>
  )
}