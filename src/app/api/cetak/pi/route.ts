import { NextResponse }       from "next/server"
import { prisma }             from "@/infrastructure/databases/prisma-client"
import { AppError }           from "@/lib/errors"
import { requireUserPermission } from "@/lib/current-user-permissions"

const MAX_IDS = 100

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

    return NextResponse.json(data)
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
