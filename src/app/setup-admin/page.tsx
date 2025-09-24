
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Loader, Clapperboard } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createAdminAccount, type AdminCreationState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';


function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="w-full bg-primary hover:bg-primary/90"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader className="mr-2 h-4 w-4 animate-spin" />
          Creating Account...
        </>
      ) : (
        'Create Admin Account'
      )}
    </Button>
  );
}

export default function SetupAdminPage() {
  const router = useRouter();
  const { toast } = useToast();

  const initialState: AdminCreationState = {
    status: 'idle',
    message: '',
    errors: {},
  };

  const [state, formAction] = useActionState(createAdminAccount, initialState);

  useEffect(() => {
    if (state.status === 'success' || state.status === 'already_exists') {
      toast({
          title: state.status === 'success' ? 'Admin Account Created' : 'Admin Account Ready',
          description: state.message,
      });
      router.push('/login');
    } else if (state.status === 'error' && state.message && !Object.keys(state.errors).length) {
        // General server-side errors that aren't field-specific
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
            <Link href="/" className="inline-block mb-4">
                <Clapperboard className="h-8 w-8 text-primary mx-auto" />
            </Link>
          <CardTitle className="text-2xl font-headline">Admin Account Setup</CardTitle>
          <CardDescription>
            Create the primary administrator account for the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <form action={formAction} className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Admin Email</Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="admin@example.com"
                        defaultValue="nanangnurmansah5@gmail.com"
                    />
                    {state.errors?.email && <p className="text-sm font-medium text-destructive">{state.errors.email}</p>}
                </div>
                 <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        id="password"
                        name="password"
                        type="password" 
                    />
                    {state.errors?.password && <p className="text-sm font-medium text-destructive">{state.errors.password}</p>}
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                    />
                     {state.errors?.confirmPassword && <p className="text-sm font-medium text-destructive">{state.errors.confirmPassword}</p>}
                </div>
                
                <SubmitButton />
                
                {state.status === 'error' && state.message && !Object.keys(state.errors).length && (
                    <p className="text-sm font-medium text-destructive text-center">
                        {state.message}
                    </p>
                )}
                 {(state.status === 'success' || state.status === 'already_exists') && (
                    <p className="text-sm text-center text-muted-foreground">
                        Redirecting to login...
                    </p>
                )}
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
