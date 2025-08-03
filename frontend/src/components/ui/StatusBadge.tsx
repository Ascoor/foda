import { Badge as ShadBadge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'primary' | 'secondary';
  className?: string;
}

const statusVariants = {
  // Election statuses
  draft: 'bg-muted/50 text-muted-foreground border-muted',
  active: 'bg-success/10 text-success border-success/20',
  completed: 'bg-primary/10 text-primary border-primary/20',
  cancelled: 'bg-destructive/10 text-destructive border-destructive/20',
  
  // General statuses
  pending: 'bg-warning/10 text-warning border-warning/20',
  approved: 'bg-success/10 text-success border-success/20',
  rejected: 'bg-destructive/10 text-destructive border-destructive/20',
  
  // Committee types
  main: 'bg-primary/10 text-primary border-primary/20',
  branch: 'bg-secondary/10 text-secondary border-secondary/20',
  
  // Area types
  governorate: 'bg-primary/10 text-primary border-primary/20',
  district: 'bg-secondary/10 text-secondary border-secondary/20',
  city: 'bg-accent/10 text-accent border-accent/20',
  village: 'bg-muted/50 text-muted-foreground border-muted',
  
  // Election types
  presidential: 'bg-primary/10 text-primary border-primary/20',
  parliamentary: 'bg-secondary/10 text-secondary border-secondary/20',
  local: 'bg-accent/10 text-accent border-accent/20',
  referendum: 'bg-warning/10 text-warning border-warning/20',
  
  // Candidate types
  individual: 'bg-primary/10 text-primary border-primary/20',
  list: 'bg-secondary/10 text-secondary border-secondary/20',
  
  // Observation types
  violation: 'bg-destructive/10 text-destructive border-destructive/20',
  note: 'bg-accent/10 text-accent border-accent/20',
  complaint: 'bg-warning/10 text-warning border-warning/20',
  
  // Gender
  male: 'bg-primary/10 text-primary border-primary/20',
  female: 'bg-secondary/10 text-secondary border-secondary/20'
};

export const StatusBadge = ({ status, variant = 'default', className }: StatusBadgeProps) => {
  const statusClass = statusVariants[status as keyof typeof statusVariants];
  
  return (
    <ShadBadge
      variant="outline"
      className={cn(
        'font-medium transition-colors',
        statusClass,
        className
      )}
    >
      {status}
    </ShadBadge>
  );
};