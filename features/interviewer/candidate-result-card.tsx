import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  ChevronDown,
  ChevronUp,
  Mail,
  MessageSquare,
} from "lucide-react";
import { getAllowedOptions, isSelectEnabled } from "@/lib/utils";
import { DECISIONS } from "@/lib/static/decision";

export default function CandidateResultCard({
  result,
  updateDecision,
  highestScore,
}: {
  result: any;
  updateDecision: (candidateId: string, decision: string) => void;
  highestScore: number;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

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

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600 dark:text-green-400";
    if (score >= 6) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const enabled = isSelectEnabled("interviewer", result.decision);
  const allowedOptions = getAllowedOptions("interviewer", result.decision);
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
      className={`${
        highestScore == result.total_score ? "bg-green-100" : "bg-white"
      } dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col`}
    >
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
              {result.candidate_name}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <Mail className="w-3 h-3 mr-1" />
              {result.candidate_mail}
            </CardDescription>
          </div>
          <div className="gap-4 flex flex-col">
            <div className="flex items-center justify-start sm:justify-end gap-4">
              <div className="flex items-baseline">
                <div
                  className={`text-2xl font-bold ${getScoreColor(
                    result.total_score
                  )}`}
                >
                  {result.total_score.toFixed(1)}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 ml-1">
                  / 10
                </div>
              </div>
              <Badge className={getDecisionColor(result.decision)}>
                {getDecisionText(result.decision)}
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Hide Details
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    Show Details
                  </>
                )}
              </Button>

              <Select
                value={result.decision}
                onValueChange={(value) =>
                  updateDecision(result.candidate_id, value)
                }
                disabled={!enabled}
              >
                <SelectTrigger>
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
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6">
          <h4 className="font-medium text-slate-900 dark:text-white mb-4 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" />
            Question Responses
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.responses.map((response: any, index: number) => (
              <div
                key={response.question_id}
                className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 "
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="font-medium text-slate-900 dark:text-white">
                    Question {index + 1}
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mr-1" />
                    <span
                      className={`font-semibold ${getScoreColor(
                        response.score
                      )}`}
                    >
                      {response.score.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 rounded-md p-3">
                  {response.given_answer || "No response provided"}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
