import Hero from '@/components/home/Hero';
import PopularSubjects from '@/components/home/PopularSubjects';
import FeaturedTutors from '@/components/home/FeaturedTutors';
import HowItWorks from '@/components/home/HowItWorks';
import Statistics from '@/components/home/Statistics';
import Testimonials from '@/components/home/Testimonials';
import LatestArticles from '@/components/home/LatestArticles';
import FAQ from '@/components/home/FAQ';
import CTA from '@/components/home/CTA';

export default function Home() {
  return (
    <>
      <Hero />
      <PopularSubjects />
      <FeaturedTutors />
      <HowItWorks />
      <Statistics />
      <Testimonials />
      <LatestArticles />
      <FAQ />
      <CTA />
    </>
  );
}
