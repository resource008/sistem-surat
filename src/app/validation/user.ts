// ============================================================
// src/app/validation/user.ts
// ============================================================

import { z } from "zod"

// ── Shared ────────────────────────────────────────────────────

const RoleEnum = z.enum(["ADMIN", "STAFF", "PKL"] as const, {
  error: "Role harus ADMIN, STAFF, atau PKL",
})

const PermissionSchema = z.object({
  canCreate: z.boolean().optional(),
  canEdit:   z.boolean().optional(),
  canDelete: z.boolean().optional(),
  canPrint:  z.boolean().optional(),
  canTrack:  z.boolean().optional(),
})

// ── POST /api/users ───────────────────────────────────────────

export const CreateUserSchema = z.object({
  name: z
    .string({ error: "Nama wajib diisi" })
    .min(2,   "Nama minimal 2 karakter")
    .max(100, "Nama maksimal 100 karakter")
    .trim(),

  email: z
    .string({ error: "Email wajib diisi" })
    .email("Format email tidak valid")
    .toLowerCase()
    .trim(),

  username: z
    .string({ error: "Username wajib diisi" })
    .min(3,  "Username minimal 3 karakter")
    .max(30, "Username maksimal 30 karakter")
    .regex(/^[a-z0-9_]+$/, "Username hanya boleh huruf kecil, angka, dan underscore")
    .trim(),

  password: z
    .string({ error: "Password wajib diisi" })
    .min(8,  "Password minimal 8 karakter")
    .max(72, "Password maksimal 72 karakter"),

  role: RoleEnum,
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>

// ── PATCH /api/users/[id] ─────────────────────────────────────

export const UpdateUserSchema = z
  .object({
    name: z
      .string()
      .min(2,   "Nama minimal 2 karakter")
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
      .min(3,  "Username minimal 3 karakter")
      .max(30, "Username maksimal 30 karakter")
      .regex(/^[a-z0-9_]+$/, "Username hanya boleh huruf kecil, angka, dan underscore")
      .trim()
      .optional(),

    password: z
      .string()
      .min(8,  "Password minimal 8 karakter")
      .max(72, "Password maksimal 72 karakter")
      .optional(),

    role:        RoleEnum.optional(),
    permissions: PermissionSchema.optional(),  // ← fix: 'permission' → 'permissions'
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: "Minimal satu field harus diisi untuk update" }
  )

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>

// ── GET /api/users (query params) ────────────────────────────

export const GetUsersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1))
    .pipe(z.number().int().min(1, "Page minimal 1")),

  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 10))
    .pipe(z.number().int().min(1).max(100)),

  search: z
    .string()
    .max(100, "Search maksimal 100 karakter")
    .trim()
    .optional(),

  role: RoleEnum.optional(),
})

export type GetUsersQuery = z.infer<typeof GetUsersQuerySchema>