import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Register</h1>
        <p className="text-muted-foreground">
          This is a placeholder for the registration page.
        </p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          Go back to Home
        </Link>
      </div>
    </div>
  );
}
