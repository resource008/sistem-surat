import { createRandomId } from "@/lib/random-id"

export type Role = "ADMIN" | "STAFF" | "PKL"

// ─── Surat ────────────────────────────────────────────────────────────────────

export interface DetailSurat {
  id:           number
  registerId:   number
  perihal:      string
  noSurat:      string | null
  lampiran:     string | null
  tujuan:       string | null
  tanggalSurat: string
}

export interface RegisterSurat {
  id:            number
  nomor:         string
  deptId:        string
  dept:          { id: string; shortName: string }
  asalSurat:     string
  tujuan:        string
  tanggalTerima: string
  detailSurat:   DetailSurat[]
}

export interface SuratItem {
  id:           string
  perihal:      string
  noSurat:      string
  lampiran:     string
  tanggalSurat: string
  tujuan:       string
}

export const EMPTY_SURAT_ITEM = (): SuratItem => ({
  id:           createRandomId(),
  perihal:      "",
  noSurat:      "",
  lampiran:     "",
  tanggalSurat: "",
  tujuan:       "",
})

// ─── PI ───────────────────────────────────────────────────────────────────────

export interface DetailPI {
  id:           number
  registerId:   number
  namaSupplier: string
  noInvoice:    string | null
  nomorSurat:   string | null
  tujuan:       string | null
  cc:           string | null
  tanggalSurat: string
}

export interface RegisterPI {
  id:            number
  nomor:         string
  deptId:        string
  dept:          { id: string; shortName: string }
  asalSurat:     string
  tanggalTerima: string
  detailPI:      DetailPI[]
}

export interface PIItem {
  id:           string
  namaSupplier: string
  noInvoice:    string
  nomorSurat:   string
  tujuan:       string
  cc:           string
  tanggalSurat: string
}

export const EMPTY_PI_ITEM = (): PIItem => ({
  id:           createRandomId(),
  namaSupplier: "",
  noInvoice:    "",
  nomorSurat:   "",
  tujuan:       "",
  cc:           "",
  tanggalSurat: "",
})

// ─── Form ─────────────────────────────────────────────────────────────────────

export interface FormState {
  deptId:        string
  asalSurat:     string
  tujuan:        string
  tanggalTerima: string
}

export const EMPTY_FORM: FormState = {
  deptId:        "",
  asalSurat:     "",
  tujuan:        "",
  tanggalTerima: new Date().toISOString().slice(0, 10),
}

// ─── Cetak ────────────────────────────────────────────────────────────────────

export interface CetakGroup {
  key       : string
  label     : string
  date      : string
  dept      : string
  registers : RegisterSurat[]
}
