
"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons/google-icon";
import { Clapperboard } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import { RecaptchaVerifier, ConfirmationResult, getAuth } from "firebase/auth";

const emailFormSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const phoneFormSchema = z.object({
    phoneNumber: z.string().min(10, { message: "Please enter a valid phone number." }),
});

const codeFormSchema = z.object({
    code: z.string().length(6, { message: "Verification code must be 6 digits." }),
});

declare global {
    interface Window {
      recaptchaVerifier?: RecaptchaVerifier;
    }
}

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signInAnonymously, signInWithPhone, confirmPhoneCode, loading } = useAuth();
  const [uiState, setUiState] = useState<'phone' | 'code'>('phone');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);

  const auth = getAuth();

  useEffect(() => {
    if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response: any) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, [auth]);

  const emailForm = useForm<z.infer<typeof emailFormSchema>>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const phoneForm = useForm<z.infer<typeof phoneFormSchema>>({
    resolver: zodResolver(phoneFormSchema),
    defaultValues: { phoneNumber: "" },
  });

  const codeForm = useForm<z.infer<typeof codeFormSchema>>({
    resolver: zodResolver(codeFormSchema),
    defaultValues: { code: "" },
  });

  const onEmailSubmit = (values: z.infer<typeof emailFormSchema>) => {
    signInWithEmail(values.email, values.password);
  };

  const onPhoneSubmit = async (values: z.infer<typeof phoneFormSchema>) => {
    if (window.recaptchaVerifier) {
      const result = await signInWithPhone(values.phoneNumber, window.recaptchaVerifier);
      if (result) {
        setConfirmationResult(result);
        setUiState('code');
      }
    }
  };

  const onCodeSubmit = async (values: z.infer<typeof codeFormSchema>) => {
    if (confirmationResult) {
      await confirmPhoneCode(confirmationResult, values.code);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div id="recaptcha-container"></div>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
            <Clapperboard className="h-12 w-12 mx-auto text-primary mb-2" />
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your account</p>
        </div>
        
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="phone">Phone</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Sign In with Email</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
                    <FormField
                      control={emailForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={emailForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="phone">
            <Card>
              {uiState === 'phone' ? (
                <>
                  <CardHeader>
                    <CardTitle>Sign In with Phone</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Form {...phoneForm}>
                      <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-4">
                        <FormField
                          control={phoneForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="+6281234567890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Sending Code..." : "Send Verification Code"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </>
              ) : (
                 <>
                  <CardHeader>
                    <CardTitle>Enter Verification Code</CardTitle>
                    <CardDescription>
                        Enter the 6-digit code sent to your phone.
                        <Button variant="link" size="sm" onClick={() => setUiState('phone')} className="pl-1">
                            Change number?
                        </Button>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Form {...codeForm}>
                      <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-4">
                        <FormField
                          control={codeForm.control}
                          name="code"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>6-Digit Code</FormLabel>
                              <FormControl>
                                <Input placeholder="123456" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button type="submit" className="w-full" disabled={loading}>
                          {loading ? "Verifying..." : "Verify and Sign In"}
                        </Button>
                      </form>
                    </Form>
                  </CardContent>
                </>
              )}
            </Card>
          </TabsContent>
        </Tabs>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Button 
              variant="outline" 
              className="w-full"
              onClick={signInWithGoogle}
              disabled={loading}
          >
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign in with Google
          </Button>
          <Button 
              variant="secondary" 
              className="w-full"
              onClick={signInAnonymously}
              disabled={loading}
          >
              Continue as Guest
          </Button>
        </div>

        <p className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
                Sign Up
            </Link>
        </p>
      </div>
    </div>
  );
}
