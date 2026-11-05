import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
  badgeColor?: "brand" | "sky" | "amber" | "purple";
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = "brand",
  onClick,
}) => {
  const badgeColors = {
    brand: "bg-brand-500/15 text-brand-400 border-brand-500/30",
    sky: "bg-sky-500/15 text-sky-400 border-sky-500/30",
    amber: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    purple: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-3xl bg-[#141417] border border-zinc-800/80 p-5 shadow-lg flex flex-col justify-between transition-all duration-300 ${
        onClick ? "cursor-pointer hover:border-brand-500/50 hover:shadow-brand-500/10 hover:-translate-y-0.5" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-brand-400">
          <Icon className="w-5 h-5" />
        </div>
        {badge && (
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeColors[badgeColor]}`}
          >
            {badge}
          </span>
        )}
      </div>

      <div>
        <div className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight leading-none mb-1">
          {value}
        </div>
        <div className="text-xs font-medium text-zinc-400">{title}</div>
        {subtitle && <p className="text-[11px] text-zinc-500 font-mono mt-1">{subtitle}</p>}
      </div>
    </div>
  );
};
