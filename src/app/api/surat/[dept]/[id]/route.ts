// app/api/surat/[dept]/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/infrastructure/databases/prisma-client"

type Params = { params: Promise<{ dept: string; id: string }> }

export async function GET(_: Request, { params }: Params) {
  const { dept, id } = await params

  // dept dari URL bisa shortName, cari id-nya dulu
  const deptData = await prisma.department.findFirst({
    where: { OR: [{ id: dept }, { shortName: dept }] },
    select: { id: true },
  })

  const surat = await prisma.dataSurat.findFirst({
    where: {
      id:     Number(id),
      deptId: deptData?.id ?? dept,
    },
    include: { dept: true },
  })

  if (!surat) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 })
  return NextResponse.json(surat)
}

export async function PATCH(req: Request, { params }: Params) {
  const { dept, id } = await params
  const body = await req.json()

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.dataSurat.findFirst({
      where: { id: Number(id), deptId: dept },
    })
    if (!existing) throw new Error("Surat tidak ditemukan")

    // Konversi shortName → id jika body.deptId berisi shortName
    let targetDeptId = existing.deptId
    if (body.deptId) {
      const deptData = await tx.department.findFirst({
        where: { shortName: body.deptId },
        select: { id: true },
      })
      targetDeptId = deptData?.id ?? existing.deptId
    }

    const deptBerubah = targetDeptId !== existing.deptId

    let nomor = existing.nomor

    if (deptBerubah) {
      const suratDeptBaru = await tx.dataSurat.findMany({
        where: { deptId: targetDeptId },
        select: { nomor: true },
      })

      const max = suratDeptBaru.reduce((acc: number, s: { nomor: string }) => {
        const n = parseInt(s.nomor, 10)
        return isNaN(n) ? acc : Math.max(acc, n)
      }, 0)

      nomor = String(max + 1).padStart(4, "0")
    }

    const surat = await tx.dataSurat.update({
      where: { id: Number(id) },
      data: {
        nomor,
        deptId:        targetDeptId,  // ← pakai id, bukan shortName
        perihal:       body.perihal        ?? existing.perihal,
        asalSurat:     body.asalSurat      ?? existing.asalSurat,
        noSurat:       body.noSurat        ?? existing.noSurat,
        lampiran:      body.lampiran       ?? existing.lampiran,
        tanggalSurat:  body.tanggalSurat
          ? new Date(body.tanggalSurat)
          : existing.tanggalSurat,
        tanggalTerima: body.tanggalTerima
          ? new Date(body.tanggalTerima)
          : existing.tanggalTerima,
      },
      include: { dept: true },
    })

    return surat
  })

  return NextResponse.json(result)
}

export async function DELETE(_: Request, { params }: Params) {
  const { dept, id } = await params

  await prisma.dataSurat.delete({
    where: { id: Number(id) },
  })

  return NextResponse.json({ success: true })
}