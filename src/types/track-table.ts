export type TrackFieldType = "text" | "date" | "number" | "category"

export interface TrackCategory {
  id: string
  name: string
  color: string
  fillRequired: boolean
  addRoleValues: string[]
  editRoleValues: string[]
  deleteRoleValues: string[]
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
  fillRequired: boolean
  addRoleValues: string[]
  editRoleValues: string[]
  deleteRoleValues: string[]
  hiddenAt?: string | Date | null
  draftLabel?: string
  sortOrder: number
}

export interface TrackSheet {
  id: string
  name: string
  sortOrder: number
  displayCategoryId?: string
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
  sequenceNo: number
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
  fillRequired: false,
  addRoleValues: [],
  editRoleValues: [],
  deleteRoleValues: [],
  hiddenAt: null,
  sortOrder: 0,
}

export const EMPTY_TRACK_SHEET: TrackSheet = {
  id: "",
  name: "",
  sortOrder: 0,
  displayCategoryId: "",
  categories: [],
  fields: [],
}
