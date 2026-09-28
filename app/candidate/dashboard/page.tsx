"use client";
import { Button } from "@/components/ui/button";
import { Award, Clock, CalendarDays, Eye } from "lucide-react";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import StatCard from "@/components/shared/stat-card";
import { PageHeader } from "@/components/shared/page-header";
import CandidateDashboardCard from "../../../features/candidate/candidate-dashboard-card";
import {
  formatDate,
  getCookie,
  getNextInterview,
  getUpcomingInterviews,
} from "@/lib/utils";
import LoadingState from "@/components/shared/loading-state";
import ErrorState from "@/components/shared/error-state";
import { useFetch } from "@/hooks/use-fetch";

export default function CandidateDashboard() {
  const userName = getCookie("user_name");
  const {
    data: sessions = [],
    loading,
    error,
  } = useFetch<any[]>("/api/findall/");
  if (loading) return <LoadingState data="Interview Sessions" />;
  if (error) return <ErrorState message={error} />;

  const now = new Date();
  const upcomingInterviews = getUpcomingInterviews(sessions, now);
  const nextInterview = getNextInterview(upcomingInterviews, now);

  return (
    <div className="min-h-screen bg-background pb-12">
      <PageHeader
        title="My Interviews"
        description="Participate in video interviews and track your progress"
        welcomeText={`Welcome, ${userName}`}
      >
        <Button variant="outline" asChild size="sm">
          <Link href="/candidate/results">
            <Eye />
            <span className="hidden md:flex">View Results</span>
          </Link>
        </Button>
      </PageHeader>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            icon={<Award className="w-6 h-6 text-primary" />}
            title={`${sessions?.length}`}
            description="Total Interviews"
          />
          <StatCard
            icon={<Clock className="w-6 h-6 text-primary" />}
            title={`${upcomingInterviews?.length}`}
            description="Upcoming Interviews"
          />
          <StatCard
            icon={<CalendarDays className="w-6 h-6 text-primary" />}
            title={`${nextInterview ? nextInterview.position : "🚫"}`}
            description={`${
              nextInterview
                ? formatDate(nextInterview.scheduled_time)
                : "No upcoming interviews"
            }`}
          />
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {sessions?.length === 0 ? (
          <EmptyState
            title="No interviews available"
            description="You haven't been invited to any interviews yet. Check back later or contact the interviewer."
            actionLabel="Refresh"
            actionHref="/candidate/dashboard"
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sessions?.map((session, index) => (
              <CandidateDashboardCard session={session} key={session.id} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
