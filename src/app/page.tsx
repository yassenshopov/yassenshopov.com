import Layout from '@/components/Layout';
import { HomeHero } from '@/components/home/HomeHero';
import { HomeDisciplines } from '@/components/home/HomeDisciplines';
import { HomeStats } from '@/components/home/HomeStats';
import { HomeSelectedWork } from '@/components/home/HomeSelectedWork';
import { HomeAbout } from '@/components/home/HomeAbout';
import { HomeCTA } from '@/components/home/HomeCTA';
import { templates } from '@/components/NotionTemplatesList';
import { projects } from '@/components/ProjectsList';

export default function Home() {
  return (
    <Layout>
      <HomeHero
        projectCount={projects.length}
        templateCount={templates.length}
        monthlyVisits="10K+"
      />
      <HomeDisciplines />
      <HomeStats />
      <HomeSelectedWork />
      <HomeAbout />
      <HomeCTA />
    </Layout>
  );
}
