import { motion } from "framer-motion";
import { Menu, Bell, User } from "lucide-react";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="w-full flex items-center justify-between bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80 shadow px-4 py-2 sticky top-0 z-50 transition-colors duration-300"
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-gray-700 dark:text-gray-200"
          aria-label="Toggle navigation"
          type="button"
        >
          <Menu size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800 dark:text-white tracking-tight">
          Dashboard
        </h1>
      </div>
      <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
        <button
          type="button"
          className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          aria-label="Notifications"
        >
          <Bell size={20} />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-emerald-500" />
        </button>
        <button
          type="button"
          className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
          aria-label="Account"
        >
          <User size={20} />
        </button>
      </div>
    </motion.header>
  );
}
