"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, Target, Clock } from "lucide-react";
import { usePathname } from "next/navigation";
import CandidateResultCard from "../../../../../features/interviewer/candidate-result-card";
import StatCard from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import { formatDate } from "@/lib/utils";
import { LevelBadge } from "@/components/shared/level-badge";
import { useFetch } from "@/hooks/use-fetch";
import ErrorState from "@/components/shared/error-state";
import LoadingState from "@/components/shared/loading-state";
import { decideMutation } from "@/lib/api/interviewer";
import { useMutation } from "@/hooks/use-mutation";
import EmptyState from "@/components/shared/empty-state";

export default function SessionResultsPage() {
  const [resultsData, setResultsData] = useState<any[]>([]);
  const pathname = usePathname();
  const pathParts = pathname.split("/"); // ['', 'interviewer', 'session', '123', 'results']
  const sessionId = pathParts[3];

  const {
    data: session,
    loading: sessionLoading,
    error: sessionError,
  } = useFetch<any>(sessionId ? `/api/find/${sessionId}` : null);

  const {
    data: resultData = [],
    loading: resultsLoading,
    error: resultsError,
    refetch: refetchResults,
  } = useFetch<any[]>(sessionId ? `/api/results/${sessionId}` : null);
  useEffect(() => {
    if (resultData?.length) {
      setResultsData(resultData);
    }
  }, [resultData]);

  const { mutate: updateDecisions, loading: decisionLoading } =
    useMutation(decideMutation);
  const handleDecisionChange = (candidateId: string, decision: string) => {
    // optimistic UI
    setResultsData((prev) =>
      prev.map((r) => (r.candidate_id === candidateId ? { ...r, decision } : r))
    );
    updateDecisions(
      {
        session_id: sessionId!,
        candidate_id: candidateId,
        decision,
      },
      {
        successMessage: "Decision updated",
        onError: () => {
          refetchResults(); // rollback if failed
        },
      }
    );
  };
  const highestScore = Math.max(...resultsData.map((r) => r.total_score));

  if (resultsError) return <ErrorState message={resultsError} />;
  if (resultsLoading) return <LoadingState data="Interview Results" />;
  if (sessionError) return <ErrorState message={sessionError} />;
  if (sessionLoading) return <LoadingState data="Interview Session" />;

  return (
    <div className="min-h-screen bg-white pb-12">
      {session && (
        <PageHeader
          title={`${session.position} - Results`}
          description="Review candidate responses and make decisions"
          backLabel="Back to Session"
          backHref={`/interviewer/session/${sessionId}`}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {resultsData.length === 0 ? (
          <EmptyState
            title="No interview responses yet"
            description="Please contact the candidates to give the interview!"
            actionLabel="Go to dashboard"
            actionHref="/interviewer/dashboard"
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <StatCard
                icon={<Users className="w-6 h-6 text-primary" />}
                title={`${resultsData.length}`}
                description="Total Responses"
              />
              <StatCard
                icon={<Target className="w-6 h-6 text-primary" />}
                title={`${
                  resultsData.filter((r) => r.decision === "accept").length
                }`}
                description="Accepted"
              />
              <StatCard
                icon={<Target className="w-6 h-6 text-primary" />}
                title={`${
                  resultsData.filter((r) => r.decision === "interested").length
                }`}
                description="Interested"
              />
              <StatCard
                icon={<Clock className="w-6 h-6 text-primary" />}
                title={`${
                  resultsData.filter((r) => r.decision === "pending").length
                }`}
                description="Pending Review"
              />
            </div>

            <Card>
              <CardContent>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Session Details
                    </h3>
                    <p className="mt-1 text-muted-foreground">
                      <LevelBadge level={session.level} /> • {session.stack}
                    </p>
                    {session.scheduled && (
                      <div className="flex items-center text-muted-foreground mt-2">
                        <Calendar className="w-4 h-4 mr-1 text-primary/70" />
                        Scheduled: {formatDate(session.scheduled)}
                      </div>
                    )}
                  </div>
                  <div className="mt-4 md:mt-0 text-sm text-muted-foreground">
                    {session.qa_pairs.length} questions •{" "}
                    {session.allowed_candidates.length} candidates invited
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                Candidate Results
              </h2>

              <div className="grid grid-cols-1 gap-6">
                {resultsData.map((result) => (
                  <CandidateResultCard
                    key={result.id}
                    result={result}
                    updateDecision={handleDecisionChange}
                    highestScore={highestScore}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
