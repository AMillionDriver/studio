'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { signUpWithEmail } from '@/lib/firebase/actions';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader } from 'lucide-react';

const ADMIN_EMAIL = 'nanangnurmansah5@gmail.com';
const ADMIN_PASSWORD = 'admin123';

export default function SetupAdminPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const handleCreateAdmin = async () => {
    setIsLoading(true);
    const result = await signUpWithEmail({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    
    // The account already exists, which is fine. Treat it as a success for setup.
    if (result.error && result.error.includes('already registered')) {
       toast({
        title: 'Admin Account Ready',
        description: 'The admin account already exists. You can log in.',
      });
      setIsCreated(true);
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Admin Creation Failed',
        description: result.error,
      });
      setIsLoading(false);
    } else {
      toast({
        title: 'Admin Account Created',
        description: 'The admin account is set up. You can now log in.',
      });
      setIsCreated(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
      <Card className="mx-auto max-w-sm w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Admin Account Setup</CardTitle>
          <CardDescription>
            This is a one-time setup page to create the admin account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <Button 
              onClick={handleCreateAdmin} 
              className="w-full bg-primary hover:bg-primary/90" 
              disabled={isLoading || isCreated}
            >
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : isCreated ? 'Account Ready!' : 'Create Admin Account'}
            </Button>
            {isCreated && (
                <p className="text-sm text-center text-muted-foreground">
                    Redirecting to login...
                </p>
            )}
            <p className="text-xs text-center text-muted-foreground pt-4">
              Click the button above to create an admin account. If the account already exists, this will simply confirm it's ready for login.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
