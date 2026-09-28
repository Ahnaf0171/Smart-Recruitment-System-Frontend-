import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionId = params.id

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
    }

    const session = mockDB.sessions.findById(sessionId)

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }

    return NextResponse.json(session)
  } catch (error) {
    console.error("Find session API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
