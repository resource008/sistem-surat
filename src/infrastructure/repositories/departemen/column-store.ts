import { DEFAULT_DEPARTEMEN_COLUMNS } from "@/types"
import type { Departemen, DepartemenColumn } from "@/types"
import { prisma } from "@/infrastructure/databases/prisma-client"
import {
  createDepartmentColumnId,
  getDefaultColumnTemplate,
  mapDepartmentColumn,
  normalizeStoredColumns,
} from "./columns"
import { ensureDepartmentColumnTable } from "./schema"
import type { DbClient, DepartmentColumnRow, DepartmentRow } from "./types"

export async function loadDepartmentColumnsForDepartments(departmentIds: string[]) {
  await ensureDepartmentColumnTable()
  const result = new Map<string, DepartemenColumn[]>()
  departmentIds.forEach((id) => result.set(id, DEFAULT_DEPARTEMEN_COLUMNS.map((column) => ({ ...column }))))

  if (departmentIds.length === 0) return result

  const rows = await prisma.$queryRawUnsafe<DepartmentColumnRow[]>(
    `
      SELECT
        id,
        department_id AS "departmentId",
        label,
        data_type AS "type",
        default_value AS "defaultValue",
        is_default AS "isDefault",
        is_required AS "isRequired",
        show_in_data_surat AS "showInDataSurat",
        show_in_print AS "showInPrint",
        sort_order AS "sortOrder"
      FROM department_columns
      WHERE department_id = ANY($1)
      ORDER BY sort_order ASC, label ASC
    `,
    departmentIds
  )

  const grouped = new Map<string, DepartemenColumn[]>()
  rows.forEach((row) => {
    const columns = grouped.get(row.departmentId) ?? []
    columns.push(mapDepartmentColumn(row))
    grouped.set(row.departmentId, columns)
  })

  grouped.forEach((columns, departmentId) => {
    result.set(departmentId, normalizeStoredColumns(departmentId, columns))
  })

  return result
}

export async function attachDepartmentColumns(rows: DepartmentRow[]): Promise<Departemen[]> {
  const columnMap = await loadDepartmentColumnsForDepartments(rows.map((row) => row.id))

  return rows.map((row) => {
    const columns = columnMap.get(row.id) ?? DEFAULT_DEPARTEMEN_COLUMNS.map((column) => ({ ...column }))
    const normalizedColumns = normalizeStoredColumns(row.id, columns)

    return {
      ...row,
      columns: normalizedColumns,
      displayColumns: normalizedColumns.filter((column) => column.showInDataSurat),
    }
  })
}

export async function copyDepartmentColumnsFromDepartment(sourceDepartmentId: string): Promise<DepartemenColumn[]> {
  const columnMap = await loadDepartmentColumnsForDepartments([sourceDepartmentId])
  const sourceColumns = columnMap.get(sourceDepartmentId) ?? DEFAULT_DEPARTEMEN_COLUMNS

  return sourceColumns.map((column, index) => ({
    ...column,
    id: column.isDefault ? column.id : createDepartmentColumnId(),
    sortOrder: index,
  }))
}

export async function saveDepartmentColumns(
  db: DbClient,
  departmentId: string,
  columns: DepartemenColumn[]
) {
  await db.$executeRaw`
    DELETE FROM department_columns
    WHERE department_id = ${departmentId}
  `

  for (const [index, column] of columns.entries()) {
    const defaultColumn = getDefaultColumnTemplate(column)

    await db.$executeRaw`
      INSERT INTO department_columns (
        id,
        department_id,
        label,
        data_type,
        default_value,
        is_default,
        is_required,
        show_in_data_surat,
        show_in_print,
        sort_order
      )
      VALUES (
        ${defaultColumn ? `${departmentId}_${defaultColumn.id}` : createDepartmentColumnId()},
        ${departmentId},
        ${column.label},
        ${column.type},
        ${column.defaultValue},
        ${column.isDefault},
        ${column.isRequired},
        ${column.showInDataSurat},
        ${column.showInPrint},
        ${index}
      )
    `
  }
}
