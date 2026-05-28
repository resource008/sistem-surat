import { NextRequest, NextResponse }  from "next/server"
import { headers }                    from "next/headers"
import { auth }                       from "@/infrastructure/auth/better-auth"
import { fetchAdminDashboardStats }   from "@/services/admin-dashboard-service"
import { AppError }                   from "@/lib/errors"
import { RoleSchema }                 from "@/types/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Validasi role di runtime
    const parsed = RoleSchema.safeParse((session.user as any).role)
    if (!parsed.success || parsed.data !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await fetchAdminDashboardStats(req.nextUrl.searchParams)

    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    if (error instanceof Error) {
      console.error("GET /api/admin/stats:", error.message)
    }

    return NextResponse.json(
      { error: "Gagal mengambil data dashboard admin" },
      { status: 500 }
    )
  }
}