import Link from "next/link";

export default function BookmarkPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center p-24">
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Bookmark</h1>
        <p className="text-muted-foreground">
          This is a placeholder for the Bookmark page.
        </p>
        <Link href="/" className="mt-4 inline-block text-primary hover:underline">
          Go back to Home
        </Link>
      </div>
    </div>
  );
}
