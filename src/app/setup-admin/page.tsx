
'use client';

import { useActionState } from 'react';
import { useFormStatus, useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Loader, Clapperboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { createAdminAccount, type AdminCreationState } from '@/lib/actions';
import { useToast } from '@/hooks/use-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';

const adminSignupSchema = z
  .object({
    email: z.string().email({ message: 'Please enter a valid email.' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ['confirmPassword'],
  });

type AdminSignupFormValues = z.infer<typeof adminSignupSchema>;


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
  };

  const [state, formAction] = useActionState(createAdminAccount, initialState);

  const form = useForm<AdminSignupFormValues>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      email: 'nanangnurmansah5@gmail.com',
      password: '',
      confirmPassword: ''
    },
  });

   // Sync useActionState with react-hook-form
   if (state.status === 'error' && state.message && !form.formState.isSubmitted) {
    form.setError('root', { type: 'custom', message: state.message });
  }

  if (state.status === 'success' || state.status === 'already_exists') {
    toast({
        title: state.status === 'success' ? 'Admin Account Created' : 'Admin Account Ready',
        description: state.message,
    });
    router.push('/login');
  }


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
            <Form {...form}>
                <form 
                    action={form.handleSubmit(data => {
                        const formData = new FormData();
                        formData.append('email', data.email);
                        formData.append('password', data.password);
                        formAction(formData);
                    })} 
                    className="grid gap-4"
                >
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Admin Email</FormLabel>
                            <FormControl>
                            <Input
                                type="email"
                                placeholder="admin@example.com"
                                {...field}
                                disabled={form.formState.isSubmitting}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                            <Input 
                                type="password" 
                                {...field} 
                                disabled={form.formState.isSubmitting}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                        <FormItem className="grid gap-2">
                            <FormLabel>Confirm Password</FormLabel>
                            <FormControl>
                            <Input 
                                type="password" 
                                {...field} 
                                disabled={form.formState.isSubmitting}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <SubmitButton />
                     {state.status === 'error' && state.message && (
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
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
