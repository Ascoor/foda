import { ReactNode } from "react";
import { motion } from "framer-motion";

interface DataTableSkeletonProps {
  rows?: number;
  columns?: number;
}

export const DataTableSkeleton = ({
  rows = 5,
  columns = 6,
}: DataTableSkeletonProps) => {
  return (
    <div className="w-full">
      {/* Header Skeleton */}
      <div className="border-b border-white/10 pb-4 mb-4">
        <div className="grid grid-cols-6 gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="h-4 bg-muted/30 rounded animate-pulse" />
          ))}
        </div>
      </div>

      {/* Rows Skeleton */}
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <motion.div
            key={rowIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: rowIndex * 0.1 }}
            className="grid grid-cols-6 gap-4 items-center py-3"
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className={`h-4 bg-muted/20 rounded animate-pulse ${
                  colIndex === 0 ? "h-6" : ""
                }`}
                style={{
                  animationDelay: `${(rowIndex * columns + colIndex) * 0.05}s`,
                }}
              />
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export const EmptyState = ({
  title,
  description,
  action,
  icon,
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12"
    >
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-4 flex justify-center"
        >
          <div className="p-4 rounded-full bg-muted/20">{icon}</div>
        </motion.div>
      )}

      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-lg font-semibold text-muted-foreground mb-2"
      >
        {title}
      </motion.h3>

      {description && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-muted-foreground mb-6 max-w-md mx-auto"
        >
          {description}
        </motion.p>
      )}

      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};
