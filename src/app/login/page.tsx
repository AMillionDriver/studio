"use client";

import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Clapperboard } from "lucide-react";
import { GoogleIcon } from "@/components/icons/google-icon";

export default function LoginPage() {
  const { signInWithGoogle, loading } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
            <Clapperboard className="h-12 w-12 mx-auto text-primary mb-2" />
            <h1 className="text-3xl font-bold">Welcome to AniStream</h1>
            <p className="text-muted-foreground">Sign in to continue</p>
        </div>
        
        <div className="bg-card p-6 rounded-lg border shadow-sm">
            <Button 
                variant="outline" 
                className="w-full"
                onClick={signInWithGoogle}
                disabled={loading}
            >
                <GoogleIcon className="mr-2 h-4 w-4" />
                Sign in with Google
            </Button>
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
            By signing in, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}
