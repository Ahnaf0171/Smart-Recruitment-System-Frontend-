import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"
import type { DecisionPayload } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const payload: DecisionPayload = await request.json()

    if (!payload.session_id || !payload.candidate_id || !payload.decision) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Find the response by session and candidate
    const responses = mockDB.responses.findBySession(payload.session_id)
    const response = responses.find((r) => r.candidate_id === payload.candidate_id)

    if (!response) {
      return NextResponse.json({ error: "Response not found" }, { status: 404 })
    }

    // Update decision
    const success = mockDB.responses.updateDecision(response.id, payload.decision)

    if (!success) {
      return NextResponse.json({ error: "Failed to update decision" }, { status: 500 })
    }

    return NextResponse.json({
      session_id: payload.session_id,
      candidate_id: payload.candidate_id,
      decision: payload.decision,
    })
  } catch (error) {
    console.error("Update decision API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
