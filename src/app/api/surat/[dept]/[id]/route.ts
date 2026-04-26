import { NextRequest, NextResponse } from "next/server"
import { SuratRepository } from "@/infrastructure/repositories/surat-repositories"

type Params = { params: Promise<{ dept: string; id: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { dept, id } = await params
    const numId = parseInt(id, 10)
    if (isNaN(numId)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    const data = await SuratRepository.findByIdAndDept(numId, dept)
    if (!data) {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("GET /api/surat/[dept]/[id]:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { dept, id } = await params
    const numId = parseInt(id, 10)
    if (isNaN(numId)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    const body = await req.json()
    const { asalSurat, tujuan, tanggalTerima, suratList } = body

    const updated = await SuratRepository.update(numId, dept, {
      asalSurat,
      tujuan,
      tanggalTerima: tanggalTerima ? new Date(tanggalTerima) : undefined,
      detailSurat:   suratList?.map((s: any) => ({
        perihal:      s.perihal,
        noSurat:      s.noSurat   || null,
        lampiran:     s.lampiran  || null,
        tanggalSurat: new Date(s.tanggalSurat),
      })),
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error("PATCH /api/surat/[dept]/[id]:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { dept, id } = await params
    const numId = parseInt(id, 10)
    if (isNaN(numId)) {
      return NextResponse.json({ error: "ID tidak valid" }, { status: 400 })
    }

    await SuratRepository.delete(numId, dept)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("DELETE /api/surat/[dept]/[id]:", error)
    if (error.code === "P2025") {
      return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}