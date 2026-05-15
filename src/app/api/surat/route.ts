import { NextResponse } from "next/server"
import { SuratService } from "@/services/surat.service"

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")
    const idsParam = searchParams.get("ids")

    const data = await SuratService.getAllSurat(type, idsParam)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("GET /api/surat error:", { message: error.message, meta: error.meta })
    return NextResponse.json({
      error: "Gagal mengambil data surat",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    }, { status: 500 })
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { deptId, asalSurat, tanggalTerima } = body

    // Validasi field umum dasar (Controller Level)
    const missingFields: string[] = []
    if (!deptId) missingFields.push("deptId")
    if (!asalSurat) missingFields.push("asalSurat")
    if (!tanggalTerima) missingFields.push("tanggalTerima")

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Field wajib tidak lengkap: ${missingFields.join(", ")}`,
      }, { status: 400 })
    }

    // Panggil Service Layer
    const created = await SuratService.createSurat(body)
    return NextResponse.json(created, { status: 201 })

  } catch (error: any) {
    console.error("POST /api/surat error:", { message: error.message, code: error.code })

    // Pemetaan Custom Error dari Service
    if (error.message.includes("NOT_FOUND")) {
      return NextResponse.json({ error: error.message.replace("NOT_FOUND: ", "") }, { status: 404 })
    }
    if (error.message.includes("BAD_REQUEST")) {
      return NextResponse.json({ error: error.message.replace("BAD_REQUEST: ", "") }, { status: 400 })
    }

    // Pemetaan Error Prisma bawaan
    if (error.code === "P2002") return NextResponse.json({ error: "Nomor sudah ada" }, { status: 409 })
    if (error.code === "P2003") return NextResponse.json({ error: "Foreign key tidak valid" }, { status: 400 })
    if (error.code === "P2025") return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })

    return NextResponse.json({
      error: "Gagal menyimpan data",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    }, { status: 500 })
  }
}