import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { AppError } from "@/lib/errors"
import { getCurrentSession, getUserPermissions } from "@/lib/current-user-permissions"
import { userService } from "@/services/user-service"
import type { Role } from "@/types"

const AccountUpdateSchema = z
  .object({
    name: z
      .string()
      .min(2, "Nama minimal 2 karakter")
      .max(100, "Nama maksimal 100 karakter")
      .trim()
      .optional(),
    email: z
      .string()
      .email("Format email tidak valid")
      .toLowerCase()
      .trim()
      .optional(),
    username: z
      .string()
      .min(3, "Username minimal 3 karakter")
      .max(30, "Username maksimal 30 karakter")
      .regex(/^[a-z0-9_]+$/, "Username hanya boleh huruf kecil, angka, dan underscore")
      .trim()
      .optional(),
  })
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    { message: "Minimal satu field harus diisi untuk update" }
  )

function getSessionUser(
  session: Awaited<ReturnType<typeof getCurrentSession>>
): { id: string; role: Extract<Role, "STAFF" | "PKL"> } {
  const user = session?.user as { id?: string; role?: Role } | undefined
  if (!user?.id || !user.role) throw new AppError(401, "Unauthorized")
  if (user.role !== "STAFF" && user.role !== "PKL") {
    throw new AppError(403, "Halaman akun hanya untuk Staff dan PKL")
  }
  return { id: user.id, role: user.role }
}

export async function GET() {
  try {
    const session = await getCurrentSession()
    const currentUser = getSessionUser(session)
    const user = await userService.getById(currentUser.id)
    const permissions = await getUserPermissions(currentUser.id, currentUser.role)

    return NextResponse.json({ ...user, permissions })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("GET /api/me/account:", error)
    return NextResponse.json({ error: "Gagal mengambil data akun" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getCurrentSession()
    const currentUser = getSessionUser(session)

    const body = await req.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Body tidak valid" }, { status: 400 })
    }

    const parsed = AccountUpdateSchema.safeParse(body)
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      const firstError = Object.values(fieldErrors).flat()[0]
        ?? parsed.error.flatten().formErrors[0]
        ?? "Data tidak valid"

      return NextResponse.json({ error: firstError }, { status: 422 })
    }

    const user = await userService.update(
      currentUser.id,
      parsed.data,
      currentUser.id
    )
    const permissions = await getUserPermissions(currentUser.id, currentUser.role)

    return NextResponse.json({ ...user, permissions })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    console.error("PATCH /api/me/account:", error)
    return NextResponse.json({ error: "Gagal menyimpan akun" }, { status: 500 })
  }
}
