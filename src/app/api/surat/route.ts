import { NextRequest, NextResponse }  from "next/server"
import { headers }                    from "next/headers"
import { auth }                       from "@/infrastructure/auth/better-auth"
import { fetchAllSurat, saveSurat }   from "@/services/surat-service"
import { CreateSuratSchema }          from "@/app/validation/surat"
import { AppError }                   from "@/lib/errors"
import { Prisma }                     from "@/generated/prisma"

const MAX_IDS = 100

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const type     = req.nextUrl.searchParams.get("type")
    const idsParam = req.nextUrl.searchParams.get("ids")
    const ids      = idsParam
      ?.split(",")
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0)
      .slice(0, MAX_IDS) ?? null

    const pageRaw  = req.nextUrl.searchParams.get("page")
    const limitRaw = req.nextUrl.searchParams.get("limit")
    const pagination = pageRaw
      ? { page: Number(pageRaw), limit: Number(limitRaw ?? 20) }
      : undefined

    // ✅ Baca parameter filter date dan dept dari URL
    const date = req.nextUrl.searchParams.get("date") ?? null
    const dept = req.nextUrl.searchParams.get("dept") ?? null
    const depts = dept ? dept.split(",").filter(Boolean) : null

    const data = await fetchAllSurat(type, ids, pagination, date, depts)
    return NextResponse.json(data)

  } catch (error) {
    if (error instanceof Error) console.error("GET /api/surat:", error.message)
    return NextResponse.json({ error: "Gagal mengambil data surat" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await req.json().catch(() => null)
    if (!body) return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })

    const result = CreateSuratSchema.safeParse(body)
    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors
      const firstError  = Object.values(fieldErrors).flat()[0]
                          ?? result.error.flatten().formErrors[0]
                          ?? "Data tidak valid"
      return NextResponse.json({ error: firstError }, { status: 422 })
    }

    const created = await saveSurat(result.data)
    return NextResponse.json(created, { status: 201 })

  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      const prismaErrors: Record<string, { message: string; status: number }> = {
        P2002: { message: "Nomor sudah ada",            status: 409 },
        P2003: { message: "Foreign key tidak valid",    status: 400 },
        P2025: { message: "Data tidak ditemukan",       status: 404 },
      }
      const matched = prismaErrors[error.code]
      if (matched) {
        return NextResponse.json({ error: matched.message }, { status: matched.status })
      }
    }
    if (error instanceof Error) console.error("POST /api/surat:", error.message)
    return NextResponse.json({ error: "Gagal menyimpan data" }, { status: 500 })
  }
}