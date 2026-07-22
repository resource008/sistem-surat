import {
  DEFAULT_DEPARTEMEN_COLUMNS,
  type Departemen,
  type DepartemenColumn,
} from "@/types"

function normalizeLabel(label: string) {
  return label.trim().toLowerCase()
}

function slugLabel(label: string) {
  return normalizeLabel(label)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
}

function getDefaultColumnId(label: string) {
  const normalizedLabel = normalizeLabel(label)
  return DEFAULT_DEPARTEMEN_COLUMNS.find((column) =>
    normalizeLabel(column.label) === normalizedLabel
  )?.id
}

export function hydrateDepartemenColumnIds(columns: Partial<DepartemenColumn>[] = []): DepartemenColumn[] {
  return columns.map((column, index) => {
    const label = column.label ?? ""
    const defaultId = column.isDefault ? getDefaultColumnId(label) : undefined

    return {
      id: column.id ?? defaultId ?? `draft_${index}_${slugLabel(label) || "kolom"}`,
      label,
      type: column.type ?? "text",
      defaultValue: column.defaultValue ?? "",
      isDefault: column.isDefault ?? false,
      isRequired: column.isRequired ?? false,
      showInDataSurat: column.showInDataSurat ?? false,
      showInPrint: column.showInPrint ?? true,
      sortOrder: column.sortOrder ?? index,
      displayOrder: column.displayOrder ?? column.sortOrder ?? index,
    }
  })
}

export function hydrateDepartemenForClient(departemen: Departemen): Departemen {
  const columns = hydrateDepartemenColumnIds(departemen.columns)

  return {
    ...departemen,
    columns,
    displayColumns: columns
      .filter((column) => column.showInDataSurat)
      .sort((a, b) => (a.displayOrder ?? a.sortOrder) - (b.displayOrder ?? b.sortOrder)),
  }
}
