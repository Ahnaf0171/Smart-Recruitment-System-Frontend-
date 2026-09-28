import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"

export async function GET(request: NextRequest, { params }: { params: { session_id: string } }) {
  try {
    const sessionId = params.session_id

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const results = mockDB.responses.findBySession(sessionId)

    return NextResponse.json(results)
  } catch (error) {
    console.error("Find results API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
