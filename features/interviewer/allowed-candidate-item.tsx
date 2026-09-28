import { Button } from "@/components/ui/button";
import { CheckCircle, LinkIcon } from "lucide-react";

function AllowedCandidatesItem({
  email,
  copiedEmails,
  copyToClipboard,
  generateInviteLink,
}: {
  email: string;
  copiedEmails: string[];
  copyToClipboard: (link: string, email: string) => void;
  generateInviteLink: (email: string) => string;
}) {
  return (
    <div
      key={email}
      className="flex items-center justify-between p-3 bg-slate-50/50 rounded-lg border border-slate-200/50"
    >
      <span className="text-sm font-medium text-slate-900 text-wrap">
        {email}
      </span>
      {/* <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(generateInviteLink(email), email)}
      >
        {copiedEmails.includes(email) ? (
          <CheckCircle className="w-3 h-3 mr-1 text-green-600" />
        ) : (
          <LinkIcon className="w-3 h-3 mr-1" />
        )}
        {copiedEmails.includes(email) ? "Copied!" : "Link"}
      </Button> */}
    </div>
  );
}

export default AllowedCandidatesItem;
