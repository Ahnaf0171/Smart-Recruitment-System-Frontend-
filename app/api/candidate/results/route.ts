import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get("candidate_id")

    if (!candidateId) {
      return NextResponse.json({ error: "Candidate ID is required" }, { status: 400 })
    }

    // Find all responses for this candidate
    const allResponses = mockDB.responses.findAll ? mockDB.responses.findAll() : []
    const candidateResponses = allResponses.filter((response) => response.candidate_id === candidateId)

    // Enrich with session data
    const enrichedResponses = candidateResponses.map((response) => {
      const session = mockDB.sessions.findById(response.session_id)
      return {
        ...response,
        session,
      }
    })

    return NextResponse.json(enrichedResponses)
  } catch (error) {
    console.error("Find candidate results API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
