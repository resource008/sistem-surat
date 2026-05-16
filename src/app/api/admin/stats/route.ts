// src/app/api/admin/stats/route.ts

import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/better-auth"
import { fetchAdminStats } from "@/services/stats-service"
import type { Role } from "@/types"

export async function GET(req: NextRequest) {
  try {
    // ── Auth & role check ─────────────────────────────────────────
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const role = (session.user as { role?: Role }).role
    if (role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // ── Ambil stats via service ───────────────────────────────────
    const rawPeriod = req.nextUrl.searchParams.get("period")
    const stats     = await fetchAdminStats(rawPeriod)

    return NextResponse.json(stats)
  } catch (error) {
    if (error instanceof Error) console.error("GET /api/admin/stats:", error.message)
    return NextResponse.json({ error: "Gagal mengambil statistik" }, { status: 500 })
  }
}