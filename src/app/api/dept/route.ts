// src/app/api/dept/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/infrastructure/databases/prisma-client"

export async function GET() {
  try {
    const data = await prisma.department.findMany({
      where: { isActive: true },
      select: {
        id:        true,
        shortName: true,
        dataSurat: {
          select: { tujuan: true }
        },
      },
      orderBy: { shortName: "asc" },
    })

    return NextResponse.json(data)
  } catch (error) {
    console.error("Gagal mengambil data departemen:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}