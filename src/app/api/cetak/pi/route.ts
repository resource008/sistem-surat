// src/app/api/cetak/pi/route.ts

import { prisma } from "@/infrastructure/databases/prisma-client"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const idsParam         = searchParams.get("ids")
    const ids              = idsParam?.split(",").map(Number).filter(Boolean)

    const data = await prisma.registerSurat.findMany({
      where  : ids && ids.length > 0 ? { id: { in: ids } } : undefined,
      include: { dept: true, detailPI: true },
      orderBy: { nomor: "asc" },
    })

    return NextResponse.json(data)
  } catch (error: unknown) {
    return NextResponse.json({
      error : "Gagal mengambil data cetak PI",
      detail: process.env.NODE_ENV === "development"
        ? (error as Error).message
        : undefined,
    }, { status: 500 })
  }
}