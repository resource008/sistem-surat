import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/better-auth"
import { fetchAdminDashboardStats } from "@/services/admin-dashboard-service"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await fetchAdminDashboardStats(req.nextUrl.searchParams)

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof Error) {
      console.error("GET /api/admin/stats:", error.message)

      if (error.message.startsWith("BAD_REQUEST")) {
        return NextResponse.json(
          { error: error.message.replace("BAD_REQUEST: ", "") },
          { status: 400 }
        )
      }

      if (error.message.startsWith("NOT_FOUND")) {
        return NextResponse.json(
          { error: error.message.replace("NOT_FOUND: ", "") },
          { status: 404 }
        )
      }
    }

    return NextResponse.json(
      { error: "Gagal mengambil data dashboard admin" },
      { status: 500 }
    )
  }
}