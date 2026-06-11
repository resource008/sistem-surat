import { NextResponse }        from "next/server"
import { headers }             from "next/headers"
import { auth }                from "@/infrastructure/auth/better-auth"
import { fetchDepartemen }     from "@/services/departemen-service"
import type { ExtendedSession } from "@/types/auth"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    }) as ExtendedSession | null

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await fetchDepartemen()
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) console.error("GET /api/dept:", error.message)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}