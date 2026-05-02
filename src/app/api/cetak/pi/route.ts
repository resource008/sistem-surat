import { NextResponse } from "next/server"
import { prisma }       from "@/infrastructure/databases/prisma-client"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const idsParam         = searchParams.get("ids")
    const ids              = idsParam?.split(",").map(Number).filter(Boolean)

    const data = await prisma.registerPI.findMany({
      where  : ids && ids.length > 0 ? { id: { in: ids } } : undefined,
      include: { dept: true, detailPI: true },
      orderBy: { nomor: "asc" },
    })

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({
      error : "Gagal mengambil data cetak PI",
      detail: process.env.NODE_ENV === "development" ? error.message : undefined,
    }, { status: 500 })
  }
}