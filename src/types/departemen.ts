import {
  ASAL_DEFAULT_ID,
  NOMOR_DEFAULT_ID,
  TANGGAL_DEFAULT_ID,
  TUJUAN_DEFAULT_ID,
} from "@/constants/departemen-columns"

export interface Departemen {
  id: string
  shortName: string
  tujuan: string
  isActive?: boolean
  fullName?: string
  printSheetName?: string
  columns?: DepartemenColumn[]
  displayColumns?: DepartemenColumn[]
}

export type DepartemenColumnType = "text" | "date" | "number"
export type DepartemenColumnMode = "new" | "existing"
export type DepartemenPrintSheetMode = "new" | "existing"

export interface DepartemenColumn {
  id: string
  label: string
  type: DepartemenColumnType
  defaultValue: string
  isDefault: boolean
  isRequired: boolean
  showInDataSurat: boolean
  showInPrint: boolean
  sortOrder: number
}

export type DepartemenFormState = {
  tujuan: string
  shortName: string
  printSheetName: string
  printSheetMode: DepartemenPrintSheetMode
  columnMode: DepartemenColumnMode
  sourceDepartmentId: string
  columns: DepartemenColumn[]
}

export const DEFAULT_DEPARTEMEN_COLUMNS: DepartemenColumn[] = [
  {
    id: NOMOR_DEFAULT_ID,
    label: "Nomor Register",
    type: "number",
    defaultValue: "N/A",
    isDefault: true,
    isRequired: true,
    showInDataSurat: true,
    showInPrint: true,
    sortOrder: 0,
  },
  {
    id: TANGGAL_DEFAULT_ID,
    label: "Tanggal Terima",
    type: "date",
    defaultValue: "N/A",
    isDefault: true,
    isRequired: true,
    showInDataSurat: false,
    showInPrint: true,
    sortOrder: 1,
  },
  {
    id: ASAL_DEFAULT_ID,
    label: "Asal Surat",
    type: "text",
    defaultValue: "N/A",
    isDefault: true,
    isRequired: true,
    showInDataSurat: true,
    showInPrint: true,
    sortOrder: 2,
  },
  {
    id: TUJUAN_DEFAULT_ID,
    label: "Tujuan",
    type: "text",
    defaultValue: "N/A",
    isDefault: true,
    isRequired: true,
    showInDataSurat: true,
    showInPrint: true,
    sortOrder: 3,
  },
]

export const EMPTY_DEPARTEMEN_FORM: DepartemenFormState = {
  tujuan: "",
  shortName: "",
  printSheetName: "",
  printSheetMode: "new",
  columnMode: "new",
  sourceDepartmentId: "",
  columns: DEFAULT_DEPARTEMEN_COLUMNS,
}
