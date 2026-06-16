// src/domain/surat/entities.ts
//
// Business rules & pure factory functions.
// Tidak ada dependency ke Prisma, fetch, atau framework apapun.

import type { PIItem, SuratItem } from "@/types"
import { createRandomId } from "@/lib/random-id"

// ─── Business rules ───────────────────────────────────────────────────────────

/** Satu-satunya tempat yang mendefinisikan departemen mana yang dianggap PI */
export const isPIDept = (shortName: string): boolean => shortName === "PI"

// ─── Empty item factories ─────────────────────────────────────────────────────

export const emptyPIItem = (tujuanDef?: string): PIItem => ({
  id:           createRandomId(),
  namaSupplier: "",
  noInvoice:    "",
  nomorSurat:   "",
  tujuan:       tujuanDef ?? "",
  cc:           "",
  tanggalSurat: "",
})

export const emptySuratItem = (tujuanDef?: string): SuratItem => ({
  id:           createRandomId(),
  perihal:      "",
  noSurat:      "",
  lampiran:     "",
  tujuan:       tujuanDef ?? "",
  tanggalSurat: "",
})

// ─── Apply tujuan ─────────────────────────────────────────────────────────────

export const applyTujuanToPIList = (list: PIItem[], tujuan: string): PIItem[] =>
  list.map((item) => ({ ...item, tujuan }))

export const applyTujuanToSuratList = (list: SuratItem[], tujuan: string): SuratItem[] =>
  list.map((item) => ({ ...item, tujuan }))
