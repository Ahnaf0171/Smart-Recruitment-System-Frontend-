"use client";

import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";

type Props = {
  open: boolean;
  scheduledTime?: string;
  startsIn?: { days: number; hours: number; minutes: number };
};

export default function InterviewNotStartedModal({ open, scheduledTime, startsIn }: Props) {
  const router = useRouter();

  const parts: string[] = [];
  if (startsIn?.days) parts.push(`${startsIn.days} day${startsIn.days > 1 ? "s" : ""}`);
  if (startsIn?.hours) parts.push(`${startsIn.hours} hour${startsIn.hours > 1 ? "s" : ""}`);
  if (startsIn?.minutes || parts.length === 0)
    parts.push(`${startsIn?.minutes ?? 0} minute${startsIn?.minutes === 1 ? "" : "s"}`);

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="sm:max-w-md text-center"
      >
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <DialogHeader className="items-center">
          <DialogTitle>Your interview time hasn't come yet</DialogTitle>
          <DialogDescription>
            {scheduledTime && <>Scheduled for <strong>{formatDate(scheduledTime)}</strong>.<br /></>}
            Starts in about <strong>{parts.join(" ")}</strong>. Please come back at the scheduled time.
          </DialogDescription>
        </DialogHeader>
        <Button onClick={() => router.push("/candidate/dashboard")} className="w-full">
          Back to Dashboard
        </Button>
      </DialogContent>
    </Dialog>
  );
}