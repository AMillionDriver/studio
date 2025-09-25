
'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function AdminBadge({ className }: { className?: string }) {
  // This component is now primarily for visual representation if needed,
  // but the core logic for displaying it based on actual claims should be handled carefully.
  // The persistent display was causing confusion.
  return (
    <Badge
      className={cn(
        'border-primary/50 bg-primary/20 text-primary',
        className
      )}
    >
      Admin
    </Badge>
  );
}
