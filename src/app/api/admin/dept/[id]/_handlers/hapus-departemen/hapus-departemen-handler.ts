import { NextRequest, NextResponse } from "next/server"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { deleteDepartemen } from "@/services/departemen-service"

type RouteContext = { params: Promise<{ id: string }> }

export async function hapusDepartemen(_req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = await params

    await deleteDepartemen(decodeURIComponent(id))
    return NextResponse.json({ message: "Departemen berhasil dihapus" })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("DELETE /api/admin/dept/[id]:", error.message)
    return NextResponse.json({ error: "Gagal menghapus departemen" }, { status: 500 })
  }
}
