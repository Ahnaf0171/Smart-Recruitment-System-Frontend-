import { Decision } from "../types";

export const DECISIONS: { value: Decision; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "interested", label: "Interested" },
  { value: "not_interested", label: "Not Interested" },
  { value: "accept", label: "Accept" },
  { value: "reject", label: "Reject" },
];
