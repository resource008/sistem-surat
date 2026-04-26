// src/app/api/surat/preview-nomor/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/infrastructure/databases/prisma-client"

const PI_DEPT_ID = "PI"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const deptId = searchParams.get("deptId")

    if (!deptId) {
      return NextResponse.json({ nomor: null }, { status: 400 })
    }

    const dept = await prisma.department.findUnique({
      where: { id: deptId },
    })

    if (!dept) {
      return NextResponse.json({ nomor: null, error: `Department '${deptId}' tidak ditemukan` }, { status: 404 })
    }

    let lastNumber = 0

    if (deptId === PI_DEPT_ID) {
      const last = await prisma.registerPI.findFirst({
        where: { deptId },
        orderBy: { nomor: "desc" },
        select: { nomor: true },
      })
      lastNumber = last ? parseInt(last.nomor, 10) : 0
    } else {
      const last = await prisma.registerSurat.findFirst({
        where: { deptId },
        orderBy: { nomor: "desc" },
        select: { nomor: true },
      })
      lastNumber = last ? parseInt(last.nomor, 10) : 0
    }

    const nomor = String(lastNumber + 1).padStart(4, "0")
    return NextResponse.json({ nomor })

  } catch (error: any) {
    console.error("❌ preview-nomor error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}