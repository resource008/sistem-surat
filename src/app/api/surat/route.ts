// app/api/surat/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/infrastructure/databases/prisma-client"

const PI_DEPT_ID = "PI"

// ─── GET ──────────────────────────────────────────────────────────────────────

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const idsParam = searchParams.get("ids")
    const type     = searchParams.get("type") // "pi" | "surat" | null
    const ids      = idsParam?.split(",").map(Number).filter(Boolean)

    // ── Mode PI ──────────────────────────────────────────────────
    if (type === "pi") {
      const data = await prisma.registerPI.findMany({
        where  : ids && ids.length > 0 ? { id: { in: ids } } : undefined,
        include: { dept: true, detailPI: true },
        orderBy: { tanggalTerima: "desc" }, // ✅ terbaru di atas
      })
      return NextResponse.json(data)
    }

    // ── Mode Surat (default) ──────────────────────────────────────
    const data = await prisma.registerSurat.findMany({
      where  : ids && ids.length > 0 ? { id: { in: ids } } : undefined,
      include: { dept: true, detailSurat: true },
      orderBy: { tanggalTerima: "desc" }, // ✅ terbaru di atas
    })
    return NextResponse.json(data)

  } catch (error: any) {
    console.error("GET /api/surat error:", {
      message: error.message,
      code   : error.code,
      meta   : error.meta,
    })
    return NextResponse.json({
      error : "Gagal mengambil data surat",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    }, { status: 500 })
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { deptId, asalSurat, tujuan, tanggalTerima } = body

    // ── Validasi field umum ──
    const missingFields: string[] = []
    if (!deptId)       missingFields.push("deptId")
    if (!asalSurat)    missingFields.push("asalSurat")
    if (!tanggalTerima) missingFields.push("tanggalTerima")

    if (missingFields.length > 0) {
      return NextResponse.json({
        error: `Field wajib tidak lengkap: ${missingFields.join(", ")}`,
      }, { status: 400 })
    }

    // ── Cek departemen ──
    const dept = await prisma.department.findUnique({ where: { id: deptId } })
    if (!dept) {
      return NextResponse.json({
        error: `Departemen dengan ID '${deptId}' tidak ditemukan`,
      }, { status: 404 })
    }

    // ── Validasi tanggal ──
    const parsedTanggal = new Date(tanggalTerima)
    if (isNaN(parsedTanggal.getTime())) {
      return NextResponse.json({ error: "Format tanggalTerima tidak valid" }, { status: 400 })
    }

    // ── Route: PI atau Surat biasa ──
    if (deptId === PI_DEPT_ID) {
      return await handlePI({ body, dept, parsedTanggal, asalSurat, tujuan, deptId })
    } else {
      return await handleSurat({ body, dept, parsedTanggal, asalSurat, tujuan, deptId })
    }

  } catch (error: any) {
    console.error("POST /api/surat error:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
    })
    if (error.code === "P2002") return NextResponse.json({ error: "Nomor sudah ada" }, { status: 409 })
    if (error.code === "P2003") return NextResponse.json({ error: "Foreign key tidak valid" }, { status: 400 })
    if (error.code === "P2025") return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 })

    return NextResponse.json({
      error: "Gagal menyimpan data",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    }, { status: 500 })
  }
}

// ─── Handler: RegisterPI ───────────────────────────────────────────

async function handlePI({ body, parsedTanggal, asalSurat, tujuan, deptId, }: {
  body: any; dept: any; parsedTanggal: Date; asalSurat: string; tujuan: string; deptId: string
}) {
  const { piList } = body
  if (!Array.isArray(piList) || piList.length === 0) {
    return NextResponse.json({ error: "Field wajib tidak lengkap: piList" }, { status: 400 })
  }

  const allRegisters = await prisma.registerPI.findMany({
    where : { deptId },
    select: { nomor: true },
  })
  const lastNumber = allRegisters.reduce((max, r) => {
    const n = parseInt(r.nomor, 10)
    return isNaN(n) ? max : Math.max(max, n)
  }, 0)
  const nomor = String(lastNumber + 1).padStart(4, "0")

  const created = await prisma.registerPI.create({
    data: {
      nomor,
      dept         : { connect: { id: deptId } },
      asalSurat,
      tanggalTerima: parsedTanggal,
      detailPI: {
        create: piList.map((p: any) => {
          const tglSurat = new Date(p.tanggalSurat)
          if (isNaN(tglSurat.getTime())) throw new Error(`tanggalSurat tidak valid: ${p.tanggalSurat}`)
          return {
            namaSupplier: p.namaSupplier,
            noInvoice   : p.noInvoice  || null,
            nomorSurat  : p.nomorSurat || null,
            tujuan      : p.tujuan     || null,
            cc          : p.cc         || null,
            tanggalSurat: tglSurat,
          }
        }),
      },
    },
    include: { dept: true, detailPI: true },
  })

  return NextResponse.json(created, { status: 201 })
}

// ─── Handler: RegisterSurat ───────────────────────────────────────────────────

async function handleSurat({ body, parsedTanggal, asalSurat, tujuan, deptId, }: {
  body: any; dept: any; parsedTanggal: Date; asalSurat: string; tujuan: string; deptId: string
}) {
  const { suratList } = body
  if (!Array.isArray(suratList) || suratList.length === 0) {
    return NextResponse.json({ error: "Field wajib tidak lengkap: suratList" }, { status: 400 })
  }

  const allRegisters = await prisma.registerSurat.findMany({
    where : { deptId },
    select: { nomor: true },
  })
  const lastNumber = allRegisters.reduce((max, r) => {
    const n = parseInt(r.nomor, 10)
    return isNaN(n) ? max : Math.max(max, n)
  }, 0)
  const nomor = String(lastNumber + 1).padStart(4, "0")

  const created = await prisma.registerSurat.create({
    data: {
      nomor,
      dept         : { connect: { id: deptId } },
      asalSurat,
      tujuan       : tujuan || "",
      tanggalTerima: parsedTanggal,
      detailSurat: {
        create: suratList.map((s: any) => {
          const tglSurat = new Date(s.tanggalSurat)
          if (isNaN(tglSurat.getTime())) throw new Error(`tanggalSurat tidak valid: ${s.tanggalSurat}`)
          return {
            perihal      : s.perihal,
            noSurat      : s.noSurat  || null,
            lampiran     : s.lampiran || null,
            tanggalSurat : tglSurat,
            // ✅ tujuan dihapus — field tidak ada di schema DetailSurat
          }
        }),
      },
    },
    include: { dept: true, detailSurat: true },
  })

  return NextResponse.json(created, { status: 201 })
}