import type { User, InterviewSession, CandidateResponse } from "./types";

// Mock database storage
const mockUsers: User[] = [
  {
    _id: "interviewer-1",
    username: "Beximco Group",
    email: "support@beximco.com",
    phone: "0171111111",
    password: "hashed_password_123",
    role: "interviewer",
    created: new Date().toISOString(),
  },
  {
    _id: "candidate-1",
    username: "John Doe",
    email: "john@example.com",
    phone: "0171111112",
    password: "hashed_password_456",
    role: "candidate",
    created: new Date().toISOString(),
  },
];

const mockSessions: InterviewSession[] = [
  {
    id: "session-1",
    position: "Frontend Developer",
    stack: ["ReactJS", "TailwindCSS", "TypeScript"],
    level: "Intermediate",
    created_by: "interviewer-1",
    qa_pairs: [
      {
        question_id: "q1",
        question:
          "What is the difference between useState and useEffect in React?",
        answer:
          "useState manages component state while useEffect handles side effects and lifecycle events.",
      },
      {
        question_id: "q2",
        question: "How do you optimize performance in React applications?",
        answer:
          "Use React.memo, useMemo, useCallback, lazy loading, and proper component structure.",
      },
    ],
    allowed_candidates: ["john@example.com"],
    scheduled: "2025-08-25T06:30:00Z",
    num_questions: 2,
  },
];

const mockResponses: CandidateResponse[] = [
  {
    id: "response-1",
    session_id: "session-1",
    candidate_id: "candidate-1",
    candidate_name: "John Doe",
    candidate_mail: "john@example.com",
    responses: [
      {
        question_id: "q1",
        given_answer: "Video response recorded (45s)",
        score: 8.5,
      },
      {
        question_id: "q2",
        given_answer: "Video response recorded (62s)",
        score: 7.8,
      },
    ],
    total_score: 8.15,
    decision: "interested",
  },
];

// Mock database operations
export const mockDB = {
  // User operations
  users: {
    findByEmail: (email: string): User | null => {
      return mockUsers.find((user) => user.email === email) || null;
    },
    create: (userData: Omit<User, "_id" | "created">): User => {
      const newUser: User = {
        ...userData,
        _id: `user-${Date.now()}`,
        created: new Date().toISOString(),
      };
      mockUsers.push(newUser);
      return newUser;
    },
    findById: (id: string): User | null => {
      return mockUsers.find((user) => user._id === id) || null;
    },
  },

  // Session operations
  sessions: {
    findAll: (): InterviewSession[] => {
      return mockSessions;
    },
    findById: (id: string): InterviewSession | null => {
      return mockSessions.find((session) => session.id === id) || null;
    },
    findByCreator: (creatorId: string): InterviewSession[] => {
      return mockSessions.filter((session) => session.created_by === creatorId);
    },
    findByCandidate: (candidateEmail: string): InterviewSession[] => {
      return mockSessions.filter((session) =>
        session.allowed_candidates.includes(candidateEmail)
      );
    },
    create: (sessionData: Omit<InterviewSession, "id">): InterviewSession => {
      const newSession: InterviewSession = {
        ...sessionData,
        id: `session-${Date.now()}`,
      };
      mockSessions.push(newSession);
      return newSession;
    },
  },

  // Response operations
  responses: {
    findAll: (): CandidateResponse[] => {
      return mockResponses;
    },
    findBySession: (sessionId: string): CandidateResponse[] => {
      return mockResponses.filter(
        (response) => response.session_id === sessionId
      );
    },
    create: (
      responseData: Omit<CandidateResponse, "id">
    ): CandidateResponse => {
      const newResponse: CandidateResponse = {
        ...responseData,
        id: `response-${Date.now()}`,
      };
      mockResponses.push(newResponse);
      return newResponse;
    },
    updateDecision: (
      responseId: string,
      decision: CandidateResponse["decision"]
    ): boolean => {
      const response = mockResponses.find((r) => r.id === responseId);
      if (response) {
        response.decision = decision;
        return true;
      }
      return false;
    },
  },
};
