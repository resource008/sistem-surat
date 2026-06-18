import { createRandomId } from "@/lib/random-id"
import type { DepartemenColumn } from "./departemen"

export type Role = "ADMIN" | "STAFF" | "PKL"

export interface DetailSurat {
  id: number
  registerId: number
  perihal: string
  noSurat: string | null
  lampiran: string | null
  tujuan: string | null
  tanggalSurat: string
  customFields?: Record<string, string>
}

export interface RegisterSurat {
  id: number
  nomor: string
  deptId: string
  dept: {
    id: string
    shortName: string
    printColumnName?: string
    columns?: DepartemenColumn[]
    displayColumns?: DepartemenColumn[]
  }
  asalSurat: string
  tujuan: string
  tanggalTerima: string
  detailSurat: DetailSurat[]
}

export interface SuratItem {
  id: string
  perihal: string
  noSurat: string
  lampiran: string
  tanggalSurat: string
  tujuan: string
  customFields: Record<string, string>
}

export const EMPTY_SURAT_ITEM = (): SuratItem => ({
  id: createRandomId(),
  perihal: "",
  noSurat: "",
  lampiran: "",
  tanggalSurat: "",
  tujuan: "",
  customFields: {},
})

export interface FormState {
  deptId: string
  asalSurat: string
  tujuan: string
  tanggalTerima: string
}

export const EMPTY_FORM: FormState = {
  deptId: "",
  asalSurat: "",
  tujuan: "",
  tanggalTerima: new Date().toISOString().slice(0, 10),
}

export interface CetakGroup {
  key: string
  label: string
  date: string
  dept: string
  columns?: DepartemenColumn[]
  registers: RegisterSurat[]
}
