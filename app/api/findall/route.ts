import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"

export async function GET(request: NextRequest) {
  try {
    // In a real app, you'd filter by the authenticated user
    // For now, return all sessions
    const sessions = mockDB.sessions.findAll()

    return NextResponse.json(sessions)
  } catch (error) {
    console.error("Find all sessions API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
