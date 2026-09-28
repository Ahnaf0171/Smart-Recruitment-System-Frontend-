export interface User {
  _id: string;
  username: string;
  email: string;
  phone: string;
  password: string;
  role: "candidate" | "interviewer";
  created: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  username: string;
  role: "candidate" | "interviewer";
  user_id: string;
}

export interface InterviewSession {
  id: string;
  position: string;
  stack: string | string[];
  level: string;
  created_by: string;
  qa_pairs: QuestionAnswer[];
  allowed_candidates: string[];
  scheduled?: string;
  num_questions?: number;
}

export interface QuestionAnswer {
  question_id: string;
  question: string;
  answer: string;
}

export interface CandidateResponse {
  id: string;
  session_id: string;
  candidate_id: string;
  candidate_name: string;
  candidate_mail: string;
  responses: {
    question_id: string;
    given_answer: string;
    score: number;
  }[];
  total_score: number;
  decision: "pending" | "interested" | "not_interested" | "accept" | "reject";
}

export interface CreateSessionPayload {
  position: string;
  stacks: string[];
  level: string;
  allowed_candidates: string[];
  num_questions: number;
  scheduled: string;
}

export interface DecisionPayload {
  session_id: string;
  candidate_id: string;
  decision: "interested" | "not_interested" | "accept" | "reject";
}

export type Decision =
  | "pending"
  | "interested"
  | "not_interested"
  | "accept"
  | "reject";
