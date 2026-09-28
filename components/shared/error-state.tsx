"use client";
import { Button } from "@/components/ui/button";
import { getCookie } from "@/lib/utils";
import { AlertTriangle, LayoutDashboard, RefreshCcw } from "lucide-react";
import Link from "next/link";

type ErrorStateProps = {
  onRetry?: () => void;
  message?: string;
};

export default function ErrorState({
  onRetry,
  message = "Something went wrong",
}: ErrorStateProps) {
  const token = getCookie("access_token");
  const user_role = getCookie("user_role");
  return (
    <div className="bg-background flex items-center justify-center animate-fade-in py-8 min-h-screen">
      <div className="max-w-xl w-full text-center">
        <div className="rounded-xl border border-border bg-card shadow-sm p-8">
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-16 w-16 text-destructive animate-pulse" />
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {message}
          </h2>
          <p className="text-muted-foreground mb-6">
            We couldn’t load the data. Please try again.
          </p>

          <div className="flex gap-2 justify-center">
            {onRetry && (
              <Button onClick={onRetry}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            )}
            {token && user_role && (
              <Button asChild className="bg-destructive!">
                <Link href={`/${user_role}/dashboard`}>
                  <LayoutDashboard />{" "}
                  <span className="hidden md:flex">Go to Dashboard</span>
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
