export const API_BASE_URL = "http://127.0.0.1:8000";

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: "/accounts/signup",
  LOGIN: "/accounts/login",

  // Interview session endpoints
  CREATE_SESSION: "/api/gen",
  FIND_ALL_SESSIONS: "/api/findall/",
  FIND_SESSION: "/api/find",
  SESSION_RESULTS: "/api/results",

  // Response endpoints
  SUBMIT_RESPONSE: "/api/response/",
  UPDATE_DECISION: "/api/decide/",
} as const;

export const USER_ROLES = {
  CANDIDATE: "candidate",
  INTERVIEWER: "interviewer",
} as const;

export const DECISION_STATUS = {
  PENDING: "pending",
  INTERESTED: "interested",
  NOT_INTERESTED: "not_interested",
  ACCEPT: "accept",
  REJECT: "reject",
} as const;

export const SKILL_LEVELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
} as const;
