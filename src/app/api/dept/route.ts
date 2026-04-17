// src/app/api/dept/route.ts
import { NextResponse } from "next/server"
import { prisma } from "@/infrastructure/databases/prisma-client"

export async function GET() {
  try {
    console.log("=== DEPT ROUTE HIT ===")
    console.log("Prisma instance:", prisma)
    console.log("Prisma department:", prisma.department)
    
    const data = await prisma.department.findMany({
      where: { isActive: true },
      select: {
        id:        true,
        shortName: true,
        tujuan:    true,
      },
      orderBy: { shortName: "asc" },
    })

    console.log("Data fetched:", data)
    return NextResponse.json(data)
  } catch (error) {
    console.error("DEPT ERROR name:", (error as any)?.name)
    console.error("DEPT ERROR message:", (error as any)?.message)
    console.error("DEPT ERROR stack:", (error as any)?.stack)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}