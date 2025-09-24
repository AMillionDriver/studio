
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FacebookIcon } from "@/components/icons/facebook-icon";
import { AppleIcon } from "@/components/icons/apple-icon";
import { MicrosoftIcon } from "@/components/icons/microsoft-icon";
import { XIcon } from "@/components/icons/x-icon";
import { PhoneIcon } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export default function LoginPage() {
  const { signInWithGoogle, signInWithEmail, signInAnonymously, loading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    signInWithEmail(values.email, values.password);
  };
  
  const comingSoonProviders = [
    { name: "Phone", icon: <PhoneIcon /> },
    { name: "Facebook", icon: <FacebookIcon /> },
    { name: "Apple", icon: <AppleIcon /> },
    { name: "Microsoft", icon: <MicrosoftIcon /> },
    { name: "X", icon: <XIcon /> },
  ];

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
            <Clapperboard className="h-12 w-12 mx-auto text-primary mb-2" />
            <h1 className="text-3xl font-bold">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to access your account</p>
        </div>
        
        <Card>
            <CardHeader>
            <CardTitle>Sign In with Email</CardTitle>
            </CardHeader>
            <CardContent>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
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
                    control={form.control}
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

        <TooltipProvider>
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

                {comingSoonProviders.map((provider) => (
                    <Tooltip key={provider.name}>
                        <TooltipTrigger asChild>
                            <Button 
                                variant="outline" 
                                className="w-full"
                                disabled
                            >
                                {provider.icon}
                                Sign in with {provider.name}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Coming soon!</p>
                        </TooltipContent>
                    </Tooltip>
                ))}

                <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={signInAnonymously}
                    disabled={loading}
                >
                    Continue as Guest
                </Button>
            </div>
        </TooltipProvider>

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
