// app/api/surat/[dept]/[id]/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

type Params = { params: Promise<{ dept: string; id: string }> }

export async function GET(_: Request, { params }: Params) {
  const { dept, id } = await params

  const surat = await prisma.dataSurat.findFirst({
    where: {
      id:     Number(id),
      deptId: dept,
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

    const deptBerubah = body.deptId && body.deptId !== existing.deptId

    let nomor = existing.nomor

    if (deptBerubah) {
      const counter = await tx.nomorCounter.upsert({
        where:  { deptId: body.deptId },
        update: { counter: { increment: 1 } },
        create: { deptId: body.deptId, counter: 1 },
      })

      const deptData = await tx.department.findUnique({ where: { id: body.deptId } })
      const year     = new Date().getFullYear()
      const bulan    = String(new Date().getMonth() + 1).padStart(2, "0")
      nomor = `${String(counter.counter).padStart(3, "0")}/${deptData!.shortName}/${bulan}/${year}`
    }

    const surat = await tx.dataSurat.update({
      where: { id: Number(id) },
      data: {
        nomor,
        deptId:        body.deptId        ?? existing.deptId,
        perihal:       body.perihal        ?? existing.perihal,
        asalSurat:     body.asalSurat      ?? existing.asalSurat,
        tujuan:        body.tujuan         ?? existing.tujuan,
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