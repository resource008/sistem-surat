import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import { requireAdmin } from "@/lib/require-admin"
import { toRoleValue } from "@/lib/role-value"
import { USER_ROLE_LABEL } from "@/constants/user"
import { createRandomId } from "@/lib/random-id"

const RoleBodySchema = z.object({
  name: z.string().min(2, "Nama role minimal 2 karakter").max(40, "Nama role maksimal 40 karakter"),
})

const INITIAL_ROLES = [
  { name: "Admin", value: "ADMIN", isSystem: true },
  { name: "Staff", value: "STAFF", isSystem: false },
  { name: "PKL", value: "PKL", isSystem: false },
]

type RoleDefinitionRow = {
  id: string
  name: string
  value: string
  isSystem: boolean
  createdAt: Date
}

function getRoleLabel(value: string) {
  return USER_ROLE_LABEL[value]
    ?? value
      .split("_")
      .filter(Boolean)
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ")
}

async function ensureInitialRoles() {
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

  const [{ count }] = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT COUNT(*)::bigint AS count FROM role_definitions
  `
  if (count > 0) return

  for (const role of INITIAL_ROLES) {
    await prisma.$executeRaw`
      INSERT INTO role_definitions (id, name, value, is_system)
      VALUES (${createRandomId()}, ${role.name}, ${role.value}, ${role.isSystem})
      ON CONFLICT (value) DO NOTHING
    `
  }
}

export async function GET() {
  try {
    await requireAdmin()
    await ensureInitialRoles()

    const roles = await prisma.$queryRaw<RoleDefinitionRow[]>`
      SELECT
        id,
        name,
        value,
        is_system AS "isSystem",
        created_at AS "createdAt"
      FROM role_definitions
      ORDER BY is_system DESC, created_at ASC
    `
    const groupedUsers = await prisma.user.groupBy({
      by: ["role"],
      _count: { role: true },
    })
    const countMap = new Map(groupedUsers.map((item) => [item.role, item._count.role]))
    const roleMap = new Map<string, {
      id: string
      name: string
      value: string
      isSystem: boolean
      userCount: number
      sortIndex: number
    }>()

    roles.forEach((role, index) => {
      roleMap.set(role.value, {
        id: role.id,
        name: role.name,
        value: role.value,
        isSystem: role.value === "ADMIN",
        userCount: countMap.get(role.value) ?? 0,
        sortIndex: role.value === "ADMIN" ? -1 : index,
      })
    })

    groupedUsers.forEach((item, index) => {
      if (roleMap.has(item.role)) return
      roleMap.set(item.role, {
        id: `user-role-${item.role}`,
        name: getRoleLabel(item.role),
        value: item.role,
        isSystem: item.role === "ADMIN",
        userCount: item._count.role,
        sortIndex: roles.length + index,
      })
    })

    return NextResponse.json({
      roles: Array.from(roleMap.values())
        .sort((a, b) => a.sortIndex - b.sortIndex || a.name.localeCompare(b.name))
        .map(({ sortIndex: _sortIndex, ...role }) => role),
    })
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    console.error("GET /api/admin/user-roles:", error)
    return NextResponse.json({ error: "Gagal mengambil role" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()

    const body = await req.json().catch(() => null)
    const parsed = RoleBodySchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Request tidak sesuai", errors: parsed.error.flatten().fieldErrors },
        { status: 422 }
      )
    }

    const value = toRoleValue(parsed.data.name)
    if (!value || value === "ADMIN") {
      return NextResponse.json({ message: "Role tidak valid" }, { status: 400 })
    }

    await prisma.$queryRaw<RoleDefinitionRow[]>`
      INSERT INTO role_definitions (id, name, value, is_system)
      VALUES (${createRandomId()}, ${parsed.data.name.trim()}, ${value}, false)
      RETURNING
        id,
        name,
        value,
        is_system AS "isSystem",
        created_at AS "createdAt"
    `

    return NextResponse.json({
      message: "Role berhasil ditambahkan",
    }, { status: 201 })
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json({ message: "Role sudah ada" }, { status: 409 })
    }
    if (error instanceof AppError) {
      return NextResponse.json({ message: error.message }, { status: error.status })
    }
    console.error("POST /api/admin/user-roles:", error)
    return NextResponse.json({ message: "Gagal menambahkan role" }, { status: 500 })
  }
}
