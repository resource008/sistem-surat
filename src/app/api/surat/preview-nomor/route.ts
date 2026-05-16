// src/app/api/surat/preview-nomor/route.ts
//
// Hanya untuk tampilan preview di form — tidak mengikat.
// Nomor resmi di-generate di dalam transaksi saat POST /api/surat.

import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/better-auth"
import { fetchPreviewNomor } from "@/services/surat-service"

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
    if (error instanceof Error) {
      console.error("GET /api/surat/preview-nomor:", error.message)
      if (error.message.startsWith("NOT_FOUND")) {
        return NextResponse.json({ error: "Departemen tidak ditemukan" }, { status: 404 })
      }
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}