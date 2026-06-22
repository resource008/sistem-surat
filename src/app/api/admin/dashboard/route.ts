import { NextRequest, NextResponse } from "next/server"
import { fetchAdminDashboardOverview } from "@/services/admin-dashboard-service"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"

export async function GET(req: NextRequest) {
  try {
    await requireAdmin()

    const data = await fetchAdminDashboardOverview(req.nextUrl.searchParams)
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    if (error instanceof Error) {
      console.error("GET /api/admin/dashboard:", error.message)
    }

    return NextResponse.json(
      { error: "Gagal mengambil data dashboard admin" },
      { status: 500 }
    )
  }
}
