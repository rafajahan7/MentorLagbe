
import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconBackground?: string;
}

export default function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconBackground = "bg-muted",
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-card-foreground">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${iconBackground}`}
        >
          <Icon size={23} className="text-foreground" />
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
