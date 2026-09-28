import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import { Calendar, Play, Zap } from "lucide-react";
import Link from "next/link";

export default function CandidateDashboardCard({ session }: { session: any }) {
  return (
    <Card
      key={session?.id}
      className="border-border/50 shadow-soft hover:shadow-primary transition-all duration-300 overflow-hidden group animate-fade-in gap-0!"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-primary to-accent"></div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-2">
            <CardTitle className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {session?.position}
            </CardTitle>
            {session.company && (
              <CardDescription className="mt-1 line-clamp-1 text-muted-foreground">
                Company: {session?.company}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {session?.scheduled_time && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2" />
              {formatDate(session?.scheduled_time)}
            </div>
          )}
        </div>

        <div className="bg-secondary/30 p-3 rounded-lg border border-border">
          <h4 className="font-medium text-sm text-foreground mb-2 flex items-center">
            <Zap className="w-4 h-4 mr-1 text-yellow-500" />
            What to expect:
          </h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li className="flex">
              <span className="text-primary mr-1">•</span>
              Record video responses to {session?.qa_pairs?.length} questions
            </li>
            <li className="flex">
              <span className="text-primary mr-1">•</span>
              Take your time - no time limit per question
            </li>
            <li className="flex">
              <span className="text-primary mr-1">•</span>
              Review and re-record if needed
            </li>
          </ul>
        </div>
        <Button asChild className="w-full gradient-bg">
          <Link href={`/candidate/interview/${session?.id}`}>
            <Play className="w-4 h-4 mr-2" />
            Start Interview
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
