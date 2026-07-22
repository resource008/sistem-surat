import { NextRequest, NextResponse }  from "next/server"
import { fetchAllSurat, saveSurat }   from "@/services/surat-service"
import { CreateSuratSchema }          from "@/app/validation/surat"
import { AppError }                   from "@/lib/errors"
import { Prisma }                     from "@/generated/prisma"
import { requireUserPermission }      from "@/lib/current-user-permissions"

const MAX_IDS = 100
const DEFAULT_LIMIT = 20
const MAX_LIMIT = 50

function parseIds(idsParam: string | null) {
  if (!idsParam?.trim()) return null

  const parts = idsParam.split(",").map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return null

  const ids = parts.map((part) => Number(part))
  const hasInvalidId = parts.some((part, index) => !/^\d+$/.test(part) || !Number.isInteger(ids[index]) || ids[index] <= 0)

  if (hasInvalidId) {
    throw new AppError(400, "Parameter ids tidak valid")
  }

  return ids.slice(0, MAX_IDS)
}

function parsePositiveInt(value: string | null, fallback: number) {
  if (!value?.trim()) return fallback

  const parsed = Number(value)
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new AppError(400, "Parameter pagination tidak valid")
  }

  return parsed
}

export async function GET(req: NextRequest) {
  try {
    await requireUserPermission("canViewDataSurat")

    const type     = req.nextUrl.searchParams.get("type")
    const idsParam = req.nextUrl.searchParams.get("ids")
    const ids      = parseIds(idsParam)

    const pageRaw  = req.nextUrl.searchParams.get("page")
    const limitRaw = req.nextUrl.searchParams.get("limit")
    const pagination = ids
      ? undefined
      : {
          page: parsePositiveInt(pageRaw, 1),
          limit: Math.min(parsePositiveInt(limitRaw, DEFAULT_LIMIT), MAX_LIMIT),
        }

    // Baca parameter filter date dan dept dari URL
    const date = req.nextUrl.searchParams.get("date") ?? null
    const dept = req.nextUrl.searchParams.get("dept") ?? null
    const depts = dept ? dept.split(",").filter(Boolean) : null
    const search = req.nextUrl.searchParams.get("search") ?? null
    const column = req.nextUrl.searchParams.get("column") ?? null

    const data = await fetchAllSurat(type, ids, pagination, date, depts, search, column)
    return NextResponse.json(data)

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Error) console.error("GET /api/surat:", error.message)
    return NextResponse.json({ error: "Gagal mengambil data surat" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireUserPermission("canCreate")

    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ message: "Body tidak valid" }, { status: 400 })

    const result = CreateSuratSchema.safeParse(body)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const firstError  = Object.values(fieldErrors).flat()[0]
                          ?? result.error.flatten().formErrors[0]
                          ?? "Data tidak valid"
      return NextResponse.json({ message: firstError }, { status: 422 })
    }

    await saveSurat(result.data)
    return NextResponse.json(
      {
        message: "Data surat berhasil ditambahkan",
      },
      { status: 201 }
    )

    } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaErrors: Record<string, { message: string; status: number }> = {
        P2002: { message: "Nomor sudah ada",            status: 409 },
        P2003: { message: "Foreign key tidak valid",    status: 400 },
        P2025: { message: "Data tidak ditemukan",       status: 404 },
      }
      const matched = prismaErrors[error.code]
      if (matched) {
        return NextResponse.json({ message: matched.message }, { status: matched.status })
      }
    }
    if (error instanceof Error) {
      console.error("POST /api/surat:", error.message)
      if (
        error.message.toLowerCase().includes("departemen") &&
        error.message.toLowerCase().includes("tidak ditemukan")
      ) {
        return NextResponse.json(
          { message: "Departemen tidak ditemukan. Hubungi administrator untuk menambahkannya." },
          { status: 404 }
        )
      }

      if (process.env.NODE_ENV === "development") {
        return NextResponse.json({ message: error.message }, { status: 500 })
      }
    }
    return NextResponse.json({ message: "Gagal menyimpan data" }, { status: 500 })
  }
}
