// src/validations/surat.ts
//
// Zod schemas untuk validasi body di API routes.
// Hanya dipakai di server (API routes) — tidak dikirim ke browser.

import { z } from "zod"

// ─── Shared item schemas ──────────────────────────────────────────────────────

const PIItemSchema = z.object({
  namaSupplier: z.string().min(1, "Nama supplier wajib diisi"),
  noInvoice:    z.string().nullable().optional(),
  nomorSurat:   z.string().nullable().optional(),
  tujuan:       z.string().nullable().optional(),
  cc:           z.string().nullable().optional(),
  tanggalSurat: z.string().min(1, "Tanggal surat wajib diisi"),
})

const SuratItemSchema = z.object({
  perihal:      z.string().min(1, "Perihal wajib diisi"),
  noSurat:      z.string().nullable().optional(),
  lampiran:     z.string().nullable().optional(),
  tujuan:       z.string().nullable().optional(),
  tanggalSurat: z.string().min(1, "Tanggal surat wajib diisi"),
})

// ─── POST /api/surat ──────────────────────────────────────────────────────────

export const CreateSuratSchema = z.object({
  deptId:        z.string().min(1, "Departemen wajib diisi"),
  asalSurat:     z.string().min(1, "Asal surat wajib diisi"),
  tanggalTerima: z.string().min(1, "Tanggal terima wajib diisi"),
  tujuan:        z.string().optional().default(""),
  isPIDept:      z.boolean(),
  piList:        z.array(PIItemSchema).optional(),
  suratList:     z.array(SuratItemSchema).optional(),
}).refine(
  (data) => {
    if (data.isPIDept) return (data.piList?.length ?? 0) > 0
    return (data.suratList?.length ?? 0) > 0
  },
  {
    message: "Minimal 1 item harus ada",
    path:    ["piList"],
  }
)

// ─── PATCH /api/surat/[dept]/[id] ────────────────────────────────────────────

export const UpdatePISchema = z.object({
  deptId:        z.string().min(1).optional(),  // ← tambah
  asalSurat:     z.string().min(1).optional(),
  tanggalTerima: z.string().optional(),
  piList:        z.array(PIItemSchema).min(1, "Minimal 1 invoice harus ada"),
})

export const UpdateSuratSchema = z.object({
  deptId:        z.string().min(1).optional(),  // ← tambah
  asalSurat:     z.string().min(1).optional(),
  tujuan:        z.string().optional(),
  tanggalTerima: z.string().optional(),
  suratList:     z.array(SuratItemSchema).min(1, "Minimal 1 surat harus ada"),
})

// ─── Inferred types ───────────────────────────────────────────────────────────

export type CreateSuratInput = z.infer<typeof CreateSuratSchema>
export type UpdatePIInput    = z.infer<typeof UpdatePISchema>
export type UpdateSuratInput = z.infer<typeof UpdateSuratSchema>