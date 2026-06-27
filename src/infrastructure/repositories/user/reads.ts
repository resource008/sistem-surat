import type {
  GetUsersQuery,
  PaginatedUsers,
  User,
  UserRole,
} from "@/domain/user/types"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { mapUser, userSelect } from "./mapper"

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
            { username: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select:  userSelect(),
      skip,
      take:    limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ])

  return {
    data: users.map(mapUser),
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
  return user ? mapUser(user) : null
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where:  { email },
    select: userSelect(),
  })
  return user ? mapUser(user) : null
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const user = await prisma.user.findUnique({
    where:  { username },
    select: userSelect(),
  })
  return user ? mapUser(user) : null
}

export async function countUsersByRole(role: UserRole): Promise<number> {
  return prisma.user.count({ where: { role } })
}
