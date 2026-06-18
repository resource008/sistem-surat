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
  deptId: z.string().min(1, "Departemen wajib diisi"),
  asalSurat: z.string().min(1, "Asal surat wajib diisi"),
  tanggalTerima: z.string().min(1, "Tanggal terima wajib diisi"),
  tujuan: z.string().optional().default(""),
  suratList: z.array(SuratItemSchema).min(1, "Minimal 1 surat harus ada"),
})

export const UpdateSuratSchema = z.object({
  deptId: z.string().min(1).optional(),
  asalSurat: z.string().min(1).optional(),
  tujuan: z.string().optional(),
  tanggalTerima: z.string().optional(),
  suratList: z.array(SuratItemSchema).min(1, "Minimal 1 surat harus ada"),
})

export type CreateSuratInput = z.infer<typeof CreateSuratSchema>
export type UpdateSuratInput = z.infer<typeof UpdateSuratSchema>
