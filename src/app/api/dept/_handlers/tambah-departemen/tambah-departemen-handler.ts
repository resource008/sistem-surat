import { NextRequest, NextResponse } from "next/server"
import { CreateDepartemenSchema } from "@/app/validation/departemen"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { createDepartemen } from "@/services/departemen-service"

function validationResponse(fieldErrors: Record<string, string[] | undefined>) {
  return NextResponse.json(
    {
      message: "Request tidak sesuai",
      errors: fieldErrors,
    },
    { status: 422 }
  )
}

export async function tambahDepartemen(req: NextRequest) {
  try {
    await requireAdmin()

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    const parsed = CreateDepartemenSchema.safeParse(body)
    if (!parsed.success) {
      return validationResponse(parsed.error.flatten().fieldErrors)
    }

    const departemen = await createDepartemen(parsed.data)
    return NextResponse.json(
      {
        message: "Departemen berhasil ditambahkan",
        id: departemen.id,
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("POST /api/dept:", error.message)
    return NextResponse.json({ error: "Gagal membuat departemen" }, { status: 500 })
  }
}
