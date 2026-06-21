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

const PrintSheetNameSchema = z
  .string({ error: "Identifikasi nama lembar wajib diisi" })
  .trim()
  .min(1, "Identifikasi nama lembar wajib diisi")
  .max(100, "Identifikasi nama lembar maksimal 100 karakter")

const ColumnSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, "Nama kolom wajib diisi").max(80, "Nama kolom maksimal 80 karakter").trim(),
  type: z.enum(["text", "date", "number"]),
  defaultValue: z.string().max(120, "Isian awal maksimal 120 karakter").optional().default(""),
  isDefault: z.boolean().optional().default(false),
  isRequired: z.boolean().optional().default(false),
  showInDataSurat: z.boolean().optional().default(false),
  showInPrint: z.boolean().optional().default(true),
  sortOrder: z.number().int().nonnegative().optional().default(0),
})

export const CreateDepartemenSchema = z.object({
  shortName:          ShortNameSchema,
  tujuan:             DepartmentNameSchema,
  printSheetName:    PrintSheetNameSchema,
  columnMode:         z.enum(["new", "existing"]).optional().default("new"),
  sourceDepartmentId: z.string().optional().default(""),
  columns:            z.array(ColumnSchema).optional().default([]),
}).superRefine((value, ctx) => {
  if (value.columnMode === "existing" && !value.sourceDepartmentId.trim()) {
    ctx.addIssue({
      code: "custom",
      message: "Pilih departemen sumber kolom",
      path: ["sourceDepartmentId"],
    })
  }

})

export const UpdateDepartemenSchema = CreateDepartemenSchema

export type CreateDepartemenInput = z.infer<typeof CreateDepartemenSchema>
export type UpdateDepartemenInput = z.infer<typeof UpdateDepartemenSchema>
