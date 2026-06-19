import { z } from "zod"

const CustomFieldsSchema = z.record(z.string(), z.string()).optional().default({})

const SuratItemSchema = z.object({
  perihal: z.string().optional().default(""),
  noSurat: z.string().nullable().optional(),
  lampiran: z.string().nullable().optional(),
  tujuan: z.string().nullable().optional(),
  tanggalSurat: z.string().optional().default(""),
  customFields: CustomFieldsSchema,
})

export const CreateSuratSchema = z.object({
  dept: z.string().min(1, "Departemen wajib diisi").optional(),
  deptId: z.string().min(1, "Departemen wajib diisi").optional(),
  asalSurat: z.string().min(1, "Asal surat wajib diisi"),
  tanggalTerima: z.string().min(1, "Tanggal terima wajib diisi"),
  tujuan: z.string().optional().default(""),
  suratList: z.array(SuratItemSchema).min(1, "Minimal 1 surat harus ada"),
}).superRefine((value, ctx) => {
  if (!value.dept && !value.deptId) {
    ctx.addIssue({
      code: "custom",
      message: "Departemen wajib diisi",
      path: ["dept"],
    })
  }
}).transform(({ dept, deptId, ...value }) => ({
  ...value,
  deptId: deptId ?? dept ?? "",
}))

export const UpdateSuratSchema = z.object({
  dept: z.string().min(1).optional(),
  deptId: z.string().min(1).optional(),
  asalSurat: z.string().min(1).optional(),
  tujuan: z.string().optional(),
  tanggalTerima: z.string().optional(),
  suratList: z.array(SuratItemSchema).min(1, "Minimal 1 surat harus ada"),
}).transform(({ dept, deptId, ...value }) => ({
  ...value,
  deptId: deptId ?? dept,
}))

export type CreateSuratInput = z.infer<typeof CreateSuratSchema>
export type UpdateSuratInput = z.infer<typeof UpdateSuratSchema>
