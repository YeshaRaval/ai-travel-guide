import Hero from '@/components/Hero';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorks from '@/components/HowItWorks';
import PopularDestinations from '@/components/PopularDestinations';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <FeaturesSection />
      <HowItWorks />
      <PopularDestinations />
    </main>
  );
}
