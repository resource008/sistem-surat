import { NextResponse }  from "next/server"
import { prisma }        from "@/infrastructure/databases/prisma-client"
import { AppError }      from "@/lib/errors"
import { requireUserPermission } from "@/lib/current-user-permissions"

const MAX_IDS = 100

function toIso(value: unknown) {
  return value instanceof Date ? value.toISOString() : String(value)
}

function serializeSurat(row: Record<string, unknown>) {
  const dept = row.dept as Record<string, unknown> | undefined

  return {
    id:            Number(row.id),
    nomor:         String(row.nomor),
    deptId:        String(row.deptId),
    tanggalTerima: toIso(row.tanggalTerima),
    asalSurat:     String(row.asalSurat ?? ""),
    tujuan:        String(row.tujuan ?? ""),
    dept: {
      id:        String(dept?.id ?? row.deptId),
      shortName: String(dept?.shortName ?? row.deptId),
    },
    detailSurat: (row.detailSurat as Record<string, unknown>[]).map((detail) => ({
      id:           Number(detail.id),
      perihal:      String(detail.perihal ?? ""),
      noSurat:      detail.noSurat  === null || detail.noSurat  === undefined ? null : String(detail.noSurat),
      lampiran:     detail.lampiran === null || detail.lampiran === undefined ? null : String(detail.lampiran),
      tanggalSurat: toIso(detail.tanggalSurat),
      tujuan:       detail.tujuan === null || detail.tujuan === undefined ? null : String(detail.tujuan),
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

    const data = await prisma.registerSurat.findMany({
      where  : ids && ids.length > 0 ? { id: { in: ids } } : undefined,
      include: { dept: true, detailSurat: true },
      orderBy: { nomor: "asc" },
    })

    return NextResponse.json(
      data.map((row) => serializeSurat(row as unknown as Record<string, unknown>))
    )
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    const message = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json({
      error : "Gagal mengambil data cetak all",
      detail: process.env.NODE_ENV === "development" ? message : undefined,
    }, { status: 500 })
  }
}
