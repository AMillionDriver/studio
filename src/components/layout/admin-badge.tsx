
'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function AdminBadge({ className }: { className?: string }) {
  return (
    <Badge
      className={cn(
        'bg-primary/10 border-primary/20 text-primary animate-pulse',
        'shadow-[0_0_10px_hsl(var(--primary)),0_0_20px_hsl(var(--primary))]',
        className
      )}
    >
      SUPER ADMIN
    </Badge>
  );
}
