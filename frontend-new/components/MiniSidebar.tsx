import { motion } from "framer-motion";
import { Home, Settings, BarChart2 } from "lucide-react";
import type { ReactNode } from "react";
import { mobileSidebarVariants } from "../utils/motion";

interface MiniSidebarProps {
  isOpen: boolean;
  className?: string;
  onNavigate?: (label: string) => void;
  activeSection?: string;
}

const items: { icon: ReactNode; label: string }[] = [
  { icon: <Home size={20} />, label: "Dashboard" },
  { icon: <BarChart2 size={20} />, label: "Analytics" },
  { icon: <Settings size={20} />, label: "Settings" },
];

export default function MiniSidebar({ isOpen, className, onNavigate, activeSection }: MiniSidebarProps) {
  const containerClassName = [
    "flex h-full w-20 flex-col items-center gap-4 bg-gray-900/95 py-6 text-gray-200 shadow-2xl shadow-black/20 backdrop-blur",
    "border-r border-gray-800/50",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.aside
      variants={mobileSidebarVariants}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className={containerClassName}
      style={{ willChange: "transform" }}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 text-lg font-semibold">
        F
      </div>
      <div className="flex flex-1 flex-col items-center gap-2">
        {items.map((item) => {
          const id = item.label.toLowerCase();
          const isActive = activeSection === id;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => onNavigate?.(id)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors duration-200 ${
                isActive
                  ? "bg-emerald-500/20 text-white"
                  : "bg-gray-800/80 text-gray-200 hover:bg-emerald-500/20 hover:text-white"
              }`}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              {item.icon}
            </button>
          );
        })}
      </div>
    </motion.aside>
  );
}
