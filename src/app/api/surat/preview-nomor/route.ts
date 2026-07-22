import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/better-auth"
import { fetchPreviewNomor } from "@/services/surat-service"
import { AppError } from "@/lib/errors"
import { parseDateInput } from "@/lib/date-input"

function getRegisterYear(tanggalTerima?: Date) {
  return (tanggalTerima ?? new Date()).getUTCFullYear()
}

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

    const tanggalTerimaParam = req.nextUrl.searchParams.get("tanggalTerima")
    const parsedTanggalTerima = tanggalTerimaParam ? parseDateInput(tanggalTerimaParam) : null
    if (tanggalTerimaParam && !parsedTanggalTerima) {
      return NextResponse.json({ error: "Format tanggal tidak valid" }, { status: 400 })
    }
    const tanggalTerima = parsedTanggalTerima ?? undefined

    const nomor = await fetchPreviewNomor(deptId, tanggalTerima)
    const tahunRegistrasi = getRegisterYear(tanggalTerima)

    return NextResponse.json({
      nomor,
      message: "Preview nomor registrasi berhasil dibuat",
      data: {
        nomorRegistrasi: nomor,
        departemenId: deptId,
        tahunRegistrasi,
        resetRule: "Nomor registrasi diulang dari 0001 setiap awal tahun.",
      },
    })

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
