import { motion } from "framer-motion";
import { PropsWithChildren } from "react";
import { LinkProps, Link } from "react-router-dom";
import { cn } from "@/infrastructure/shared/lib/utils";

interface GlowButtonProps extends PropsWithChildren<LinkProps> {
  variant?: "primary" | "secondary";
}

export const GlowButton = ({
  children,
  className,
  variant = "primary",
  ...props
}: GlowButtonProps) => (
  <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
    <Link
      {...props}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full px-8 py-3 text-sm font-semibold text-white shadow-[0_20px_40px_rgba(59,130,246,0.35)]",
        variant === "primary"
          ? "bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-500"
          : "bg-white/20 text-slate-900 backdrop-blur-xl dark:text-white",
        className,
      )}
    >
      <span className="absolute inset-0 rounded-full bg-white/30 opacity-0 transition group-hover:opacity-100" />
      <span className="relative z-10">{children}</span>
    </Link>
  </motion.div>
);
