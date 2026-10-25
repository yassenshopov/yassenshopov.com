import Layout from '@/components/Layout';
import AboutTimeline from '@/components/about/AboutTimeline';
import HeroSection from '@/components/about/HeroSection';
import SkillCard from '@/components/about/SkillCard';
import { Reveal } from '@/components/Reveal';
import { SectionHeading } from '@/components/SectionHeading';
import { aboutSkills } from '@/data/about-timeline';

export default function AboutPage() {
  return (
    <Layout>
      <HeroSection />
      <AboutTimeline />

      <section className="py-20 md:py-28">
        <div className="container">
          <SectionHeading
            title="What I do"
            aside="Skills"
            className="mb-12"
            headingClassName="text-3xl md:text-5xl"
          />
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {aboutSkills.map((skill, index) => (
              <Reveal key={skill.title} delay={index * 60}>
                <SkillCard {...skill} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
