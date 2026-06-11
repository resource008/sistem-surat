import { z } from "zod"

const ShortNameSchema = z
  .string({ error: "Singkatan departemen wajib diisi" })
  .min(2, "Singkatan minimal 2 karakter")
  .max(20, "Singkatan maksimal 20 karakter")
  .regex(/^[A-Za-z0-9_-]+$/, "Singkatan hanya boleh huruf, angka, underscore, atau strip")
  .trim()
  .transform((value) => value.toUpperCase())

const DepartmentNameSchema = z
  .string({ error: "Nama departemen wajib diisi" })
  .min(2, "Nama departemen minimal 2 karakter")
  .max(100, "Nama departemen maksimal 100 karakter")
  .trim()

export const CreateDepartemenSchema = z.object({
  shortName: ShortNameSchema,
  tujuan:    DepartmentNameSchema,
})

export const UpdateDepartemenSchema = CreateDepartemenSchema

export type CreateDepartemenInput = z.infer<typeof CreateDepartemenSchema>
export type UpdateDepartemenInput = z.infer<typeof UpdateDepartemenSchema>
