// ============================================================
// src/lib/require-admin.ts
// Helper: validasi session & pastikan user adalah ADMIN
// ============================================================

import { auth }      from "@/infrastructure/auth/better-auth"
import { headers }   from "next/headers"
import { AppError }  from "@/lib/errors"
import { RoleSchema } from "@/types/auth"

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) throw new AppError(401, "Unauthorized")

  const parsed = RoleSchema.safeParse((session.user as any).role)
  if (!parsed.success || parsed.data !== "ADMIN") {
    throw new AppError(403, "Forbidden: hanya ADMIN yang diizinkan")
  }

  return session
}