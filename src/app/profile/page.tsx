
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Mail, User, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user, loading, sendPasswordResetEmail } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user, redirect to login
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "G"; // Guest
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  };
  
  const handlePasswordReset = () => {
    if (user && user.email) {
      sendPasswordResetEmail(user.email);
    }
  }

  // Show a loading state while auth is being checked
  if (loading || !user) {
    return (
        <div className="container mx-auto py-8 px-4 md:px-6">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-full" />
                        <div className="space-y-2">
                            <Skeleton className="h-6 w-40" />
                            <Skeleton className="h-4 w-60" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    );
  }

  const isPasswordSignIn = user.providerData.some(
    (provider) => provider.providerId === "password"
  );

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.displayName || "Guest User"}</CardTitle>
              <CardDescription>{user.isAnonymous ? "You are browsing as a guest." : "Manage your account settings."}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><User className="mr-2 h-5 w-5 text-primary" /> User Information</h3>
                <Separator />
                <div className="mt-4 space-y-2">
                    <p><strong>Email:</strong> {user.email || "Not provided"}</p>
                    <p><strong>Display Name:</strong> {user.displayName || "Not set"}</p>
                    <p><strong>User ID:</strong> <code className="text-sm bg-muted p-1 rounded-sm">{user.uid}</code></p>
                </div>
            </div>

            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><ShieldCheck className="mr-2 h-5 w-5 text-primary" /> Sign-In Methods</h3>
                <Separator />
                <div className="mt-4 flex flex-wrap gap-2">
                    {user.providerData.map(provider => (
                        <Badge key={provider.providerId} variant="secondary">
                            {provider.providerId === 'password' ? 'Email/Password' :
                             provider.providerId.replace('.com', '')}
                        </Badge>
                    ))}
                    {user.isAnonymous && <Badge variant="secondary">Anonymous</Badge>}
                </div>
            </div>

           {isPasswordSignIn && (
             <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary" /> Password Management</h3>
                <Separator />
                <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-4">
                        If you've forgotten your password or wish to change it, you can request a password reset email.
                    </p>
                    <Button onClick={handlePasswordReset}>
                       <Mail className="mr-2 h-4 w-4" /> Send Password Reset Email
                    </Button>
                </div>
            </div>
           )}

        </CardContent>
      </Card>
    </div>
  );
}
