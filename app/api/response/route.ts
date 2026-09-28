import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"
import type { CandidateResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const sessionId = formData.get("session_id") as string

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    // Get session details
    const session = mockDB.sessions.findById(sessionId)
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    // Extract video files and metadata
    const responses: Array<{
      question_id: string
      given_answer: string
      score: number
    }> = []

    // Process each video file
    let index = 0
    while (formData.get(`video_${index}`)) {
      const videoFile = formData.get(`video_${index}`) as File
      const questionId = formData.get(`question_id_${index}`) as string
      const duration = formData.get(`duration_${index}`) as string

      if (videoFile && questionId) {
        // In a real app, you'd upload the video to cloud storage
        // For now, we'll simulate processing and scoring
        const mockScore = Math.random() * 4 + 6 // Random score between 6-10

        responses.push({
          question_id: questionId,
          given_answer: `Video response recorded (${duration}s)`,
          score: Number.parseFloat(mockScore.toFixed(2)),
        })
      }
      index++
    }

    // Calculate total score
    const totalScore = responses.reduce((sum, r) => sum + r.score, 0)

    // Create candidate response record
    const candidateResponse: Omit<CandidateResponse, "id"> = {
      session_id: sessionId,
      candidate_id: "candidate-1", // In real app, get from JWT
      candidate_name: "John Doe", // In real app, get from user data
      candidate_mail: "john@example.com", // In real app, get from user data
      responses,
      total_score: Number.parseFloat(totalScore.toFixed(2)),
      decision: "pending",
    }

    const savedResponse = mockDB.responses.create(candidateResponse)

    return NextResponse.json({
      status: "success",
      message: "Responses submitted successfully",
      response_id: savedResponse.id,
      total_score: savedResponse.total_score,
    })
  } catch (error) {
    console.error("Submit response API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
