import Layout from '@/components/Layout';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeDisciplines } from '@/components/home/HomeDisciplines';
import { HomeTechStack } from '@/components/home/HomeTechStack';
import { HomeStats } from '@/components/home/HomeStats';
import { HomeSelectedWork } from '@/components/home/HomeSelectedWork';
import { HomeAbout } from '@/components/home/HomeAbout';
import { HomeCTA } from '@/components/home/HomeCTA';

export default function Home() {
  return (
    <Layout>
      <HomeHero />
      <HomeDisciplines />
      <HomeTechStack />
      <HomeStats />
      <HomeSelectedWork />
      <HomeAbout />
      <HomeCTA />
    </Layout>
  );
}
