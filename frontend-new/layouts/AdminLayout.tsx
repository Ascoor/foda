import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import MiniSidebar from "../components/MiniSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

function useMediaQuery(query: string) {
  const mediaQueryList = useMemo(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }
    return window.matchMedia(query);
  }, [query]);

  const [matches, setMatches] = useState(() => mediaQueryList?.matches ?? false);

  useEffect(() => {
    if (!mediaQueryList) {
      return undefined;
    }

    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    setMatches(mediaQueryList.matches);
    mediaQueryList.addEventListener("change", handleChange);

    return () => mediaQueryList.removeEventListener("change", handleChange);
  }, [mediaQueryList]);

  return matches;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMiniSidebarOpen, setIsMiniSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");

  useEffect(() => {
    if (isDesktop) {
      setIsMiniSidebarOpen(false);
      setIsSidebarOpen(true);
    } else {
      setIsSidebarOpen(false);
    }
  }, [isDesktop]);

  const handleToggleSidebar = () => {
    if (isDesktop) {
      setIsSidebarOpen((prev) => !prev);
    } else {
      setIsMiniSidebarOpen((prev) => !prev);
    }
  };

  const handleNavigate = (section: string) => {
    setActiveSection(section);
    if (!isDesktop) {
      setIsMiniSidebarOpen(false);
    }
  };

  const miniSidebarClassName = [
    "fixed left-0 top-0 z-50 h-screen lg:hidden",
    !isMiniSidebarOpen ? "pointer-events-none" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex min-h-screen w-full overflow-hidden bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
      <div className="relative hidden lg:flex">
        <Sidebar
          isOpen={isSidebarOpen}
          activeSection={activeSection}
          className="sticky top-0 h-screen"
          onNavigate={handleNavigate}
        />
      </div>

      <AnimatePresence>
        {!isDesktop && isMiniSidebarOpen ? (
          <motion.div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsMiniSidebarOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <MiniSidebar
        isOpen={!isDesktop && isMiniSidebarOpen}
        className={miniSidebarClassName}
        activeSection={activeSection}
        onNavigate={handleNavigate}
      />

      <div className="flex h-screen flex-1 flex-col">
        <Header onToggleSidebar={handleToggleSidebar} />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex-1 overflow-y-auto bg-gray-50 p-6 will-change-transform dark:bg-gray-950"
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            <motion.div
              layout
              className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
              {["Revenue", "Active Users", "Bounce Rate", "Sessions"].map((metric) => (
                <motion.div
                  key={metric}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 }}
                  className="rounded-2xl border border-gray-200/60 bg-white/70 p-4 shadow-sm shadow-gray-900/5 backdrop-blur transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/60"
                >
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{metric}</p>
                  <p className="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{Math.floor(Math.random() * 1000)}k</p>
                  <p className="mt-1 text-xs text-emerald-500">+12% from last month</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.section
              layout
              className="rounded-3xl border border-gray-200/60 bg-white/80 p-6 shadow-md shadow-gray-900/5 backdrop-blur-md transition-colors duration-300 dark:border-gray-800 dark:bg-gray-900/60"
            >
              <motion.h2
                layout
                className="text-xl font-semibold text-gray-900 dark:text-white"
              >
                Active section: {activeSection}
              </motion.h2>
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                Explore the responsive admin workspace. Resize the window to see the sidebar transform into the compact mini sidebar. Toggle the navigation using the menu button to experience the fluid Framer Motion animations tailored for every breakpoint.
              </p>
            </motion.section>
          </div>
          {children}
        </motion.main>
      </div>
    </div>
  );
}
