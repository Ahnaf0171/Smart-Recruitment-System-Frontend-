"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, Users, Eye, ChartArea, Trash2 } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { LevelBadge } from "@/components/shared/level-badge";
import { useState } from "react";
import { useMutation } from "@/hooks/use-mutation";
import { deleteSessionMutation } from "@/lib/api/interviewer";
import ModalWrapper from "@/components/shared/ModalWrapper";
import { useRouter } from "next/navigation";

export default function InterviewerSessionCard({ session }: { session: any }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { mutate: deleteSession, loading: deleteLoading } = useMutation(
    deleteSessionMutation,
  );
  const router = useRouter();
  return (
    <Card key={session.id} className="animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-heading text-foreground line-clamp-1">
              {session.position}
            </CardTitle>
            <CardDescription className="mt-1 text-muted-foreground">
              {Array.isArray(session.stack)
                ? session.stack.join(", ")
                : session.stack}
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
            className="hover:bg-red-100!"
          >
            <Trash2 className="w-4 h-4 text-destructive" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <LevelBadge level={session.level} />
          {/* <span className="text-sm text-muted-foreground">
            {session.qa_pairs?.length} question
            {session.qa_pairs?.length !== 1 ? "s" : ""}
          </span> */}
        </div>

        <div className="space-y-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            {session.scheduled
              ? formatDate(session.scheduled)
              : "Not scheduled"}
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="w-4 h-4 mr-2" />
            {session.allowed_candidates.length} candidate
            {session.allowed_candidates.length !== 1 ? "s" : ""} invited
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" asChild className="flex-1">
            <Link href={`/interviewer/session/${session.id}`}>
              <Eye /> View
            </Link>
          </Button>
          <Button asChild className="flex-1">
            <Link href={`/interviewer/session/${session.id}/results`}>
              Results <ChartArea />
            </Link>
          </Button>
        </div>
      </CardContent>
      <ModalWrapper open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">
            Are you sure you want to delete this interview?
          </h2>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone.
          </p>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>

            <Button
              variant="destructive"
              disabled={deleteLoading}
              onClick={() => {
                deleteSession(session.id, {
                  successMessage: "Interview deleted successfully",
                  onSuccess: () => {
                    setIsDeleteOpen(false);
                    router.refresh();
                  },
                });
              }}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      </ModalWrapper>
    </Card>
  );
}
