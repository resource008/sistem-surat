export type TrackFieldType = "text" | "date" | "number" | "category"

export interface TrackCategory {
  id: string
  name: string
  color: string
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
  categoryColor: "#2563eb",
  region: "",
  columnName: "",
  type: "text",
  defaultValue: "",
  categoryOptions: [],
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
