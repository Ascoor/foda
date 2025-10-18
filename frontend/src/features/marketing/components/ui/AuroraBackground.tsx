import { motion } from "framer-motion";
import { PropsWithChildren } from "react";

export const AuroraBackground = ({ children }: PropsWithChildren) => (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#a1e9d3] via-[#f0fff4] to-[#dff7ff] transition dark:from-[#1b1733] dark:via-[#252050] dark:to-[#312a68]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.25),_transparent_55%)]" />
    <motion.div
      className="absolute inset-0"
      animate={{
        backgroundPosition: ["0% 0%", "100% 50%", "0% 100%"],
      }}
      transition={{ duration: 30, ease: "easeInOut", repeat: Infinity }}
      style={{
        backgroundImage:
          "linear-gradient(120deg, rgba(34,211,238,0.25), rgba(192,132,252,0.2), rgba(251,191,36,0.2))",
        backgroundSize: "200% 200%",
        filter: "blur(120px)",
      }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10" />
    <div className="relative z-10">{children}</div>
  </div>
);
