import { useMemo } from "react";
import { useReducedMotion } from "framer-motion";

import {
  getDirectionalOffset,
  motionPresets,
  type MotionPreset,
  type MotionPresetName,
} from "@/infrastructure/config/motion.config";
import { useDirection } from "@/infrastructure/i18n/useDirection";

type Options = {
  overrideTransition?: MotionPreset["transition"];
  directional?: boolean;
  directionalAxis?: "x" | "y";
  distance?: number;
};

export const useMotionPreset = (
  name: MotionPresetName,
  options: Options = {},
) => {
  const prefersReducedMotion = useReducedMotion();
  const dir = useDirection();

  const { directional, directionalAxis, distance, overrideTransition } = options;

  return useMemo(() => {
    const base = motionPresets[name];

    if (!base) return null;

    let variants = { ...base.variants };

    if (directional && directionalAxis) {
      const offset = getDirectionalOffset(dir, distance ?? 24);
      variants = {
        ...variants,
        hidden: {
          ...(variants.hidden || {}),
          [directionalAxis]: offset,
        },
        visible: {
          ...(variants.visible || {}),
          [directionalAxis]: 0,
        },
      };
    }

    const transition = prefersReducedMotion
      ? { duration: 0 }
      : overrideTransition ?? base.transition;

    return {
      initial: base.initial,
      animate: base.animate,
      exit: base.exit,
      variants,
      transition,
    };
  }, [name, dir, directional, directionalAxis, distance, overrideTransition, prefersReducedMotion]);
};
