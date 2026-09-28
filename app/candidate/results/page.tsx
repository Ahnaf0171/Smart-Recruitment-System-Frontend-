"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Clock, FileText } from "lucide-react";
import type { CandidateResponse, InterviewSession } from "@/lib/types";
import EmptyState from "@/components/shared/empty-state";
import StatCard from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import CandidateResultCard from "../../../features/candidate/candidate-result-card";
import { useFetch } from "@/hooks/use-fetch";
import { useMutation } from "@/hooks/use-mutation";
import { decideMutation } from "@/lib/api/interviewer";
import LoadingState from "@/components/shared/loading-state";
import ErrorState from "@/components/shared/error-state";

interface CandidateResultWithSession extends CandidateResponse {
  session?: InterviewSession;
}

export default function CandidateResultsPage() {
  const [resultsData, setResultsData] = useState<any[]>([]);

  const {
    data: fetchedResults = [],
    loading: resultsLoading,
    error: resultsError,
    refetch: refetchResults,
  } = useFetch<any[]>("/api/results/");
  useEffect(() => {
    if (fetchedResults?.length) setResultsData(fetchedResults);
  }, [fetchedResults]);

  const { mutate: updateDecision, loading: decisionLoading } =
    useMutation(decideMutation);
  const handleDecisionChange = (resultId: string, newDecision: string) => {
    // Optimistically update UI
    setResultsData(
      resultsData.map((r) =>
        r.id === resultId ? { ...r, decision: newDecision } : r
      )
    );
    updateDecision(
      { session_id: resultId, decision: newDecision },
      {
        successMessage: "Decision updated",
        onError: () => {
          refetchResults(); // rollback if API fails
        },
      }
    );
  };

  if (resultsLoading) return <LoadingState data="Interview Results" />;
  if (resultsError) return <ErrorState message={resultsError} />;

  return (
    <div className="min-h-screen pb-12">
      <PageHeader
        title="My Results"
        description="Track your interview performance and feedback"
        backHref="/candidate/dashboard"
        backLabel="Back to Dashboard"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {resultsData.length === 0 ? (
          <EmptyState
            title="No interview results yet"
            description="Complete some interviews to see your results and feedback here."
            actionLabel="Find Interviews"
            actionHref="/candidate/dashboard"
          />
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <StatCard
                icon={<FileText className="w-6 h-6 text-primary" />}
                title={`${resultsData.length}`}
                description="Interviews Completed"
              />
              <StatCard
                icon={<CheckCircle className="w-6 h-6 text-primary" />}
                title={`${
                  resultsData.filter(
                    (r: any) =>
                      r.decision === "interested" || r.decision === "accept"
                  ).length
                }`}
                description="Positive Responses"
              />
              <StatCard
                icon={<Clock className="w-6 h-6 text-primary" />}
                title={`${
                  resultsData.filter((r: any) => r.decision === "pending")
                    .length
                }`}
                description="Pending Review"
              />
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Interview Results
              </h2>

              {resultsData.map((result: any) => (
                <CandidateResultCard
                  result={result}
                  updateDecision={handleDecisionChange}
                  key={result.session_id}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
