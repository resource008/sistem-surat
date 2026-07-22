import { headers } from "next/headers"
import { auth } from "@/infrastructure/auth/better-auth"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import { getDefaultPermission } from "@/lib/permission"
import type { Role } from "@/types"
import type { UserPermissions } from "@/domain/user/types"

export type PermissionKey = keyof UserPermissions

type SessionUser = {
  id?: string
  role?: Role
}

export async function getCurrentSession() {
  return auth.api.getSession({ headers: await headers() })
}

export async function getUserPermissions(
  userId: string,
  role: Role,
): Promise<UserPermissions> {
  if (role === "ADMIN") return getDefaultPermission("ADMIN")

  const permissions = await prisma.userPermission.findUnique({
    where: { userId },
    select: {
      canCreate: true,
      canEdit: true,
      canDelete: true,
      canPrint: true,
      canTrack: true,
    },
  })

  if (!permissions) return getDefaultPermission(role)

  const rows = await prisma.$queryRaw<Array<{ canViewDataSurat: boolean }>>`
    SELECT can_view_data_surat AS "canViewDataSurat"
    FROM user_permissions
    WHERE "userId" = ${userId}
    LIMIT 1
  `

  return {
    canViewDataSurat: rows[0]?.canViewDataSurat ?? false,
    ...permissions,
  }
}

export async function requireUserPermission(permission: PermissionKey) {
  const session = await getCurrentSession()
  if (!session) throw new AppError(401, "Unauthorized")

  const user = session.user as SessionUser
  if (!user.id || !user.role) throw new AppError(401, "Unauthorized")
  if (user.role === "ADMIN") return session

  const permissions = await getUserPermissions(user.id, user.role)
  if (!permissions[permission]) {
    throw new AppError(403, "Permission sedang dinonaktifkan")
  }

  return session
}
