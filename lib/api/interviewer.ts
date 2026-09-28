// import { getData } from "@/lib/api/methods";

// export interface InterviewSession {
//   id: string;
//   scheduled: string;
//   allowed_candidates: any[];
// }

// export const getInterviewerSessions = () =>
//   getData<InterviewSession[]>("/api/findall/");

import { patchData } from "@/lib/api/methods";
import { postData } from "@/lib/api/methods";
import { deleteData } from "@/lib/api/methods";

export interface CreateSessionPayload {
  position: string;
  stacks: string[];
  level: string;
  allowed_candidates: string[];
  num_questions: number;
  scheduled: string;
}
export interface CreateSessionResponse {
  Session_ID: string;
}

type DecidePayload = {
  session_id?: string;
  candidate_id?: string;
  decision: string;
};

export const createSessionApi = (payload: CreateSessionPayload) =>
  postData<CreateSessionPayload, CreateSessionResponse>("/api/gen/", payload);

export const decideMutation = (payload: DecidePayload) =>
  patchData<DecidePayload, null>("/api/decide/", payload);

export const deleteSessionMutation = async (sessionId: string) => {
  return deleteData(`/api/delete/${sessionId}/`);
};
