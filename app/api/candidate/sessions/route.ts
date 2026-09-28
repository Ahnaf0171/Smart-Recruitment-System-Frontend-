import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const candidateEmail = searchParams.get("email")

    if (!candidateEmail) {
      return NextResponse.json({ error: "Candidate email is required" }, { status: 400 })
    }

    // Find sessions where the candidate is allowed
    const sessions = mockDB.sessions.findByCandidate(candidateEmail)

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Find candidate sessions API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
