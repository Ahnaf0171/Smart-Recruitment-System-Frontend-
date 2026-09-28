import { type NextRequest, NextResponse } from "next/server"
import { mockDB } from "@/lib/mock-database"
import type { LoginResponse } from "@/lib/types"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const user = mockDB.users.findByEmail(email)

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate mock JWT tokens (in real app, use proper JWT library)
    const accessToken = `mock_access_${user._id}_${Date.now()}`
    const refreshToken = `mock_refresh_${user._id}_${Date.now()}`

    const response: LoginResponse = {
      access: accessToken,
      refresh: refreshToken,
      username: user.username,
      role: user.role,
      user_id: user._id,
    }

    // Set HTTP-only cookie for additional security
    const nextResponse = NextResponse.json(response)
    nextResponse.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return nextResponse
  } catch (error) {
    console.error("Login API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
