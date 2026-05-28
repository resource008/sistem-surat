// src/app/validation/user.ts

import { z } from "zod"
import { RoleSchema } from "@/types/auth"

export const CreateUserSchema = z.object({
  name:     z.string().min(1, "Nama wajib diisi"),
  email:    z.string().email("Format email tidak valid"),
  username: z.string().min(5, "Username minimal 5 karakter"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role:     RoleSchema,
})

export type CreateUserInput = z.infer<typeof CreateUserSchema>