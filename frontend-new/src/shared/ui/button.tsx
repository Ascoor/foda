import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef, type ButtonHTMLAttributes, type CSSProperties, type Ref } from "react";
import { MotionConfig, motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

type ButtonProps = {
  asChild?: boolean;
} &
  ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] px-5 text-sm font-semibold tracking-tight transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsla(var(--primary)/0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-60 [--button-shadow:var(--shadow-sm)] [--button-shadow-hover:var(--shadow-md)] shadow-[var(--button-shadow)]",
  {
    variants: {
      variant: {
        primary:
          "border border-transparent bg-[linear-gradient(135deg,_hsl(var(--primary))_0%,_hsl(var(--secondary))_100%)] text-[hsl(var(--primary-foreground))] [--button-shadow:var(--shadow-md)] [--button-shadow-hover:var(--shadow-lg)]",
        secondary:
          "border border-border/60 bg-surface text-[hsl(var(--surface-foreground))] [--button-shadow:var(--shadow-sm)] [--button-shadow-hover:var(--shadow-md)]",
        accent:
          "border border-transparent bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] [--button-shadow:var(--shadow-md)] [--button-shadow-hover:var(--shadow-lg)]",
        ghost:
          "border border-transparent bg-transparent text-muted-foreground hover:text-foreground [--button-shadow:0_0_0_0_rgba(0,0,0,0)] [--button-shadow-hover:var(--shadow-sm)]",
        outline:
          "border border-border/60 bg-transparent text-foreground [--button-shadow:var(--shadow-sm)] [--button-shadow-hover:var(--shadow-md)]",
        glass:
          "border border-border/50 bg-surface/70 text-muted-foreground backdrop-blur-[var(--glass-blur)] backdrop-saturate-[var(--glass-saturation)] transition-colors hover:text-foreground [--button-shadow:var(--shadow-sm)] [--button-shadow-hover:var(--shadow-md)]",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5",
        lg: "h-12 px-7 text-base",
        icon: "h-11 w-11 rounded-[var(--radius-lg)] p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, style, type = "button", ...props }, ref) => {
    const resolvedClassName = cn(buttonVariants({ variant, size }), className);
    const hoverShadow = "var(--button-shadow-hover)";
    const tapScale = 0.985;

    if (asChild) {
      const baseShadow =
        typeof style === "object" && style && "boxShadow" in style
          ? (style.boxShadow as CSSProperties["boxShadow"])
          : undefined;

      return (
        <MotionConfig transition={{ duration: 0.24, ease: "easeOut" }}>
          <motion.span
            whileHover={{ scale: 1.015, boxShadow: hoverShadow }}
            whileTap={{ scale: tapScale }}
            style={{ boxShadow: baseShadow ?? "var(--button-shadow)" }}
            className="inline-flex"
          >
            <Slot ref={ref as unknown as Ref<HTMLElement>} className={resolvedClassName} style={style} {...props} />
          </motion.span>
        </MotionConfig>
      );
    }

    const resolvedStyle: CSSProperties = {
      ...(style ?? {}),
    };

    if (resolvedStyle.boxShadow === undefined) {
      resolvedStyle.boxShadow = "var(--button-shadow)";
    }

    return (
      <MotionConfig transition={{ duration: 0.24, ease: "easeOut" }}>
        <motion.button
          ref={ref}
          type={type}
          className={resolvedClassName}
          whileHover={{ scale: 1.015, boxShadow: hoverShadow }}
          whileTap={{ scale: tapScale }}
          style={resolvedStyle}
          {...props}
        />
      </MotionConfig>
    );
  },
);

Button.displayName = "Button";

export { buttonVariants };
