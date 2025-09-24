'use client';

import { useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { createAdminAccount, type AdminCreationState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';

function SubmitButton({ status }: { status: AdminCreationState['status'] }) {
  const { pending } = useFormStatus();

  const getButtonText = () => {
    if (pending) {
      return (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      );
    }
    if (status === 'success' || status === 'already_exists') {
      return 'Account Ready!';
    }
    return 'Create Admin Account';
  };
  
  return (
    <Button
      type="submit"
      className="w-full bg-primary hover:bg-primary/90"
      disabled={pending || status === 'success' || status === 'already_exists'}
    >
      {getButtonText()}
    </Button>
  );
}

export default function SetupAdminPage() {
  const router = useRouter();
  const { toast } = useToast();

  const initialState: AdminCreationState = {
    status: 'idle',
    message: '',
  };

  const [state, formAction] = useActionState(createAdminAccount, initialState);

  useEffect(() => {
    if (state.status === 'success' || state.status === 'already_exists') {
      toast({
        title: state.status === 'success' ? 'Admin Account Created' : 'Admin Account Ready',
        description: state.message,
      });
      setTimeout(() => router.push('/login'), 2000);
    } else if (state.status === 'error') {
      toast({
        variant: 'destructive',
        title: 'Admin Creation Failed',
        description: state.message,
      });
    }
  }, [state, router, toast]);

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
          <form action={formAction} className="grid gap-4">
            <SubmitButton status={state.status} />
            {(state.status === 'success' || state.status === 'already_exists') && (
              <p className="text-sm text-center text-muted-foreground">
                Redirecting to login...
              </p>
            )}
             {state.status === 'error' && (
                <p className="text-sm text-center text-destructive">
                    {state.message}
                </p>
            )}
            <p className="text-xs text-center text-muted-foreground pt-4">
              Click the button above to create an admin account. If the account
              already exists, this will simply confirm it's ready for login.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
