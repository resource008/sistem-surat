export type {
  FormState,
  RegisterSurat,
  SuratItem,
} from "@/types"

type DeptColumnOption = {
  id: string
  label: string
  type: "text" | "date" | "number"
  defaultValue: string
  isDefault: boolean
  isRequired: boolean
  showInDataSurat: boolean
  showInPrint: boolean
  sortOrder: number
}

export interface DeptOption {
  id: string
  shortName: string
  fullName: string
  tujuan: string
  printSheetName?: string
  columns?: DeptColumnOption[]
  displayColumns?: DeptColumnOption[]
}

export interface CreateSuratPayload {
  deptId: string
  asalSurat: string
  tanggalTerima: string
  tujuan: string
  suratList: Array<{
    perihal: string
    noSurat?: string | null
    lampiran?: string | null
    tujuan?: string | null
    tanggalSurat: string
    customFields?: Record<string, string>
  }>
}

export interface UpdateSuratPayload {
  deptId?: string
  asalSurat?: string
  tujuan?: string
  tanggalTerima?: string
  suratList?: Array<{
    perihal: string
    noSurat?: string | null
    lampiran?: string | null
    tujuan?: string | null
    tanggalSurat: string
    customFields?: Record<string, string>
  }>
}
