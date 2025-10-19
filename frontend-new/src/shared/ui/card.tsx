import { cn } from "@/shared/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn(
      "group/card glass-panel p-6 transition-transform duration-500 will-change-transform",
      "before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-[radial-gradient(circle_at_top,_hsla(var(--primary)/0.2),_transparent_65%)] before:opacity-0 before:transition-opacity before:duration-500",
      "hover:-translate-y-1 hover:before:opacity-100",
      className,
    )}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: CardProps) => (
  <div className={cn("mb-4 flex flex-col gap-2 text-balance", className)} {...props} />
);

export const CardTitle = ({ className, ...props }: CardProps) => (
  <h3 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
);

export const CardDescription = ({ className, ...props }: CardProps) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);

export const CardContent = ({ className, ...props }: CardProps) => (
  <div className={cn("flex-1", className)} {...props} />
);
