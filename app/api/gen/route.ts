import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"
import type { CreateSessionPayload, QuestionAnswer } from "@/lib/types"

// Mock AI-generated questions based on position and stack
const generateQuestions = (
  position: string,
  stacks: string[],
  level: string,
  numQuestions: number,
): QuestionAnswer[] => {
  const questionPool = {
    frontend: [
      "What is the difference between useState and useEffect in React?",
      "How do you optimize performance in React applications?",
      "Explain the concept of virtual DOM and its benefits.",
      "What are React hooks and why are they useful?",
      "How do you handle state management in large React applications?",
    ],
    backend: [
      "What is the difference between SQL and NoSQL databases?",
      "How do you handle authentication and authorization in web applications?",
      "Explain the concept of RESTful APIs and their principles.",
      "What are microservices and their advantages over monolithic architecture?",
      "How do you ensure data security in backend applications?",
    ],
    fullstack: [
      "How do you ensure data consistency between frontend and backend?",
      "What is your approach to API design and documentation?",
      "How do you handle error handling across the full stack?",
      "Explain your deployment and CI/CD process.",
      "How do you optimize application performance end-to-end?",
    ],
    general: [
      "Tell me about a challenging project you worked on recently.",
      "How do you stay updated with new technologies and trends?",
      "Describe your approach to debugging complex issues.",
      "How do you handle tight deadlines and pressure?",
      "What motivates you as a developer?",
    ],
  }

  // Determine question category based on position and stacks
  let category = "general"
  const positionLower = position.toLowerCase()
  const stacksLower = stacks.map((s) => s.toLowerCase())

  if (
    positionLower.includes("frontend") ||
    stacksLower.some((s) => ["react", "vue", "angular", "javascript"].includes(s))
  ) {
    category = "frontend"
  } else if (
    positionLower.includes("backend") ||
    stacksLower.some((s) => ["node", "python", "java", "php"].includes(s))
  ) {
    category = "backend"
  } else if (positionLower.includes("fullstack") || positionLower.includes("full stack")) {
    category = "fullstack"
  }

  const questions = questionPool[category as keyof typeof questionPool] || questionPool.general
  const selectedQuestions = questions.slice(0, numQuestions)

  const qaairs = selectedQuestions.map((question, index) => ({
    question_id: `q${Date.now()}_${index}`,
    question,
    answer: `This is a sample answer for: ${question}`, // Mock answer
  }))

  return qaairs
}

export async function POST(request: NextRequest) {
  try {
    const payload: CreateSessionPayload = await request.json()

    // Validate input
    if (
      !payload.position ||
      !payload.stacks ||
      payload.stacks.length === 0 ||
      !payload.level ||
      !payload.allowed_candidates ||
      payload.allowed_candidates.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate AI questions (mocked)
    const qaairs = generateQuestions(payload.position, payload.stacks, payload.level, payload.num_questions || 3)

    // Create session
    const newSession = mockDB.sessions.create({
      position: payload.position,
      stack: payload.stacks,
      level: payload.level,
      created_by: "interviewer-1", // In real app, get from JWT token
      qa_pairs: qaairs,
      allowed_candidates: payload.allowed_candidates,
      scheduled: payload.scheduled,
      num_questions: payload.num_questions,
    })

    return NextResponse.json({
      status: "success",
      message: "Questions and answers generated and saved.",
      Session_ID: newSession.id,
      Created_By: newSession.created_by,
    })
  } catch (error) {
    console.error("Create session API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
