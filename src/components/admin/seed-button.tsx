'use client';

import { useState } from 'react';
import { Loader, Check, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { seedInitialData } from '@/lib/actions';

export function SeedButton() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    setLoading(true);
    const result = await seedInitialData();
    setLoading(false);

    if (result.success) {
      toast({
        title: 'Database Seeded',
        description: result.message,
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: result.message,
      });
    }
  };

  return (
    <Button onClick={handleSeed} disabled={loading}>
      {loading ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Seeding...
        </>
      ) : (
        'Seed Database'
      )}
    </Button>
  );
}
