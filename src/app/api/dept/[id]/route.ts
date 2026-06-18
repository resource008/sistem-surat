import { NextRequest, NextResponse } from "next/server"
import { UpdateDepartemenSchema } from "@/app/validation/departemen"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { deleteDepartemen, fetchDepartemenById, updateDepartemen } from "@/services/departemen-service"

type RouteContext = { params: Promise<{ id: string }> }

function validationResponse(fieldErrors: Record<string, string[] | undefined>) {
  return NextResponse.json(
    {
      message: "Request tidak sesuai",
      errors: fieldErrors,
    },
    { status: 422 }
  )
}

export async function GET(_req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = await params

    const data = await fetchDepartemenById(decodeURIComponent(id))
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("GET /api/dept/[id]:", error.message)
    return NextResponse.json({ error: "Gagal mengambil departemen" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = await params

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    const parsed = UpdateDepartemenSchema.safeParse(body)
    if (!parsed.success) {
      return validationResponse(parsed.error.flatten().fieldErrors)
    }

    await updateDepartemen(decodeURIComponent(id), parsed.data)
    return NextResponse.json({ message: "Data departemen berhasil diubah" })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("PATCH /api/dept/[id]:", error.message)
    return NextResponse.json({ error: "Gagal mengupdate departemen" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    const { id } = await params

    await deleteDepartemen(decodeURIComponent(id))
    return NextResponse.json({ message: "Departemen berhasil dihapus" })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("DELETE /api/dept/[id]:", error.message)
    return NextResponse.json({ error: "Gagal menghapus departemen" }, { status: 500 })
  }
}
