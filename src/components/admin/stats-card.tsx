
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
  iconBackground = "bg-[#DCE9E2]",
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-[#183F38]/10 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-[#68736C]">
            {title}
          </p>

          <h3 className="mt-3 text-3xl font-bold text-[#183F38]">
            {value}
          </h3>
        </div>

        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconBackground}`}
        >
          <Icon size={23} className="text-[#183F38]" />
        </div>
      </div>

      <p className="mt-4 text-xs text-[#89928C]">
        {description}
      </p>
    </div>
  );
}
