import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Loader2, AlertCircle, Database } from 'lucide-react';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';

// Enhanced loading spinner
export const LoadingSpinner = ({ size = 40, message }: { size?: number; message?: string }) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-8 space-y-4"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="relative"
      >
        <Loader2 
          size={size} 
          className="text-primary animate-spin drop-shadow-lg" 
        />
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
      </motion.div>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground text-sm text-center"
        >
          {message || t('common.loading')}
        </motion.p>
      )}
    </motion.div>
  );
};

// Enhanced error display
export const ErrorDisplay = ({ 
  error, 
  onRetry, 
  title 
}: { 
  error: string | Error; 
  onRetry?: () => void;
  title?: string;
}) => {
  const { t } = useTranslation();
  
  const errorMessage = typeof error === 'string' ? error : error.message;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card border-destructive/20"
    >
      <Alert variant="destructive" className="border-0 bg-transparent">
        <AlertCircle className="h-5 w-5" />
        <div className="space-y-2">
          <h4 className="font-semibold">{title || t('common.error')}</h4>
          <AlertDescription className="text-sm">
            {errorMessage}
          </AlertDescription>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="mt-3 glass-button"
            >
              {t('common.retry')}
            </Button>
          )}
        </div>
      </Alert>
    </motion.div>
  );
};

// Enhanced empty state
export const EmptyState = ({ 
  title, 
  description, 
  action, 
  icon: Icon = Database
}: {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  icon?: any;
}) => {
  const { t } = useTranslation();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center p-12 space-y-4 glass-card"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring" }}
        className="relative"
      >
        <Icon size={64} className="text-muted-foreground/50" />
        <div className="absolute inset-0 rounded-full bg-muted/20 blur-xl" />
      </motion.div>
      
      <div className="text-center space-y-2">
        <motion.h3
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg font-semibold text-muted-foreground"
        >
          {title || t('common.no_data')}
        </motion.h3>
        
        {description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-muted-foreground/70 max-w-md"
          >
            {description}
          </motion.p>
        )}
      </div>
      
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

// Safe data renderer wrapper
export interface SafeDataRendererProps<T> {
  data: T[] | null | undefined;
  loading?: boolean;
  error?: string | Error | null;
  onRetry?: () => void;
  loadingMessage?: string;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  children: (data: T[]) => React.ReactNode;
}

export function SafeDataRenderer<T>({
  data,
  loading = false,
  error = null,
  onRetry,
  loadingMessage,
  emptyTitle,
  emptyDescription,
  emptyAction,
  children
}: SafeDataRendererProps<T>) {
  // Show loading state
  if (loading) {
    return <LoadingSpinner message={loadingMessage} />;
  }
  
  // Show error state
  if (error) {
    return <ErrorDisplay error={error} onRetry={onRetry} />;
  }
  
  // Ensure data is an array
  const safeData = Array.isArray(data) ? data : [];
  
  // Show empty state
  if (safeData.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }
  
  // Render data
  return <>{children(safeData)}</>;
}