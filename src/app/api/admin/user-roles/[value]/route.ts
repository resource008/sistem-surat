import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { toRoleValue } from "@/lib/role-value"
import { createRandomId } from "@/lib/random-id"

type RouteContext = { params: Promise<{ value: string }> }

const RoleBodySchema = z.object({
  name: z.string().min(2, "Nama role minimal 2 karakter").max(40, "Nama role maksimal 40 karakter"),
})

type RoleDefinitionRow = {
  id: string
  name: string
  value: string
  isSystem: boolean
  createdAt: Date
}

async function ensureRoleDefinitionTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "role_definitions" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "is_system" BOOLEAN NOT NULL DEFAULT false,
      "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "role_definitions_pkey" PRIMARY KEY ("id")
    )
  `)
  await prisma.$executeRawUnsafe(`
    CREATE UNIQUE INDEX IF NOT EXISTS "role_definitions_value_key"
    ON "role_definitions"("value")
  `)
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    await ensureRoleDefinitionTable()

    const { value } = await params
    const body = await req.json().catch(() => null)
    const parsed = RoleBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Request tidak sesuai", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const [current] = await prisma.$queryRaw<RoleDefinitionRow[]>`
      SELECT
        id,
        name,
        value,
        is_system AS "isSystem",
        created_at AS "createdAt"
      FROM role_definitions
      WHERE value = ${value}
      LIMIT 1
    `
    const currentUserCount = await prisma.user.count({ where: { role: value } })
    if (value === "ADMIN") {
      return NextResponse.json({ message: "Role Admin bawaan tidak bisa diubah" }, { status: 400 })
    }
    if (!current && currentUserCount === 0) {
      return NextResponse.json({ message: "Role tidak ditemukan" }, { status: 404 })
    }

    const nextValue = toRoleValue(parsed.data.name)
    if (!nextValue || nextValue === "ADMIN") {
      return NextResponse.json({ message: "Role tidak valid" }, { status: 400 })
    }

    await prisma.$transaction(async (tx) => {
      const [nextRole] = current
        ? await tx.$queryRaw<RoleDefinitionRow[]>`
            UPDATE role_definitions
            SET
              name = ${parsed.data.name.trim()},
              value = ${nextValue},
              is_system = false,
              updated_at = CURRENT_TIMESTAMP
            WHERE value = ${value}
            RETURNING
              id,
              name,
              value,
              is_system AS "isSystem",
              created_at AS "createdAt"
          `
        : await tx.$queryRaw<RoleDefinitionRow[]>`
            INSERT INTO role_definitions (id, name, value, is_system)
            VALUES (${createRandomId()}, ${parsed.data.name.trim()}, ${nextValue}, false)
            RETURNING
              id,
              name,
              value,
              is_system AS "isSystem",
              created_at AS "createdAt"
          `

      await tx.user.updateMany({
        where: { role: value },
        data: { role: nextValue },
      })

      return nextRole
    })

    return NextResponse.json({ message: "Role berhasil diubah" })
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ message: "Role sudah ada" }, { status: 409 })
    }
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    console.error("PATCH /api/admin/user-roles/[value]:", error)
    return NextResponse.json({ message: "Gagal mengubah role" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteContext) {
  try {
    await requireAdmin()
    await ensureRoleDefinitionTable()

    const { value } = await params
    if (value === "ADMIN") {
      return NextResponse.json({ message: "Role Admin bawaan tidak bisa dihapus" }, { status: 400 })
    }

    const [role] = await prisma.$queryRaw<RoleDefinitionRow[]>`
      SELECT
        id,
        name,
        value,
        is_system AS "isSystem",
        created_at AS "createdAt"
      FROM role_definitions
      WHERE value = ${value}
      LIMIT 1
    `
    const userCount = await prisma.user.count({ where: { role: value } })
    if (userCount > 0) {
      return NextResponse.json(
        { message: "Role masih digunakan pengguna" },
        { status: 400 }
      )
    }
    if (!role) return NextResponse.json({ message: "Role tidak ditemukan" }, { status: 404 })

    await prisma.$executeRaw`
      DELETE FROM role_definitions
      WHERE value = ${value}
    `
    return NextResponse.json({ message: "Role berhasil dihapus" })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    console.error("DELETE /api/admin/user-roles/[value]:", error)
    return NextResponse.json({ message: "Gagal menghapus role" }, { status: 500 })
  }
}
