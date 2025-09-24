import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Login</h1>
        <p className="text-muted-foreground">
          This is a placeholder for the login page.
        </p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          Go back to Home
        </Link>
      </div>
    </div>
  );
}
