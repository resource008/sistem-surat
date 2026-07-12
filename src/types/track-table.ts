export type TrackFieldType = "text" | "date" | "number" | "category"

export interface TrackCategory {
  id: string
  name: string
  color: string
  fillByHrd: boolean
  sortOrder: number
}

export interface TrackField {
  id: string
  categoryId: string
  category: string
  categoryColor: string
  region: string
  columnName: string
  type: TrackFieldType
  defaultValue: string
  categoryOptions: string[]
  fillByHrd: boolean
  hiddenAt?: string | Date | null
  sortOrder: number
}

export interface TrackSheet {
  id: string
  name: string
  description: string
  sortOrder: number
  hiddenAt?: string | Date | null
  categories: TrackCategory[]
  fields: TrackField[]
}

export interface TrackTableResponse {
  sheets: TrackSheet[]
  regions: string[]
}

export interface TrackRecord {
  id: string
  sheetId: string
  values: Record<string, string>
  createdById?: string | null
  createdAt: string
  updatedAt: string
}

export interface TrackRecordResponse {
  records: TrackRecord[]
}

export const TRACK_FIELD_TYPES: Array<{ value: TrackFieldType; label: string }> = [
  { value: "text", label: "Teks" },
  { value: "date", label: "Tanggal" },
  { value: "number", label: "Angka" },
  { value: "category", label: "Kategori" },
]

export const EMPTY_TRACK_FIELD: TrackField = {
  id: "",
  categoryId: "",
  category: "",
  categoryColor: "#ffffff",
  region: "",
  columnName: "",
  type: "text",
  defaultValue: "",
  categoryOptions: [],
  fillByHrd: false,
  hiddenAt: null,
  sortOrder: 0,
}

export const EMPTY_TRACK_SHEET: TrackSheet = {
  id: "",
  name: "",
  description: "",
  sortOrder: 0,
  categories: [],
  fields: [],
}
