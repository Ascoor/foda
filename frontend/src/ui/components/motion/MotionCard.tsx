import { motion } from "framer-motion";
import type { ReactElement, ReactNode } from "react";

import { useMotionPreset } from "@/infrastructure/hooks/useMotionPreset";
import { cn } from "@/infrastructure/shared/lib/utils";

type MotionCardProps = React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
  children?: ReactNode;
};

export const MotionCard = ({
  as: Comp = motion.div,
  className,
  children,
  ...rest
}: MotionCardProps): ReactElement => {
  const preset = useMotionPreset("scaleIn");

  const sharedClassName = cn(
    "rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md",
    "dark:border-white/5 dark:bg-slate-900/40",
    "transition-colors",
    className,
  );

  const motionProps = preset ?? {};

  return (
    <Comp
      {...motionProps}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={sharedClassName}
      {...rest}
    >
      {children}
    </Comp>
  );
};
