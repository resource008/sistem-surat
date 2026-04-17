import { NextResponse } from "next/server"
import { prisma } from "@/infrastructure/databases/prisma-client"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const deptId = searchParams.get("deptId")
  if (!deptId) return NextResponse.json({ nomor: null })

  const dept = await prisma.department.findUnique({ where: { id: deptId } })
  if (!dept) return NextResponse.json({ nomor: null })

  const lastRegister = await prisma.registerSurat.findFirst({
    where: { deptId },
    orderBy: { nomor: "desc" },
    select: { nomor: true },
  })

  const lastNumber = lastRegister ? parseInt(lastRegister.nomor, 10) : 0
  const nomor = String(lastNumber + 1).padStart(4, "0")

  return NextResponse.json({ nomor })
}