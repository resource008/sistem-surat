import { NextRequest, NextResponse } from "next/server"
import { UpdateDepartemenSchema } from "@/app/validation/departemen"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { deleteDepartemen, showDepartemen, updateDepartemen } from "@/services/departemen-service"

type RouteContext = { params: Promise<{ id: string }> }
type VisibilityAction = "show" | "hide"

function validationResponse(fieldErrors: Record<string, string[] | undefined>) {
  return NextResponse.json(
    {
      message: "Request tidak sesuai",
      errors: fieldErrors,
    },
    { status: 422 }
  )
}

function parseVisibilityAction(body: unknown): VisibilityAction | null {
  if (!body || typeof body !== "object" || !("action" in body)) return null

  const action = (body as { action?: unknown }).action
  return action === "show" || action === "hide" ? action : null
}

async function visibilityResponse(action: VisibilityAction, id: string) {
  if (action === "show") {
    await showDepartemen(id)
    return NextResponse.json({ message: "Departemen berhasil ditampilkan" })
  }

  await deleteDepartemen(id)
  return NextResponse.json({ message: "Departemen berhasil disembunyikan" })
}

async function updateDepartemenResponse(body: unknown, id: string) {
  if (!body) {
    return NextResponse.json({ message: "Body tidak valid" }, { status: 400 })
  }

  const parsed = UpdateDepartemenSchema.safeParse(body)
  if (!parsed.success) {
    return validationResponse(parsed.error.flatten().fieldErrors)
  }

  await updateDepartemen(id, parsed.data)
  return NextResponse.json({
    message: "Data departemen berhasil diperbarui",
  })
}

async function handleEditDepartemen(req: NextRequest, { params }: RouteContext, method: "PATCH" | "PUT") {
  try {
    await requireAdmin()
    const { id } = await params
    const decodedId = decodeURIComponent(id)

    if (method === "PATCH") {
      const queryAction = req.nextUrl.searchParams.get("action")

      if (queryAction) {
        return NextResponse.json(
          { message: "Action visibility harus dikirim melalui body request" },
          { status: 400 }
        )
      }

      const body = await req.json().catch(() => null)
      const visibilityAction = parseVisibilityAction(body)

      if (visibilityAction) {
        return await visibilityResponse(visibilityAction, decodedId)
      }

      return await updateDepartemenResponse(body, decodedId)
    }

    const body = await req.json().catch(() => null)
    return await updateDepartemenResponse(body, decodedId)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error(`${method} /api/admin/dept/[id]:`, error.message)
    return NextResponse.json({ message: "Gagal mengupdate departemen" }, { status: 500 })
  }
}

export async function editDepartemenPatch(req: NextRequest, context: RouteContext) {
  return handleEditDepartemen(req, context, "PATCH")
}

export async function editDepartemenPut(req: NextRequest, context: RouteContext) {
  return handleEditDepartemen(req, context, "PUT")
}
