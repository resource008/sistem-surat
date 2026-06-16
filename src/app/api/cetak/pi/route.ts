import { NextResponse }       from "next/server"
import { prisma }             from "@/infrastructure/databases/prisma-client"
import { AppError }           from "@/lib/errors"
import { requireUserPermission } from "@/lib/current-user-permissions"

const MAX_IDS = 100

function toIso(value: unknown) {
  return value instanceof Date ? value.toISOString() : String(value)
}

function serializePI(row: Record<string, unknown>) {
  const dept = row.dept as Record<string, unknown> | undefined
  const deptShortName = String(dept?.shortName ?? row.deptId)

  return {
    id:            Number(row.id),
    nomor:         String(row.nomor),
    deptId:        String(row.deptId),
    tanggalTerima: toIso(row.tanggalTerima),
    asalSurat:     String(row.asalSurat ?? ""),
    dept: {
      id:        String(dept?.id ?? row.deptId),
      shortName: deptShortName,
    },
    detailPI: (row.detailPI as Record<string, unknown>[]).map((detail) => ({
      id:           Number(detail.id),
      namaSupplier: String(detail.namaSupplier ?? ""),
      noInvoice:    detail.noInvoice  === null || detail.noInvoice  === undefined ? null : String(detail.noInvoice),
      nomorSurat:   detail.nomorSurat === null || detail.nomorSurat === undefined ? null : String(detail.nomorSurat),
      tujuan:       deptShortName,
      cc:           detail.cc         === null || detail.cc         === undefined ? null : String(detail.cc),
      tanggalSurat: toIso(detail.tanggalSurat),
    })),
  }
}

export async function GET(req: Request) {
  try {
    await requireUserPermission("canPrint")

    const { searchParams } = new URL(req.url)
    const idsParam         = searchParams.get("ids")
    const ids              = idsParam
      ?.split(",")
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0)
      .slice(0, MAX_IDS)

    const data = await prisma.registerPI.findMany({
      where  : ids && ids.length > 0 ? { id: { in: ids } } : undefined,
      include: { dept: true, detailPI: true },
      orderBy: { nomor: "asc" },
    })

    return NextResponse.json(
      data.map((row) => serializePI(row as unknown as Record<string, unknown>))
    )
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    const message = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json({
      error : "Gagal mengambil data cetak PI",
      detail: process.env.NODE_ENV === "development" ? message : undefined,
    }, { status: 500 })
  }
}
