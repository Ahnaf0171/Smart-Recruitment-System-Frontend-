import { Button } from "@/components/ui/button";
import { CircleOff, Plus } from "lucide-react";
import Link from "next/link";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
};

export default function EmptyState({
  title = "No data found",
  description = "There’s nothing here yet.",
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="bg-background flex items-center justify-center animate-fade-in py-8">
      <div className="max-w-xl w-full text-center">
        <div className="rounded-xl border border-border bg-card shadow-sm p-8">
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
            <CircleOff className="h-16 w-16 text-muted-foreground animate-pulse" />
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-2">
            {title}
          </h2>
          <p className="text-muted-foreground mb-6">{description}</p>

          {actionLabel && actionHref && (
            <Button>
              <Plus className="h-4 w-4" />
              <Link href={actionHref}>{actionLabel}</Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
