import { NextResponse } from "next/server"
import { prisma } from "@/infrastructure/databases/prisma-client"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const deptId = searchParams.get("deptId")
  if (!deptId) return NextResponse.json({ nomor: null })

  const dept = await prisma.department.findUnique({ where: { id: deptId } })
  if (!dept) return NextResponse.json({ nomor: null })

  const registerList = await prisma.registerSurat.findMany({
    where: { deptId },
    select: { nomor: true },
  })

  const max = registerList.reduce((acc, s) => {
    const n = parseInt(s.nomor, 10)
    return isNaN(n) ? acc : Math.max(acc, n)
  }, 0)

  return NextResponse.json({ nomor: String(max + 1).padStart(4, "0") })
}