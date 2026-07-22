import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/better-auth"
import { AppError } from "@/lib/errors"
import { userService } from "@/services/user-service"
import { UpdateProfileSchema } from "@/app/validation/user"

async function getCurrentSession() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new AppError(401, "Unauthorized")
  return session
}

export async function GET() {
  try {
    const session = await getCurrentSession()
    const userId = (session.user as any).id as string
    const user = await userService.getById(userId)

    return NextResponse.json(user)
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("GET /api/profile:", error)
    return NextResponse.json({ error: "Gagal mengambil data akun" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession()
    const userId = (session.user as any).id as string

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    const parsed = UpdateProfileSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors).flat()[0]
        ?? parsed.error.flatten().formErrors[0]
        ?? "Data tidak valid"

      return NextResponse.json({ error: firstError }, { status: 422 })
    }

    await userService.update(userId, parsed.data, userId)
    return NextResponse.json({ message: "Akun berhasil disimpan" })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("PATCH /api/profile:", error)
    return NextResponse.json({ error: "Gagal mengupdate akun" }, { status: 500 })
  }
}
