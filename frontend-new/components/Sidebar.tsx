import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Home, Settings, BarChart2 } from "lucide-react";
import type { ReactNode } from "react";
import { sidebarVariants } from "../utils/motion";

interface SidebarProps {
  isOpen: boolean;
  className?: string;
  onNavigate?: (section: string) => void;
  activeSection?: string;
}

interface NavItem {
  icon: ReactNode;
  label: string;
  description: string;
}

export default function Sidebar({ isOpen, className, onNavigate, activeSection }: SidebarProps) {
  const [active, setActive] = useState("dashboard");

  useEffect(() => {
    if (activeSection) {
      setActive(activeSection);
    }
  }, [activeSection]);

  const navItems: NavItem[] = [
    { icon: <Home />, label: "Dashboard", description: "Overview & insights" },
    { icon: <BarChart2 />, label: "Analytics", description: "Performance & trends" },
    { icon: <Settings />, label: "Settings", description: "Manage preferences" },
  ];

  const containerClassName = [
    "h-full overflow-hidden bg-gray-900 text-gray-200 flex flex-col items-start py-4 px-3 shadow-xl border-r border-gray-800/50",
    "transition-colors duration-300",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.aside
      variants={sidebarVariants}
      initial={false}
      animate={isOpen ? "open" : "closed"}
      className={containerClassName}
      style={{ willChange: "width" }}
    >
      <div className="flex items-center w-full gap-3 px-2 pb-6">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 text-lg font-semibold">
          F
        </span>
        {isOpen && (
          <div className="flex flex-col">
            <p className="text-sm font-semibold text-white tracking-tight">Foda Admin</p>
            <span className="text-xs text-gray-400">Control Center</span>
          </div>
        )}
      </div>
      <nav className="flex-1 w-full space-y-1">
        {navItems.map((item) => {
          const id = item.label.toLowerCase();
          const isActive = active === id;

          return (
            <motion.button
              key={item.label}
              type="button"
              onClick={() => {
                setActive(id);
                onNavigate?.(id);
              }}
              className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm transition-all duration-200 ${
                isActive
                  ? "bg-gray-800 text-white shadow-lg shadow-emerald-500/10"
                  : "hover:bg-gray-800/70 text-gray-300"
              }`}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-800/80 text-gray-300 group-hover:bg-gray-700/80 group-hover:text-white transition-colors duration-200">
                {item.icon}
              </span>
              {isOpen ? (
                <span className="flex flex-col items-start">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-gray-400">{item.description}</span>
                </span>
              ) : (
                <span className="pointer-events-none absolute left-full ml-3 hidden rounded-lg bg-gray-900 px-3 py-2 text-xs text-gray-200 shadow-lg group-hover:block">
                  {item.label}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>
      <div className="mt-auto w-full rounded-xl bg-gray-800/60 p-3 text-xs text-gray-400">
        <p className="font-semibold text-gray-200">Need help?</p>
        <p>Access the docs and tutorials to get the most out of the dashboard.</p>
      </div>
    </motion.aside>
  );
}
