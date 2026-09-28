import { CheckCircle } from "lucide-react";
import React from "react";

function Label({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label
      className={`text-sm font-medium text-slate-600 ${className}`}
      {...props}
    >
      {children}
    </label>
  );
}

function SessionQAPair({
  qa,
  index,
}: {
  qa: { question_id: string; question: string; answer: string };
  index: number;
}) {
  return (
    <div
      key={qa.question_id}
      className="border-l-4 border-primary/20 pl-4 py-2 hover:border-primary/40 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
            <span className="text-sm font-semibold text-primary">
              {index + 1}
            </span>
          </div>
          <h3 className="font-semibold text-slate-900">Question {index + 1}</h3>
        </div>
      </div>
      <p className="text-slate-700 mb-4 leading-relaxed pl-11">{qa.question}</p>
      <div className="bg-slate-50/50 p-4 rounded-lg border border-slate-200/50">
        <div className="flex items-center mb-2">
          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
          <Label className="text-xs font-medium text-slate-600 uppercase tracking-wide">
            Expected Answer
          </Label>
        </div>
        <p className="text-sm text-slate-700 mt-1 leading-relaxed">
          {qa.answer}
        </p>
      </div>
    </div>
  );
}

export default SessionQAPair;
