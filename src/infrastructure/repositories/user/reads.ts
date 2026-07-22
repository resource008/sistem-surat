import type {
  GetUsersQuery,
  PaginatedUsers,
  User,
  UserRole,
} from "@/domain/user/types"
import { Prisma } from "@/generated/prisma"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { mapUser, userSelect } from "./mapper"

async function loadDataSuratPermission(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, boolean>()

  const rows = await prisma.$queryRaw<Array<{ userId: string; canViewDataSurat: boolean }>>`
    SELECT "userId" AS "userId",
           can_view_data_surat AS "canViewDataSurat"
    FROM user_permissions
    WHERE "userId" IN (${Prisma.join(userIds)})
  `

  return new Map(rows.map((row) => [row.userId, row.canViewDataSurat]))
}

function withDataSuratPermission<T extends { id: string; permissions: Record<string, unknown> | null }>(
  user: T,
  values: Map<string, boolean>,
) {
  if (!user.permissions) return user

  return {
    ...user,
    permissions: {
      ...user.permissions,
      canViewDataSurat: values.get(user.id) ?? false,
    },
  }
}

function sortOnlineUsersFirst(a: User, b: User) {
  if (a.status !== b.status) {
    return a.status === "Online" ? -1 : 1
  }

  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}

export async function findAllUsers(query: GetUsersQuery): Promise<PaginatedUsers> {
  const { page, limit, search, role } = query
  const skip = (page - 1) * limit

  const where = {
    ...(role ? { role } : {}),
    ...(search
      ? {
          OR: [
            { name:     { contains: search, mode: "insensitive" as const } },
            { email:    { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select:  userSelect(),
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ])

  const dataSuratPermissions = await loadDataSuratPermission(users.map((user) => user.id))
  const sortedUsers = users
    .map((user) => mapUser(withDataSuratPermission(user, dataSuratPermissions)))
    .sort(sortOnlineUsersFirst)

  return {
    data: sortedUsers.slice(skip, skip + limit),
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function findUserById(id: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where:  { id },
    select: userSelect(),
  })
  if (!user) return null

  const dataSuratPermissions = await loadDataSuratPermission([user.id])
  return mapUser(withDataSuratPermission(user, dataSuratPermissions))
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where:  { email },
    select: userSelect(),
  })
  if (!user) return null

  const dataSuratPermissions = await loadDataSuratPermission([user.id])
  return mapUser(withDataSuratPermission(user, dataSuratPermissions))
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where:  { username },
    select: userSelect(),
  })
  if (!user) return null

  const dataSuratPermissions = await loadDataSuratPermission([user.id])
  return mapUser(withDataSuratPermission(user, dataSuratPermissions))
}

export async function countUsersByRole(role: UserRole): Promise<number> {
  return prisma.user.count({ where: { role } })
}
