import { ReactNode } from "react";

interface SkillCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export default function SkillCard({ icon, title, description }: SkillCardProps) {
  return (
    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4 mb-4">
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
} 