import HeroSection from './components/HeroSection';
import ServicesGrid from './components/ServicesGrid';
import FeaturedProjects from './components/FeaturedProjects';
import StatsSection from './components/StatsSection';
import Testimonials from './components/Testimonials';
import CTASection from './components/CTASection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesGrid />
      <FeaturedProjects />
      <StatsSection />
      <Testimonials />
      <CTASection />
    </>
  );
}
