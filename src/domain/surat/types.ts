// src/domain/surat/types.ts
//
// Re-export tipe shared dari @/types agar tidak duplikat.
// Tipe khusus domain (payload, options) didefinisikan di sini.

export type {
  SuratItem,
  PIItem,
  FormState,
  RegisterSurat,
  RegisterPI,
} from "@/types"

// ─── Dept ─────────────────────────────────────────────────────────────────────

export interface DeptOption {
  id:        string
  shortName: string
  tujuan:    string
}

// ─── Create payload ───────────────────────────────────────────────────────────

export interface CreateSuratPayload {
  deptId:        string
  asalSurat:     string
  tanggalTerima: string
  tujuan:        string
  isPIDept:      boolean

  piList?: Array<{
    namaSupplier: string
    noInvoice?:   string | null
    nomorSurat?:  string | null
    tanggalSurat: string
    tujuan?:      string | null
    cc?:          string | null
  }>

  suratList?: Array<{
    perihal:      string
    noSurat?:     string | null
    lampiran?:    string | null
    tujuan?:      string | null
    tanggalSurat: string
  }>
}

export interface UpdateSuratPayload {
  asalSurat?:     string
  tujuan?:        string
  tanggalTerima?: string

  piList?: Array<{
    namaSupplier: string
    noInvoice?:   string | null
    nomorSurat?:  string | null
    tanggalSurat: string
    tujuan?:      string | null
    cc?:          string | null
  }>

  suratList?: Array<{
    perihal:      string
    noSurat?:     string | null
    lampiran?:    string | null
    tujuan?:      string | null
    tanggalSurat: string
  }>
}