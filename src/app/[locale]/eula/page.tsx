
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function EULA() {
  return (
    <div className="container mx-auto max-w-4xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>End-User License Agreement (EULA)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>This is a placeholder for your EULA page.</p>
          <p>
            You should replace this content with your actual End-User License
            Agreement.
          </p>
          <Link href="/" className="text-primary hover:underline">
            Go back to Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

    