import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import { attachDepartmentColumns } from "./column-store"
import { findActiveDepartmentRef, findAnyDepartmentRef } from "./departments"
import { ensureDepartmentMetaColumns, getDepartmentNameColumn } from "./schema"
import type { DepartmentRow } from "./types"

export async function findDepartments({ includeInactive = false } = {}) {
  await ensureDepartmentMetaColumns()
  const nameColumn = await getDepartmentNameColumn()

  const rows = await prisma.$queryRawUnsafe<DepartmentRow[]>(`
    SELECT
      id,
      short_name AS "shortName",
      ${nameColumn} AS "fullName",
      ${nameColumn} AS tujuan,
      print_column_name AS "printSheetName",
      is_active AS "isActive"
    FROM departments
    ${includeInactive ? "" : "WHERE is_active = true"}
    ORDER BY short_name ASC
  `)

  return attachDepartmentColumns(rows)
}

export async function findDepartmentByIdOrThrow(id: string, { includeInactive = false } = {}) {
  await ensureDepartmentMetaColumns()
  const nameColumn = await getDepartmentNameColumn()
  const resolvedId = includeInactive
    ? await findAnyDepartmentRef(id)
    : await findActiveDepartmentRef(id)
  if (!resolvedId) throw new AppError(404, "Departemen tidak ditemukan")

  const rows = await prisma.$queryRawUnsafe<DepartmentRow[]>(
    `
      SELECT
        id,
        short_name AS "shortName",
        ${nameColumn} AS "fullName",
        ${nameColumn} AS tujuan,
        print_column_name AS "printSheetName",
        is_active AS "isActive"
      FROM departments
      WHERE id = $1
        ${includeInactive ? "" : "AND is_active = true"}
      LIMIT 1
    `,
    resolvedId
  )

  const departemen = rows[0]
  if (!departemen) throw new AppError(404, "Departemen tidak ditemukan")
  return (await attachDepartmentColumns([departemen]))[0]
}
