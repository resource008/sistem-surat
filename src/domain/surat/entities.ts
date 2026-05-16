// domain/surat/entities.ts

import { PIItem, SuratItem } from "./types"

const generateId = () => crypto.randomUUID()

// ✅ Aturan Bisnis: Pengecekan eksak agar aman (misal ada departemen "PIMPINAN")
export const isPIDept = (deptId: string): boolean => {
  return deptId === "PI"
}

export const emptyPIItem = (tujuanDef?: string): PIItem => ({
  id: generateId(),
  namaSupplier: "",
  noInvoice: "",
  nomorSurat: "",
  tujuan: tujuanDef || "",
  cc: "",
  tanggalSurat: ""
})

export const emptySuratItem = (tujuanDef?: string): SuratItem => ({
  id: generateId(),
  perihal: "",
  noSurat: "",
  lampiran: "",
  tujuan: tujuanDef || "",
  tanggalSurat: ""
})