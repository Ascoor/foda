import { motion } from "framer-motion";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#features", label: "Dashboard" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export const FloatingNav = () => (
  <motion.nav
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="pointer-events-auto mx-auto mt-8 flex w-[94%] max-w-5xl items-center justify-between rounded-full border border-white/20 bg-white/60 px-6 py-3 text-sm shadow-[0_15px_45px_rgba(59,130,246,0.2)] backdrop-blur-2xl dark:bg-slate-900/70"
  >
    <div className="text-xs uppercase tracking-[0.4em] text-slate-600 dark:text-slate-200">
      Aurora Election
    </div>
    <div className="flex items-center gap-4">
      {navLinks.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="rounded-full px-4 py-2 font-semibold text-slate-600 transition hover:bg-white/50 hover:text-slate-900 dark:text-slate-200 dark:hover:bg-slate-800/60"
        >
          {link.label}
        </a>
      ))}
    </div>
  </motion.nav>
);
