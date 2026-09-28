import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"

export async function POST(request: NextRequest) {
  try {
    const { username, email, phone, password, role } = await request.json()

    // Validate input
    if (!username || !email || !phone || !password || !role) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (!["candidate", "interviewer"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = mockDB.users.findByEmail(email)
    if (existingUser) {
      return NextResponse.json({ error: "User already exists with this email" }, { status: 409 })
    }

    // Create new user
    const newUser = mockDB.users.create({
      username,
      email,
      phone,
      password, // In real app, hash the password
      role: role as "candidate" | "interviewer",
    })

    // Return user data (excluding password)
    const { password: _, ...userResponse } = newUser
    return NextResponse.json(userResponse, { status: 201 })
  } catch (error) {
    console.error("Signup API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
