import { prisma }              from "@/infrastructure/databases/prisma-client"
import { scryptAsync }         from "@noble/hashes/scrypt.js"
import { randomBytes, bytesToHex } from "@noble/hashes/utils.js"
import type { UserRepository } from "@/domain/user/repositories"
import type {
  User,
  CreateUserInput,
  UpdateUserInput,
  GetUsersQuery,
  PaginatedUsers,
} from "@/domain/user/types"

// ── Field aman yang dikembalikan ke domain layer ──────────────

const USER_SELECT = {
  id:          true,
  name:        true,
  email:       true,
  username:    true,
  image:       true,  // ← tambah
  role:        true,
  createdAt:   true,
  updatedAt:   true,
  lastLoginAt: true,
  sessions: {
    select: { expiresAt: true },
    where:  { expiresAt: { gt: new Date() } },
  },
  permissions: {
    select: {
      canCreate: true,
      canEdit:   true,
      canDelete: true,
      canPrint:  true,
      canTrack:  true,
    },
  },
} as const

function mapUser(user: any): User {
  const now       = new Date()
  const lastLogin = user.lastLoginAt ?? null
  const isActive  = user.sessions?.some(
    (s: { expiresAt: Date }) => new Date(s.expiresAt) > now
  ) ?? false

  return {
    id:          user.id,
    name:        user.name,
    email:       user.email,
    username:    user.username,
    image:       user.image ?? null,  // ← tambah
    role:        user.role,
    createdAt:   user.createdAt,
    updatedAt:   user.updatedAt,
    lastLogin,
    status:      isActive ? "Sedang Aktif" : "Tidak Aktif",
    permissions: user.permissions ?? null,
  }
}

// ── Hash password dengan scrypt ───────────────────────────────

async function hashPassword(password: string): Promise<string> {
  const salt = bytesToHex(randomBytes(16))
  const key  = await scryptAsync(password.normalize("NFKC"), salt, {
    N:      16384,
    r:      16,
    p:      1,
    dkLen:  64,
    maxmem: 128 * 16384 * 16 * 2,
  })
  return `${salt}:${bytesToHex(key)}`
}

// ── Implementasi ──────────────────────────────────────────────

export class PrismaUserRepository implements UserRepository {

  async findAll(query: GetUsersQuery): Promise<PaginatedUsers> {
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
        select:  USER_SELECT,
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

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where:  { id },
      select: USER_SELECT,
    })
    if (!user) return null
    return mapUser(user)
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where:  { email },
      select: USER_SELECT,
    })
    if (!user) return null
    return mapUser(user)
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await prisma.user.findUnique({
      where:  { username },
      select: USER_SELECT,
    })
    if (!user) return null
    return mapUser(user)
  }

  async create(input: CreateUserInput): Promise<User> {
    const hashedPassword = await hashPassword(input.password)

    const user = await prisma.user.create({
      data: {
        id:            crypto.randomUUID(),
        name:          input.name,
        email:         input.email,
        username:      input.username,
        emailVerified: false,
        role:          input.role,
        accounts: {
          create: {
            id:         crypto.randomUUID(),
            accountId:  crypto.randomUUID(),
            providerId: "credential",
            password:   hashedPassword,
          },
        },
      },
      select: USER_SELECT,
    })

    return mapUser(user)
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const { password, permissions, ...fields } = input

    const updateData = Object.fromEntries(
      Object.entries(fields).filter(([, v]) => v !== undefined)
    )

    const user = await prisma.user.update({
      where:  { id },
      data:   {
        ...updateData,
        ...(permissions && {
          permissions: {
            upsert: {
              create: {
                canCreate: permissions.canCreate ?? false,
                canEdit:   permissions.canEdit   ?? false,
                canDelete: permissions.canDelete ?? false,
                canPrint:  permissions.canPrint  ?? false,
                canTrack:  permissions.canTrack  ?? false,
              },
              update: {
                canCreate: permissions.canCreate,
                canEdit:   permissions.canEdit,
                canDelete: permissions.canDelete,
                canPrint:  permissions.canPrint,
                canTrack:  permissions.canTrack,
              },
            },
          },
        }),
      },
      select: USER_SELECT,
    })

    if (password) {
      const hashedPassword = await hashPassword(password)
      await prisma.account.updateMany({
        where: { userId: id, providerId: "credential" },
        data:  { password: hashedPassword },
      })
    }

    return mapUser(user)
  }

  async delete(id: string): Promise<void> {
    await prisma.$transaction([
      prisma.account.deleteMany({ where: { userId: id } }),
      prisma.session.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ])
  }
}