import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { AppError } from "@/lib/errors"
import { auth } from "@/infrastructure/auth/better-auth"
import { fetchDepartemenById } from "@/services/departemen-service"
import type { Departemen, DepartemenColumn } from "@/types"
import type { ExtendedSession } from "@/types/auth"

type RouteContext = { params: Promise<{ id: string }> }

function stripColumnId(column: DepartemenColumn) {
  const nextColumn = { ...column } as Partial<DepartemenColumn>
  delete nextColumn.id
  return nextColumn
}

function stripColumnIds<T extends Departemen>(departemen: T) {
  return {
    ...departemen,
    columns: departemen.columns?.map(stripColumnId),
    displayColumns: departemen.displayColumns?.map(stripColumnId),
  }
}

export async function detailDepartemen(_req: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    }) as ExtendedSession | null

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const data = await fetchDepartemenById(decodeURIComponent(id))
    return NextResponse.json(stripColumnIds(data))
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("GET /api/admin/dept/[id]:", error.message)
    return NextResponse.json({ error: "Gagal mengambil departemen" }, { status: 500 })
  }
}
