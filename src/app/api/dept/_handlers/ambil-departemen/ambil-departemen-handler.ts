import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/better-auth"
import { fetchDepartemen } from "@/services/departemen-service"
import type { Departemen } from "@/types"
import type { ExtendedSession } from "@/types/auth"

function compactDepartemen<T extends Departemen>(departemen: T) {
  return {
    id: departemen.id,
    shortName: departemen.shortName,
    fullName: departemen.fullName,
    tujuan: departemen.tujuan,
    printSheetName: departemen.printSheetName,
    isActive: departemen.isActive,
  }
}

export async function ambilDepartemen(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    }) as ExtendedSession | null

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const includeInactive = req.nextUrl.searchParams.get("includeInactive") === "true"
    const data = await fetchDepartemen({ includeInactive })
    return NextResponse.json(data.map(compactDepartemen))
  } catch (error) {
    if (error instanceof Error) console.error("GET /api/dept:", error.message)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
