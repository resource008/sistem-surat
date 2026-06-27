import { NextResponse } from "next/server"
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
  }
}

export async function ambilDepartemen() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    }) as ExtendedSession | null

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await fetchDepartemen()
    return NextResponse.json(data.map(compactDepartemen))
  } catch (error) {
    if (error instanceof Error) console.error("GET /api/admin/dept:", error.message)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
