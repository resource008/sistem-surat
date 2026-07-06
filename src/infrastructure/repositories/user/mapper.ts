import type { User } from "@/domain/user/types"

export function userSelect() {
  return {
    id:          true,
    name:        true,
    email:       true,
    username:    true,
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
}

export function mapUser(user: any): User {
  const now = new Date()
  const lastLogin = user.lastLoginAt ?? null
  const isActive = user.sessions?.some(
    (session: { expiresAt: Date }) => new Date(session.expiresAt) > now
  ) ?? false

  return {
    id:          user.id,
    name:        user.name,
    email:       user.email,
    username:    user.username,
    role:        user.role,
    createdAt:   user.createdAt,
    updatedAt:   user.updatedAt,
    lastLogin,
    status:      isActive ? "Sedang Aktif" : "Tidak Aktif",
    permissions: user.permissions ?? null,
  }
}
