// src/app/api/surat/route.ts

import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/better-auth"
import { fetchAllSurat, saveSurat } from "@/services/surat-service"
import { CreateSuratSchema } from "@/app/validation/surat"

// ─── GET /api/surat ───────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const type     = req.nextUrl.searchParams.get("type")
    const idsParam = req.nextUrl.searchParams.get("ids")
    const ids      = idsParam?.split(",").map(Number).filter(Boolean) ?? null

    const data = await fetchAllSurat(type, ids)
    return NextResponse.json(data)

  } catch (error) {
    if (error instanceof Error) console.error("GET /api/surat:", error.message)
    return NextResponse.json({ error: "Gagal mengambil data surat" }, { status: 500 })
  }
}

// ─── POST /api/surat ──────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    // Validasi dengan Zod
    const result = CreateSuratSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 422 })
    }

    const created = await saveSurat(result.data)
    return NextResponse.json(created, { status: 201 })

  } catch (error) {
    if (error instanceof Error) {
      console.error("POST /api/surat:", error.message)

      if (error.message.startsWith("NOT_FOUND")) {
        return NextResponse.json({ error: error.message.replace("NOT_FOUND: ", "") }, { status: 404 })
      }
      if (error.message.startsWith("BAD_REQUEST")) {
        return NextResponse.json({ error: error.message.replace("BAD_REQUEST: ", "") }, { status: 400 })
      }

      const code = (error as any).code
      if (code === "P2002") return NextResponse.json({ error: "Nomor sudah ada" }, { status: 409 })
      if (code === "P2003") return NextResponse.json({ error: "Foreign key tidak valid" }, { status: 400 })
      if (code === "P2025") return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 })
  }
}