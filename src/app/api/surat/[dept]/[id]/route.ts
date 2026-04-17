import { NextResponse } from "next/server"
import { prisma } from "@/infrastructure/databases/prisma-client"

type Params = { params: Promise<{ dept: string; id: string }> }

export async function GET(_: Request, { params }: Params) {
  const { dept, id } = await params

  const deptData = await prisma.department.findFirst({
    where: { OR: [{ id: dept }, { shortName: dept }] },
    select: { id: true },
  })

  const register = await prisma.registerSurat.findFirst({
    where: { id: Number(id), deptId: deptData?.id ?? dept },
    include: { dept: true, detailSurat: true },
  })

  if (!register) return NextResponse.json({ error: "Tidak ditemukan" }, { status: 404 })
  return NextResponse.json(register)
}

export async function PATCH(req: Request, { params }: Params) {
  const { dept, id } = await params
  const body = await req.json()

  const result = await prisma.$transaction(async (tx) => {
    const existing = await tx.registerSurat.findFirst({
      where: { id: Number(id), deptId: dept },
      include: { detailSurat: true },
    })
    if (!existing) throw new Error("Register tidak ditemukan")

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
      const list = await tx.registerSurat.findMany({
        where: { deptId: targetDeptId },
        select: { nomor: true },
      })
      const max = list.reduce((acc, s) => {
        const n = parseInt(s.nomor, 10)
        return isNaN(n) ? acc : Math.max(acc, n)
      }, 0)
      nomor = String(max + 1).padStart(4, "0")
    }

    // Update data amplop
    const updated = await tx.registerSurat.update({
      where: { id: Number(id) },
      data: {
        nomor,
        deptId:        targetDeptId,
        asalSurat:     body.asalSurat     ?? existing.asalSurat,
        tujuan:        body.tujuan        ?? existing.tujuan,
        tanggalTerima: body.tanggalTerima ? new Date(body.tanggalTerima) : existing.tanggalTerima,
      },
    })

    // Update detail surat jika dikirim
    if (Array.isArray(body.suratList)) {
      // Hapus semua detail lama, buat ulang
      await tx.detailSurat.deleteMany({ where: { registerId: Number(id) } })
      await tx.detailSurat.createMany({
        data: body.suratList.map((s: any) => ({
          registerId:   Number(id),
          perihal:      s.perihal,
          noSurat:      s.noSurat  || null,
          lampiran:     s.lampiran || null,
          tanggalSurat: new Date(s.tanggalSurat),
        })),
      })
    }

    return tx.registerSurat.findUnique({
      where: { id: Number(id) },
      include: { dept: true, detailSurat: true },
    })
  })

  return NextResponse.json(result)
}

export async function DELETE(_: Request, { params }: Params) {
  const { id } = await params
  // detailSurat terhapus otomatis karena onDelete: Cascade
  await prisma.registerSurat.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}