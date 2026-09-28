import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Video } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center animate-fade-in py-8">
      <div className="max-w-xl w-full text-center">
        <div className="rounded-xl border border-border bg-card shadow-sm p-8">
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
            <Video className="h-16 w-16 text-primary animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            This page doesn’t exist
          </h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            The link you followed may be broken, expired, or you might not have
            permission to access it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/interviewer/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
