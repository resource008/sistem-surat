import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/better-auth"
import { fetchPreviewNomor } from "@/services/surat-service"
import { AppError } from "@/lib/errors"

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const deptId = req.nextUrl.searchParams.get("deptId")
    if (!deptId) {
      return NextResponse.json({ error: "deptId wajib diisi" }, { status: 400 })
    }

    const nomor = await fetchPreviewNomor(deptId)
    return NextResponse.json({ nomor })

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) {
      console.error("GET /api/surat/preview-nomor:", error.message)
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}