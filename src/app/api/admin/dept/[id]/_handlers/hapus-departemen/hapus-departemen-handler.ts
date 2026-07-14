import { NextRequest, NextResponse } from "next/server"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { hardDeleteDepartemen } from "@/services/departemen-service"

type RouteContext = { params: Promise<{ id: string }> }

export async function hapusDepartemen(req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = await params
    const action = req.nextUrl.searchParams.get("action")

    if (action) {
      return NextResponse.json(
        { error: "Endpoint hapus departemen tidak menerima action visibility" },
        { status: 400 }
      )
    }

    await hardDeleteDepartemen(decodeURIComponent(id))
    return NextResponse.json({ message: "Departemen berhasil dihapus permanen" })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("DELETE /api/admin/dept/[id]:", error.message)
    return NextResponse.json({ error: "Gagal menghapus departemen" }, { status: 500 })
  }
}
