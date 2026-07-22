import { prisma } from "@/infrastructure/databases/prisma-client"
import { DEFAULT_DEPARTEMEN_COLUMNS } from "@/types"
import type { DepartemenColumn, DepartemenColumnType } from "@/types"
import type { DepartmentColumnsMap } from "./types"

function getDefaultColumnTemplate(column: DepartemenColumn) {
  if (!column.isDefault) return null
  return DEFAULT_DEPARTEMEN_COLUMNS.find((defaultColumn) => column.id.includes(defaultColumn.id)) ?? null
}

export function normalizeDepartmentColumns(_departmentId: string, columns: DepartemenColumn[]) {
  return columns.map((column) => {
    const defaultColumn = getDefaultColumnTemplate(column)
    return defaultColumn
      ? {
          ...defaultColumn,
          id: column.id,
          showInDataSurat: column.showInDataSurat,
          showInPrint: column.showInPrint,
          sortOrder: column.sortOrder,
          displayOrder: column.displayOrder ?? column.sortOrder,
        }
      : { ...column }
  })
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((column, index) => ({ ...column, sortOrder: index }))
}

export async function loadDepartmentColumns(departmentIds: string[]): Promise<DepartmentColumnsMap> {
  const ids = [...new Set(departmentIds)].filter(Boolean)
  if (ids.length === 0) return {}
  const fallback = Object.fromEntries(
    ids.map((departmentId) => [departmentId, normalizeDepartmentColumns(departmentId, [])])
  ) as DepartmentColumnsMap

  const table = await prisma.$queryRaw<Array<{ exists: boolean }>>`
    SELECT to_regclass('public.department_columns') IS NOT NULL AS "exists"
  `
  if (!table[0]?.exists) return fallback
  await prisma.$executeRawUnsafe(`
    ALTER TABLE department_columns
    ADD COLUMN IF NOT EXISTS show_in_print BOOLEAN NOT NULL DEFAULT true
  `)
  await prisma.$executeRawUnsafe(`
    ALTER TABLE department_columns
    ADD COLUMN IF NOT EXISTS default_value TEXT NOT NULL DEFAULT ''
  `)
  await prisma.$executeRawUnsafe(`
    ALTER TABLE department_columns
    ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0
  `)

  const rows = await prisma.$queryRawUnsafe<Array<{
    departmentId: string
    id: string
    label: string
    type: DepartemenColumnType
    defaultValue: string
    isDefault: boolean
    isRequired: boolean
    showInDataSurat: boolean
    showInPrint: boolean
    sortOrder: number
    displayOrder: number
  }>>(
    `
      SELECT
        department_id AS "departmentId",
        id,
        label,
        data_type AS "type",
        default_value AS "defaultValue",
        is_default AS "isDefault",
        is_required AS "isRequired",
        show_in_data_surat AS "showInDataSurat",
        show_in_print AS "showInPrint",
        sort_order AS "sortOrder",
        display_order AS "displayOrder"
      FROM department_columns
      WHERE department_id = ANY($1)
      ORDER BY sort_order ASC, label ASC
    `,
    ids
  )

  const grouped = rows.reduce<DepartmentColumnsMap>((acc, row) => {
    acc[row.departmentId] ??= []
    acc[row.departmentId].push({
      id: row.id,
      label: row.label,
      type: row.type,
      defaultValue: row.defaultValue,
      isDefault: row.isDefault,
      isRequired: row.isRequired,
      showInDataSurat: row.showInDataSurat,
      showInPrint: row.showInPrint,
      sortOrder: row.sortOrder,
      displayOrder: row.displayOrder ?? row.sortOrder,
    })
    return acc
  }, {})

  ids.forEach((departmentId) => {
    grouped[departmentId] = normalizeDepartmentColumns(departmentId, grouped[departmentId] ?? [])
  })

  return grouped
}
