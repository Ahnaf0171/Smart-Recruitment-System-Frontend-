import { BrainCog } from "lucide-react";

export default function LoadingState({ data = "data" }) {
  return (
    <div className="bg-background flex items-center justify-center animate-fade-in py-8 min-h-screen">
      <div className="max-w-xl w-full text-center">
        <div className="rounded-xl border border-border bg-card shadow-sm p-8">
          <div className="mx-auto mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
            <BrainCog
              className="h-16 w-16 text-primary animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>

          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Loading {data}...
          </h2>
          <p className="text-muted-foreground">
            Please wait while we fetch the latest information.
          </p>
        </div>
      </div>
    </div>
  );
}
