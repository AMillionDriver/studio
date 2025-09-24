
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Mail, User, KeyRound, Lock, Pencil, Link2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { GoogleIcon } from "@/components/icons/google-icon";
import { AdminBadge } from "@/components/layout/admin-badge";

const passwordFormSchema = z.object({
  oldPassword: z.string().min(1, { message: "Current password is required." }),
  newPassword: z.string().min(6, { message: "New password must be at least 6 characters." }),
  confirmPassword: z.string().min(6, { message: "Please confirm your new password." }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match.",
  path: ["confirmPassword"],
});

const profileFormSchema = z.object({
  displayName: z.string().min(1, "Display name is required."),
});

export default function ProfilePage() {
  const { user, loading, sendPasswordResetEmail, changeUserPassword, updateUserProfile, linkWithGoogle } = useAuth();
  const router = useRouter();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { oldPassword: "", newPassword: "", confirmPassword: "" },
  });

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { displayName: user?.displayName || "" },
  });
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
    if (user) {
      profileForm.reset({ displayName: user.displayName || "" });
    }
  }, [user, loading, router, profileForm]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "G";
    const names = name.split(' ');
    const initials = names.map(n => n[0]).join('');
    return initials.toUpperCase().slice(0, 2);
  };
  
  const handlePasswordReset = () => {
    if (user && user.email) sendPasswordResetEmail(user.email);
  }

  const handlePasswordChange = async (values: z.infer<typeof passwordFormSchema>) => {
    if (user && user.email) {
      await changeUserPassword(values.oldPassword, values.newPassword);
      passwordForm.reset();
    }
  }

  const handleProfileUpdate = async (values: z.infer<typeof profileFormSchema>) => {
    await updateUserProfile({ displayName: values.displayName });
    setIsEditingProfile(false);
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && user) {
      await updateUserProfile({ photoFile: file });
    }
  };

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

  const isPasswordSignIn = user.providerData.some(p => p.providerId === "password");
  const isGoogleSignIn = user.providerData.some(p => p.providerId === "google.com");

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.photoURL || ""} alt={user.displayName || "User"} />
                  <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
                </Avatar>
                {isEditingProfile && (
                  <>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" className="hidden" />
                    <Button
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-7 w-7"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
              <div className="flex-1">
                {!isEditingProfile ? (
                  <>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-2xl">{user.displayName || "Guest User"}</CardTitle>
                      {user.isAdmin && <AdminBadge />}
                    </div>
                    <CardDescription>{user.isAnonymous ? "You are browsing as a guest." : user.email}</CardDescription>
                  </>
                ) : (
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)} className="space-y-2">
                      <FormField
                        control={profileForm.control}
                        name="displayName"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl><Input placeholder="Your display name" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </form>
                  </Form>
                )}
              </div>
              {!user.isAnonymous && (
                <div>
                  {isEditingProfile ? (
                    <div className="flex gap-2">
                       <Button onClick={profileForm.handleSubmit(handleProfileUpdate)} size="sm">Save</Button>
                       <Button onClick={() => { setIsEditingProfile(false); profileForm.reset({ displayName: user.displayName || "" }); }} variant="outline" size="sm">Cancel</Button>
                    </div>
                  ) : (
                    <Button variant="outline" size="icon" onClick={() => setIsEditingProfile(true)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
              <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center"><User className="mr-2 h-5 w-5 text-primary" /> User Information</h3>
                  <Separator />
                  <div className="mt-4 space-y-2">
                      <p><strong>Email:</strong> {user.email || "Not provided"}</p>
                      <p><strong>User ID:</strong> <code className="text-sm bg-muted p-1 rounded-sm">{user.uid}</code></p>
                  </div>
              </div>

              <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center"><Link2 className="mr-2 h-5 w-5 text-primary" /> Linked Accounts</h3>
                  <Separator />
                  <div className="mt-4 space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center gap-3">
                            <GoogleIcon className="h-6 w-6"/>
                            <span className="font-medium">Google</span>
                        </div>
                        {isGoogleSignIn ? (
                             <Badge variant="secondary">Connected</Badge>
                        ) : (
                            <Button onClick={linkWithGoogle}>Link Account</Button>
                        )}
                    </div>
                    {/* Add other providers similarly */}
                  </div>
              </div>
          </CardContent>
        </Card>

        {isPasswordSignIn && (
            <>
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><Lock className="mr-2 h-5 w-5 text-primary"/> Change Password</CardTitle>
                        <CardDescription>Update your password here. Please enter your current password to proceed.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...passwordForm}>
                            <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)} className="space-y-4">
                                <FormField control={passwordForm.control} name="oldPassword" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Current Password</FormLabel>
                                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={passwordForm.control} name="newPassword" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <FormField control={passwordForm.control} name="confirmPassword" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm New Password</FormLabel>
                                        <FormControl><Input type="password" placeholder="••••••••" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}/>
                                <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                    {passwordForm.formState.isSubmitting ? "Changing..." : "Change Password"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center"><KeyRound className="mr-2 h-5 w-5 text-primary"/> Forgot Your Password?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            If you've forgotten your password, you can request a password reset email to be sent to you.
                        </p>
                        <Button onClick={handlePasswordReset}>
                            <Mail className="mr-2 h-4 w-4" /> Send Password Reset Email
                        </Button>
                    </CardContent>
                </Card>
            </>
        )}
      </div>
    </div>
  );
}
