/**
 * Foda Motion System - Animation Presets
 * Framer Motion configurations for consistent animations
 */

import type { Variants, Transition } from "framer-motion";

// Easing curves
export const easings = {
  smooth: [0.4, 0, 0.2, 1],
  spring: [0.34, 1.56, 0.64, 1],
  elastic: [0.68, -0.55, 0.265, 1.55],
} as const;

// Common transitions
export const transitions = {
  fast: {
    duration: 0.15,
    ease: easings.smooth,
  } as Transition,
  normal: {
    duration: 0.3,
    ease: easings.smooth,
  } as Transition,
  slow: {
    duration: 0.5,
    ease: easings.smooth,
  } as Transition,
  spring: {
    type: "spring",
    stiffness: 300,
    damping: 30,
  } as Transition,
  bounce: {
    type: "spring",
    stiffness: 400,
    damping: 20,
  } as Transition,
} as const;

// Animation Variants
export const motionVariants = {
  // Fade In/Out
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  // Slide animations (directional)
  slideInLeft: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  } as Variants,

  slideInRight: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
  } as Variants,

  slideInUp: {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: 50, opacity: 0 },
  } as Variants,

  slideInDown: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -50, opacity: 0 },
  } as Variants,

  // Scale animations
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  } as Variants,

  scaleInCenter: {
    initial: { scale: 0, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0, opacity: 0 },
  } as Variants,

  // Sidebar specific
  sidebar: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  } as Variants,

  sidebarRTL: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
  } as Variants,

  // Header animations
  header: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -20, opacity: 0 },
  } as Variants,

  // Card hover effects
  cardHover: {
    rest: { scale: 1, y: 0 },
    hover: {
      scale: 1.02,
      y: -4,
      transition: transitions.fast,
    },
  } as Variants,

  // Glass effect on hover
  glassHover: {
    rest: {
      backdropFilter: "blur(20px)",
      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.37)",
    },
    hover: {
      backdropFilter: "blur(24px)",
      boxShadow: "0 12px 40px rgba(31, 38, 135, 0.5)",
      transition: transitions.normal,
    },
  } as Variants,

  // Stagger children
  staggerContainer: {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  } as Variants,

  staggerItem: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  } as Variants,

  // Modal/Dialog animations
  modal: {
    initial: { scale: 0.95, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: transitions.spring,
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      transition: transitions.fast,
    },
  } as Variants,

  modalBackdrop: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  } as Variants,

  // Drawer animations
  drawer: {
    initial: { x: "100%" },
    animate: { x: 0 },
    exit: { x: "100%" },
  } as Variants,

  drawerRTL: {
    initial: { x: "-100%" },
    animate: { x: 0 },
    exit: { x: "-100%" },
  } as Variants,

  // Notification animations
  notification: {
    initial: { x: 300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 300, opacity: 0 },
  } as Variants,

  notificationRTL: {
    initial: { x: -300, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 },
  } as Variants,
} as const;

// Utility function to get directional variants
export const getDirectionalVariant = (
  variantName: keyof typeof motionVariants,
  isRTL: boolean,
): Variants => {
  if (variantName === "sidebar") {
    return isRTL ? motionVariants.sidebarRTL : motionVariants.sidebar;
  }
  if (variantName === "drawer") {
    return isRTL ? motionVariants.drawerRTL : motionVariants.drawer;
  }
  if (variantName === "notification") {
    return isRTL ? motionVariants.notificationRTL : motionVariants.notification;
  }
  return motionVariants[variantName];
};

export type MotionVariantName = keyof typeof motionVariants;
