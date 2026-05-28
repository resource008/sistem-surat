import { NextResponse }  from "next/server"
import { headers }       from "next/headers"
import { prisma }        from "@/infrastructure/databases/prisma-client"
import { auth }          from "@/infrastructure/auth/better-auth"
import { AppError }      from "@/lib/errors"
import type { ExtendedSession } from "@/types/auth"

const MAX_IDS = 100

export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    }) as ExtendedSession | null

    if (!session) {
      throw new AppError(401, "Unauthorized")
    }

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

    return NextResponse.json(data)
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