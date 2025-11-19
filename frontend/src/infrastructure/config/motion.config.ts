import type { Transition, Variants } from "framer-motion";

export type MotionPresetName =
  | "fade"
  | "fadeUp"
  | "fadeDown"
  | "slideInSidebar"
  | "scaleIn"
  | "modal"
  | "drawer"
  | "notification";

export type DataState = "idle" | "loading" | "success" | "error" | "empty";

export type MotionPreset = {
  initial: string;
  animate: string;
  exit?: string;
  variants: Variants;
  transition?: Transition;
};

export const motionDurations = {
  instant: 0.12,
  fast: 0.2,
  base: 0.3,
  slow: 0.45,
} as const;

export const motionEasings = {
  standard: [0.2, 0.0, 0.2, 1],
  entrance: [0.16, 1, 0.3, 1],
  exit: [0.4, 0.0, 1, 1],
} as const;

export const getDirectionalOffset = (dir: "ltr" | "rtl", value: number) =>
  dir === "rtl" ? -value : value;

export const motionPresets: Record<MotionPresetName, MotionPreset> = {
  fade: {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    transition: {
      duration: motionDurations.base,
      ease: motionEasings.standard,
    },
  },
  fadeUp: {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: {
      hidden: { opacity: 0, y: 24 },
      visible: { opacity: 1, y: 0 },
    },
    transition: {
      duration: motionDurations.base,
      ease: motionEasings.entrance,
    },
  },
  fadeDown: {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: {
      hidden: { opacity: 0, y: -24 },
      visible: { opacity: 1, y: 0 },
    },
    transition: {
      duration: motionDurations.base,
      ease: motionEasings.entrance,
    },
  },
  slideInSidebar: {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    transition: {
      duration: motionDurations.slow,
      ease: motionEasings.entrance,
    },
  },
  scaleIn: {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: {
      hidden: { opacity: 0, scale: 0.95 },
      visible: { opacity: 1, scale: 1 },
    },
    transition: {
      duration: motionDurations.base,
      ease: motionEasings.entrance,
    },
  },
  modal: {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: {
      hidden: { opacity: 0, scale: 0.92 },
      visible: { opacity: 1, scale: 1 },
    },
    transition: {
      type: "spring",
      stiffness: 280,
      damping: 30,
    },
  },
  drawer: {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: {
      hidden: { x: "100%" },
      visible: { x: 0 },
    },
    transition: {
      duration: motionDurations.slow,
      ease: motionEasings.standard,
    },
  },
  notification: {
    initial: "hidden",
    animate: "visible",
    exit: "hidden",
    variants: {
      hidden: { opacity: 0, y: -16 },
      visible: { opacity: 1, y: 0 },
    },
    transition: {
      duration: motionDurations.fast,
      ease: motionEasings.entrance,
    },
  },
};

export const dataStateVariants: Variants = {
  idle: { opacity: 1, scale: 1 },
  loading: { opacity: 0.6, scale: 0.98 },
  success: { opacity: 1, scale: 1, y: 0 },
  empty: { opacity: 0.7, y: -4 },
  error: { opacity: 1, x: [-4, 4, -2, 2, 0] },
};

export type MotionVariantName = keyof typeof motionPresets;
