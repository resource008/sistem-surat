import { NextRequest, NextResponse } from "next/server"
import { UpdateDepartemenSchema } from "@/app/validation/departemen"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { deleteDepartemen, showDepartemen, updateDepartemen } from "@/services/departemen-service"

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

async function handleEditDepartemen(req: NextRequest, { params }: RouteContext, method: "PATCH" | "PUT") {
  try {
    await requireAdmin()
    const { id } = await params
    const decodedId = decodeURIComponent(id)

    if (method === "PATCH") {
      const action = req.nextUrl.searchParams.get("action")

      if (action === "show") {
        const departemen = await showDepartemen(decodedId)
        return NextResponse.json({ message: "Departemen berhasil ditampilkan", departemen })
      }

      if (action === "hide") {
        await deleteDepartemen(decodedId)
        return NextResponse.json({ message: "Departemen berhasil disembunyikan" })
      }
    }

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    const parsed = UpdateDepartemenSchema.safeParse(body)
    if (!parsed.success) {
      return validationResponse(parsed.error.flatten().fieldErrors)
    }

    await updateDepartemen(decodedId, parsed.data)
    return NextResponse.json({ message: "Data departemen berhasil diubah" })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error(`${method} /api/dept/[id]:`, error.message)
    return NextResponse.json({ error: "Gagal mengupdate departemen" }, { status: 500 })
  }
}

export async function editDepartemenPatch(req: NextRequest, context: RouteContext) {
  return handleEditDepartemen(req, context, "PATCH")
}

export async function editDepartemenPut(req: NextRequest, context: RouteContext) {
  return handleEditDepartemen(req, context, "PUT")
}
