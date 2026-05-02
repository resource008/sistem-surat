export type Role = "ADMIN" | "STAFF" | "PKL"

export interface DetailSurat {
  id:           number
  registerId:   number
  perihal:      string
  noSurat:      string | null
  lampiran:     string | null
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

export interface FormState {
  deptId:        string
  asalSurat:     string
  tujuan:        string
  tanggalTerima: string
}

export interface SuratItem {
  id:           string
  perihal:      string
  noSurat:      string
  lampiran:     string
  tanggalSurat: string
}

export const EMPTY_FORM: FormState = {
  deptId:        "",
  asalSurat:     "",
  tujuan:        "",
  tanggalTerima: new Date().toISOString().slice(0, 10),
}

export const EMPTY_SURAT_ITEM = (): SuratItem => ({
  id:           crypto.randomUUID(),
  perihal:      "",
  noSurat:      "",
  lampiran:     "",
  tanggalSurat: "",
})

export interface DetailSurat {
  id:           number
  perihal:      string
  noSurat:      string | null
  lampiran:     string | null
  tanggalSurat: string
}

export interface RegisterSurat {
  id:            number
  nomor:         string
  deptId:        string
  tanggalTerima: string
  asalSurat:     string
  tujuan:        string
  dept:          { id: string; shortName: string }
  detailSurat:   DetailSurat[]
}

// src/types/surat.types.ts — tambahkan field label

export interface CetakGroup {
  key       : string
  label     : string        // ✅ tambah ini
  date      : string
  dept      : string
  registers : RegisterSurat[]
}

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
  id:           crypto.randomUUID(),
  namaSupplier: "",
  noInvoice:    "",
  nomorSurat:   "",
  tujuan:       "",
  cc:           "",
  tanggalSurat: "",
})