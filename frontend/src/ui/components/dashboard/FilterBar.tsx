import type { ReactNode } from "react";

import { cn } from "@/infrastructure/shared/lib/utils";

export interface FilterOption {
  id: string;
  label: ReactNode;
  active?: boolean;
  count?: number;
}

interface FilterBarProps {
  options: FilterOption[];
  onSelect?: (id: string) => void;
  className?: string;
}

export const FilterBar = ({ options, onSelect, className }: FilterBarProps) => (
  <div
    className={cn(
      "flex flex-wrap items-center gap-2 rounded-full border border-white/30 bg-white/60 px-3 py-2 backdrop-blur dark:border-white/10 dark:bg-slate-900/50",
      className,
    )}
  >
    {options.map((option) => (
      <button
        type="button"
        key={option.id}
        onClick={() => onSelect?.(option.id)}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[hsl(var(--primary))]",
          option.active
            ? "bg-[hsla(var(--primary)/0.18)] text-[hsl(var(--primary))] shadow-[0_10px_24px_rgba(15,23,42,0.18)]"
            : "text-muted-foreground hover:bg-[hsla(var(--primary)/0.08)] hover:text-foreground",
        )}
      >
        <span className="whitespace-nowrap">{option.label}</span>
        {typeof option.count === "number" && (
          <span className="rounded-full bg-black/10 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            {option.count}
          </span>
        )}
      </button>
    ))}
  </div>
);

export default FilterBar;
