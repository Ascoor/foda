import type { Variants } from "framer-motion";

export const sidebarVariants: Variants = {
  open: { width: 240, transition: { type: "spring", stiffness: 120 } },
  closed: { width: 80, transition: { type: "spring", stiffness: 120 } },
};

export const mobileSidebarVariants: Variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
  closed: {
    x: -120,
    opacity: 0,
    transition: { type: "spring", stiffness: 120, damping: 18 },
  },
};

export const fadeIn = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};
