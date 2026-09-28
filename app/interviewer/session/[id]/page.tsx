"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, Users, Eye, FileText, Code } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import AllowedCandidatesItem from "../../../../features/interviewer/allowed-candidate-item";
import SessionQAPair from "../../../../features/interviewer/session-qa-pair";
import { formatDate } from "@/lib/utils";
import { LevelBadge } from "@/components/shared/level-badge";
import { CustomLabel } from "@/components/shared/custom-label";
import { useFetch } from "@/hooks/use-fetch";
import ErrorState from "@/components/shared/error-state";
import LoadingState from "@/components/shared/loading-state";

export default function SessionDetailsPage() {
  const [copiedEmails, setCopiedEmails] = useState<string[]>([]);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const pathname = usePathname();
  const sessionId = pathname.split("/")[3];

  const copyToClipboard = async (text: string, identifier: string) => {
    try {
      await navigator.clipboard.writeText(text);
      if (identifier.includes("@")) {
        setCopiedEmails([...copiedEmails, identifier]);
        setTimeout(() => {
          setCopiedEmails(copiedEmails.filter((e) => e !== identifier));
        }, 2000);
      } else {
        setCopiedLink(identifier);
        setTimeout(() => setCopiedLink(null), 2000);
      }
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const generateInviteLink = (candidateEmail: string) => {
    return `${window.location.origin}/candidate/interview/${
      session.id
    }?email=${encodeURIComponent(candidateEmail)}`;
  };

  const {
    data: session,
    loading,
    error,
  } = useFetch<any>(`/api/find/${sessionId}`);
  if (error) return <ErrorState message={error} />;
  if (loading) return <LoadingState data="Interview Sessions" />;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <PageHeader
        title={session?.position}
        description="Interview Session Details"
        backLabel="Back to Dashboard"
        backHref="/interviewer/dashboard"
        backIcon={<ArrowLeft />}
      >
        <Button variant="outline" asChild size="sm">
          <Link href={`/interviewer/session/${session?.id}/results`}>
            <Eye />
            <span className="hidden md:flex">View Results</span>
          </Link>
        </Button>
      </PageHeader>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Session Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-primary" />
                  Session Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <CustomLabel>Position</CustomLabel>
                  <p className="text-slate-900 font-medium text-lg">
                    {session?.position}
                  </p>
                </div>

                <div>
                  <CustomLabel>Technology Stack</CustomLabel>
                  <div className="flex flex-wrap gap-2">
                    {session?.stack.split(", ").map((tech: string) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 px-3 py-1"
                      >
                        <Code className="w-3 h-3 mr-1" />
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {session?.level && (
                  <div>
                    <CustomLabel>Experience Level</CustomLabel>
                    <LevelBadge level={session.level} />
                  </div>
                )}

                <div>
                  <CustomLabel>Questions</CustomLabel>
                  <div className="flex items-center text-slate-900">
                    <FileText className="w-4 h-4 mr-2 text-primary" />
                    <span className="font-semibold">
                      {session?.qa_pairs.length} questions
                    </span>
                  </div>
                </div>

                {session?.scheduled && (
                  <div>
                    <CustomLabel>Scheduled Date</CustomLabel>
                    <div className="flex items-center text-slate-900">
                      <Calendar className="w-4 h-4 mr-2 text-primary" />
                      <span className="font-medium">
                        {formatDate(session?.scheduled)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Invited Candidates */}
            <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-primary" />
                  Invited Candidates ({session?.allowed_candidates.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {session?.allowed_candidates.map((email: string) => (
                    <AllowedCandidatesItem
                      email={email}
                      key={email}
                      copiedEmails={copiedEmails}
                      copyToClipboard={copyToClipboard}
                      generateInviteLink={generateInviteLink}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Questions & Answers */}
          <div className="lg:col-span-2">
            <Card className="border-slate-200/60 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-900">
                  Interview Questions
                </CardTitle>
                <CardDescription className="text-slate-600">
                  AI-generated questions tailored for {session?.position}{" "}
                  position
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {session?.qa_pairs.map(
                    (
                      qa: {
                        question_id: string;
                        question: string;
                        answer: string;
                      },
                      index: number
                    ) => (
                      <SessionQAPair
                        qa={qa}
                        index={index}
                        key={qa.question_id}
                      />
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
