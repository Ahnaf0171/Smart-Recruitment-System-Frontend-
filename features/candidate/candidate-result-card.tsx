import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DECISIONS } from "@/lib/static/decision";
import { getAllowedOptions, isSelectEnabled } from "@/lib/utils";
import { CheckCircle, Clock, XCircle } from "lucide-react";

const getDecisionColor = (decision: string) => {
  switch (decision) {
    case "interested":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
    case "not_interested":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
    case "accept":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
    case "reject":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
    default:
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-800";
  }
};

const getDecisionIcon = (decision: string) => {
  switch (decision) {
    case "interested":
    case "accept":
      return <CheckCircle className="w-4 h-4" />;
    case "not_interested":
    case "reject":
      return <XCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getDecisionText = (decision: string) => {
  switch (decision) {
    case "interested":
      return "Interested";
    case "not_interested":
      return "Not Interested";
    case "accept":
      return "Accepted";
    case "reject":
      return "Rejected";
    default:
      return "Under Review";
  }
};

const getStatusMessage = (decision: string) => {
  switch (decision) {
    case "pending":
      return "Your interview is currently under review. You'll be notified once a decision is made.";
    case "interested":
    case "accept":
      return "Great news! The interviewer is interested in moving forward with your application.";
    case "not_interested":
    case "reject":
      return "Thank you for your time. While this opportunity didn't work out, keep applying and improving!";
    default:
      return "Your interview results are being processed.";
  }
};

const getStatusBgColor = (decision: string) => {
  switch (decision) {
    case "pending":
      return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/30";
    case "interested":
    case "accept":
      return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/30";
    case "not_interested":
    case "reject":
      return "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700";
    default:
      return "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/30";
  }
};

const getStatusTextColor = (decision: string) => {
  switch (decision) {
    case "pending":
      return "text-yellow-800 dark:text-yellow-300";
    case "interested":
    case "accept":
      return "text-green-800 dark:text-green-300";
    case "not_interested":
    case "reject":
      return "text-slate-700 dark:text-slate-300";
    default:
      return "text-blue-800 dark:text-blue-300";
  }
};

export default function CandidateResultCard({ result, updateDecision }: any) {
  const enabled = isSelectEnabled("candidate", result.decision);
  const allowedOptions = getAllowedOptions("candidate", result.decision);
  const visibleOptions = enabled
    ? [
        // current state (read-only, shown in trigger)
        ...DECISIONS.filter((option) => option.value === result.decision),
        // allowed transitions
        ...DECISIONS.filter((option) => allowedOptions.includes(option.value)),
      ]
    : DECISIONS.filter((option) => option.value === result.decision);

  return (
    <Card
      key={result.session_id}
      className="bg-card border-border shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group"
    >
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
              {result.position || "Interview Session"}
            </CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-2 mt-2">
              <span className="bg-muted rounded-md px-2 py-1 text-xs">
                {/* {result.session?.stack
                  ? Array.isArray(result.session.stack)
                    ? result.session.stack.join(", ")
                    : result.session.stack
                  : "Technology Stack"} */}
                {result.company}
              </span>
              {/* {result.session?.scheduled && (
                <div className="flex items-center text-muted-foreground">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(result.session.scheduled)}
                </div>
              )} */}
            </CardDescription>
          </div>
          <div className="mt-4 md:mt-0">
            <Badge
              variant="outline"
              className={`text-sm font-medium px-3 py-1 flex items-center ${getDecisionColor(
                result.decision
              )}`}
            >
              {getDecisionIcon(result.decision)}
              <span className="ml-1">{getDecisionText(result.decision)}</span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          className={`rounded-xl p-4 border ${getStatusBgColor(
            result.decision
          )} ${getStatusTextColor(result.decision)}`}
        >
          <p className="text-sm">{getStatusMessage(result.decision)}</p>
        </div>

        {/* Decision Selector */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm font-medium text-muted-foreground">
            Update your decision:
          </div>
          <Select
            value={result.decision}
            onValueChange={(value) => updateDecision(result.session_id, value)}
            disabled={!enabled}
          >
            <SelectTrigger className="w-40 border-border">
              <SelectValue placeholder="Update decision" />
            </SelectTrigger>
            <SelectContent>
              {visibleOptions.map((option) => {
                const isCurrent = option.value === result.decision;
                return (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={isCurrent}
                  >
                    {option.label}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
