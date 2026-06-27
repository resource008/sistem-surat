import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import type { DepartemenColumn } from "@/types"
import { loadDepartmentColumnsForDepartments } from "./column-store"
import { getPrintStructureSignature } from "./columns"
import { ensureDepartmentMetaColumns } from "./schema"

export function resolvePrintSheetName(input: CreateDepartemenInput | UpdateDepartemenInput) {
  const printSheetName = input.printSheetName.trim()
  if (!printSheetName) throw new AppError(400, "Identifikasi nama lembar wajib diisi")
  return printSheetName
}

export async function ensureUniquePrintStructure(
  printSheetName: string,
  columns: DepartemenColumn[],
  currentDepartmentId?: string
) {
  const normalizedPrintName = printSheetName.trim().toLowerCase()
  if (!normalizedPrintName) return

  await ensureDepartmentMetaColumns()
  const rows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
    `
      SELECT id
      FROM departments
      WHERE is_active = true
        AND lower(trim(print_column_name)) = $1
        ${currentDepartmentId ? "AND id <> $2" : ""}
    `,
    ...(currentDepartmentId ? [normalizedPrintName, currentDepartmentId] : [normalizedPrintName])
  )

  if (rows.length === 0) return

  const columnMap = await loadDepartmentColumnsForDepartments(rows.map((row) => row.id))
  const nextSignature = getPrintStructureSignature(columns)
  const conflict = rows.find((row) => {
    const existingColumns = columnMap.get(row.id) ?? []
    return getPrintStructureSignature(existingColumns) !== nextSignature
  })

  if (conflict) {
    throw new AppError(
      409,
      "Identifikasi nama lembar sudah digunakan oleh struktur kolom yang berbeda. Buat identifikasi nama lembar baru untuk struktur kolom ini."
    )
  }
}
