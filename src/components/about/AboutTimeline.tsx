import { SectionHeading } from '@/components/SectionHeading';
import { aboutTimeline } from '@/data/about-timeline';
import TimelineItem from './TimelineItem';

export default function AboutTimeline() {
  return (
    <section className="border-t border-border bg-muted/40 py-20 md:py-28">
      <div className="container">
        <SectionHeading
          title="My journey"
          aside="2019 — today"
          className="mb-14 md:mb-16"
          headingClassName="text-3xl md:text-5xl"
        />
        <div className="mx-auto max-w-3xl">
          {aboutTimeline.map((entry, index) => (
            <TimelineItem
              key={`${entry.year}-${entry.title}`}
              {...entry}
              index={index}
              isLast={index === aboutTimeline.length - 1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
