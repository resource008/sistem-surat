import { z } from "zod"

// Shared 

const RoleSchema = z
  .string({ error: "Role wajib diisi" })
  .min(2, "Role minimal 2 karakter")
  .max(40, "Role maksimal 40 karakter")
  .regex(/^[A-Z0-9_]+$/, "Role hanya boleh huruf kapital, angka, dan underscore")

const PermissionSchema = z.object({
  canViewDataSurat: z.boolean().optional(),
  canCreate: z.boolean().optional(),
  canEdit:   z.boolean().optional(),
  canDelete: z.boolean().optional(),
  canPrint:  z.boolean().optional(),
  canTrack:  z.boolean().optional(),
})

// POST /api/admin/users

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

  role: RoleSchema,
  permissions: PermissionSchema.optional(),
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>

// PATCH /api/admin/users/[id]

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

    role:        RoleSchema.optional(),
    permissions: PermissionSchema.optional(),
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined),
    { message: "Minimal satu field harus diisi untuk update" }
  )

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>

// PATCH /api/profile

export const UpdateProfileSchema = z
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
  })
  .refine(
    (data) => Object.values(data).some((v) => v !== undefined && v !== ""),
    { message: "Minimal satu field harus diisi untuk update" }
  )

export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>

// GET /api/admin/users (query params)

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

  role: RoleSchema.optional(),
})

export type GetUsersQuery = z.infer<typeof GetUsersQuerySchema>
