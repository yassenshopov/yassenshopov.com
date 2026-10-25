import { Code, Paintbrush, BookOpen, type LucideIcon } from 'lucide-react';

const skillIcons: Record<string, LucideIcon> = {
  'Web development': Code,
  Design: Paintbrush,
  Content: BookOpen,
};

interface SkillCardProps {
  title: string;
  description: string;
}

export default function SkillCard({ title, description }: SkillCardProps) {
  const Icon = skillIcons[title] ?? Code;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
          <Icon className="size-5" aria-hidden />
        </div>
        <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
      </div>
      <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
    </div>
  );
}
