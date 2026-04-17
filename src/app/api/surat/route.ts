import { NextResponse } from "next/server"
import { prisma } from "@/infrastructure/databases/prisma-client"

export async function GET() {
  try {
    const data = await prisma.registerSurat.findMany({
      include: { dept: true, detailSurat: true },
      orderBy: { nomor: "asc" },
    })
    return NextResponse.json(data)
  } catch (error) {
    console.error("Gagal mengambil data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { deptId, asalSurat, tujuan, tanggalTerima, suratList } = body

    if (!deptId || !asalSurat || !tanggalTerima || !Array.isArray(suratList) || suratList.length === 0) {
      return NextResponse.json({ error: "Field wajib tidak lengkap" }, { status: 400 })
    }

    const dept = await prisma.department.findUnique({ where: { id: deptId } })
    if (!dept) return NextResponse.json({ error: "Departemen tidak ditemukan" }, { status: 404 })

    const lastRegister = await prisma.registerSurat.findFirst({
      where: { deptId },
      orderBy: { nomor: "desc" },
      select: { nomor: true },
    })
    const lastNumber = lastRegister ? parseInt(lastRegister.nomor, 10) : 0
    const nomor = String(lastNumber + 1).padStart(4, "0")

    const created = await prisma.registerSurat.create({
      data: {
        nomor,
        dept:          { connect: { id: deptId } },
        asalSurat,
        tujuan:        tujuan || "",
        tanggalTerima: new Date(tanggalTerima),
        detailSurat: {
          create: suratList.map((s: any) => ({
            perihal:      s.perihal,
            noSurat:      s.noSurat  || null,
            lampiran:     s.lampiran || null,
            tanggalSurat: new Date(s.tanggalSurat),
          })),
        },
      },
      include: { dept: true, detailSurat: true },
    })

    return NextResponse.json(created, { status: 201 })
  } catch (error) {
    console.error("Gagal menyimpan:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}