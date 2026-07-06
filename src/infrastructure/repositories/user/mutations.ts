import { randomUUID } from "node:crypto"
import type {
  CreateUserInput,
  UpdateUserInput,
  User,
} from "@/domain/user/types"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { getDefaultPermission } from "@/lib/permission"
import type { Role } from "@/types"
import { mapUser, userSelect } from "./mapper"
import { hashPassword } from "./password"

export async function createUser(input: CreateUserInput): Promise<User> {
  const hashedPassword = await hashPassword(input.password)
  const permissions = {
    ...getDefaultPermission(input.role),
    ...input.permissions,
  }

  const user = await prisma.user.create({
    data: {
      id:            randomUUID(),
      name:          input.name,
      email:         input.email,
      username:      input.username,
      role:          input.role,
      permissions: {
        create: permissions,
      },
      accounts: {
        create: {
          id:         randomUUID(),
          accountId:  randomUUID(),
          providerId: "credential",
          password:   hashedPassword,
        },
      },
    },
    select: userSelect(),
  })

  return mapUser(user)
}

export async function updateUser(id: string, input: UpdateUserInput): Promise<User> {
  const { password, permissions, ...fields } = input

  const updateData = Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined)
  )
  const currentUser = permissions
    ? await prisma.user.findUnique({ where: { id }, select: { role: true } })
    : null
  const permissionBaseRole = (fields.role ?? currentUser?.role ?? "STAFF") as Role
  const permissionCreateData = permissions
    ? { ...getDefaultPermission(permissionBaseRole), ...permissions }
    : null

  const user = await prisma.user.update({
    where:  { id },
    data:   {
      ...updateData,
      ...(permissions && {
        permissions: {
          upsert: {
            create: {
              canCreate: permissionCreateData!.canCreate,
              canEdit:   permissionCreateData!.canEdit,
              canDelete: permissionCreateData!.canDelete,
              canPrint:  permissionCreateData!.canPrint,
              canTrack:  permissionCreateData!.canTrack,
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
    select: userSelect(),
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

export async function deleteUser(id: string): Promise<void> {
  await prisma.$transaction([
    prisma.account.deleteMany({ where: { userId: id } }),
    prisma.session.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ])
}
