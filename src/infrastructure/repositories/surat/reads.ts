import { Prisma } from "@/generated/prisma"
import type {
  PaginatedResult,
  SuratResult,
} from "@/domain/surat/repositories"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { findActiveDepartmentByRef } from "./departments"
import { ensureCustomFieldColumns, loadSuratCustomFields } from "./custom-fields"
import { loadDepartmentColumns } from "./department-columns"
import { serializeSurat } from "./serializer"
import { deptSelect } from "./types"
import {
  ASAL_DEFAULT_ID,
  NOMOR_DEFAULT_ID,
  TANGGAL_DEFAULT_ID,
} from "@/constants/departemen-columns"
import { getSuratBuiltInColumnKey, isTujuanColumn } from "@/domain/surat/custom-fields"
import { getSuratColumnValue } from "@/lib/surat-display"
import type { DepartemenColumn, DetailSurat, RegisterSurat } from "@/types"
import { getDateInputDayRange, parseDateInput } from "@/lib/date-input"

const SEARCH_COLUMN_ALL = "all"
const DETAIL_COLUMN_PREFIX = "kolom_"

function normalizeSearchText(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

function normalizeColumnLabel(label: string) {
  return normalizeSearchText(label).replace(/[^a-z0-9]+/g, " ").trim()
}

function getDetailColumnSearchId(label: string) {
  return `${DETAIL_COLUMN_PREFIX}${normalizeColumnLabel(label).replace(/\s+/g, "_")}`
}

function getDetailColumnSearchLabel(columnId: string) {
  if (columnId.startsWith("column:")) return columnId.replace(/^column:/, "")
  if (columnId.startsWith(DETAIL_COLUMN_PREFIX)) {
    return columnId.slice(DETAIL_COLUMN_PREFIX.length).replace(/_/g, " ")
  }
  return null
}

function isSelectedDetailColumn(column: { id: string; label: string }, selectedColumn: string) {
  return getColumnSearchId(column) === selectedColumn
    || getDetailColumnSearchLabel(selectedColumn) === normalizeColumnLabel(column.label)
}

function safeDateTexts(value: string | Date | null | undefined) {
  if (!value) return []
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return [value]

  return [
    value,
    date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  ]
}

function getColumnSearchId(column: { id: string; label: string }) {
  const columnId = String(column.id)
  const normalizedLabel = normalizeColumnLabel(column.label)
  if (columnId.includes(NOMOR_DEFAULT_ID)) return "nomor_register"
  if (
    columnId.includes(TANGGAL_DEFAULT_ID)
    && (normalizedLabel === "tanggal terima" || normalizedLabel === "tgl terima")
  ) return "tanggal_terima"
  if (columnId.includes(ASAL_DEFAULT_ID)) return "asal_surat"
  if (isTujuanColumn(column)) return "tujuan"
  return getDetailColumnSearchId(normalizedLabel)
}

function dedupeSearchValues(values: unknown[]) {
  const seen = new Set<string>()

  return values.filter((value) => {
    const text = String(value ?? "").trim()
    if (!text || seen.has(text)) return false
    seen.add(text)
    return true
  })
}

function getStaticColumnValues(columnId: string, reg: RegisterSurat, detail: DetailSurat) {
  if (columnId === "nomor_register") return [reg.nomor]
  if (columnId === "tanggal_terima") return safeDateTexts(reg.tanggalTerima)
  if (columnId === "asal_surat") return [reg.asalSurat]
  if (columnId === "tujuan") return [detail.tujuan, reg.tujuan, reg.dept.shortName]
  return []
}

function getBuiltInDetailSearchValues(columnLabel: string, detail: DetailSurat) {
  if (columnLabel === "perihal" || columnLabel === "perihal surat") return [detail.perihal]
  if (columnLabel === "nomor surat" || columnLabel === "no surat") return [detail.noSurat]
  if (columnLabel === "lampiran") return [detail.lampiran]
  if (columnLabel === "tanggal surat" || columnLabel === "tgl surat") return safeDateTexts(detail.tanggalSurat)

  return []
}

function getCustomFieldSearchValues(detail: DetailSurat, selectedColumn?: string) {
  const entries = Object.entries(detail.customFields ?? {})
  if (!selectedColumn) return entries.map(([, value]) => value)

  return entries
    .filter(([key]) => {
      const normalizedKey = normalizeColumnLabel(key)
      return normalizedKey === selectedColumn || normalizedKey.endsWith(` ${selectedColumn}`)
    })
    .map(([, value]) => value)
}

function getDetailColumnTexts(reg: RegisterSurat, detail: DetailSurat, selectedColumn: string) {
  const detailColumnLabel = getDetailColumnSearchLabel(selectedColumn)

  if (selectedColumn !== SEARCH_COLUMN_ALL && !detailColumnLabel) {
    return getStaticColumnValues(selectedColumn, reg, detail)
  }

  const displayColumns = reg.dept.displayColumns ?? reg.dept.columns ?? []
  const values: unknown[] = displayColumns
    .filter((column) => selectedColumn === SEARCH_COLUMN_ALL || isSelectedDetailColumn(column, selectedColumn))
    .map((column) => getSuratColumnValue(column, reg, detail))

  if (detailColumnLabel) {
    values.push(
      ...getBuiltInDetailSearchValues(detailColumnLabel, detail),
      ...getCustomFieldSearchValues(detail, detailColumnLabel)
    )
  }

  if (selectedColumn === SEARCH_COLUMN_ALL) {
    values.push(
      reg.nomor,
      reg.dept.shortName,
      reg.asalSurat,
      reg.tanggalTerima,
      ...safeDateTexts(reg.tanggalTerima),
      detail.perihal,
      detail.noSurat,
      detail.lampiran,
      detail.tanggalSurat,
      ...safeDateTexts(detail.tanggalSurat),
      detail.tujuan,
      reg.tujuan,
      ...getCustomFieldSearchValues(detail)
    )
  }

  return dedupeSearchValues(values)
}

function filterSuratBySearch(data: RegisterSurat[], search?: string | null, column?: string | null) {
  const normalizedQuery = normalizeSearchText(search)
  if (!normalizedQuery) return data

  const selectedColumn = column?.trim() || SEARCH_COLUMN_ALL

  return data
    .map((reg) => {
      const matchingDetails = (reg.detailSurat ?? [])
        .filter((detail) =>
          getDetailColumnTexts(reg, detail, selectedColumn)
            .some((value) => normalizeSearchText(value).includes(normalizedQuery))
        )

      return matchingDetails.length > 0
        ? { ...reg, detailSurat: matchingDetails }
        : null
    })
    .filter((reg): reg is RegisterSurat => reg !== null)
}

function isSameInputDate(value: unknown, range: { start: Date; end: Date }) {
  const date = parseDateInput(String(value ?? ""))
  if (!date) return false

  const time = date.getTime()
  return time >= range.start.getTime() && time <= range.end.getTime()
}

function getDetailDateColumnValues(reg: RegisterSurat, detail: DetailSurat, selectedColumn: string) {
  if (selectedColumn === "tanggal_terima") return [reg.tanggalTerima]

  const selectedLabel = getDetailColumnSearchLabel(selectedColumn)

  if (!selectedLabel) {
    return getDetailColumnTexts(reg, detail, selectedColumn)
  }

  if (selectedLabel === "tanggal surat" || selectedLabel === "tgl surat") {
    return [detail.tanggalSurat]
  }

  const displayColumns = reg.dept.displayColumns ?? reg.dept.columns ?? []
  const matchingColumns = displayColumns.filter((column) => isSelectedDetailColumn(column, selectedColumn))
  const values: unknown[] = []

  matchingColumns.forEach((column) => {
    const builtInKey = getSuratBuiltInColumnKey(column)
    const normalizedLabel = normalizeColumnLabel(column.label)

    if (builtInKey === "tanggalSurat" || normalizedLabel === "tanggal surat" || normalizedLabel === "tgl surat") {
      values.push(detail.tanggalSurat)
      return
    }

    values.push(
      detail.customFields?.[column.id],
      detail.customFields?.[column.label]
    )

    Object.entries(detail.customFields ?? {})
      .filter(([key]) => key.startsWith(`${column.id}_group_`))
      .forEach(([, value]) => values.push(value))
  })

  return dedupeSearchValues(values)
}

function getDetailGroupCount(detail: DetailSurat) {
  return Object.keys(detail.customFields ?? {}).reduce((count, key) => {
    const match = key.match(/_group_(\d+)$/)
    if (!match) return count
    return Math.max(count, Number(match[1]) + 1)
  }, 1)
}

function getColumnDateValueForGroup(
  column: DepartemenColumn,
  reg: RegisterSurat,
  detail: DetailSurat,
  groupIndex: number
) {
  const customFields = detail.customFields ?? {}
  if (groupIndex > 0) {
    return customFields[`${column.id}_group_${groupIndex}`]
  }

  const directValue = customFields[column.id] ?? customFields[column.label]
  if (directValue?.trim()) return directValue

  const normalizedLabel = normalizeColumnLabel(column.label)
  if (normalizedLabel === "tanggal terima" || normalizedLabel === "tgl terima") return reg.tanggalTerima

  const builtInKey = getSuratBuiltInColumnKey(column)
  if (builtInKey === "tanggalSurat" || normalizedLabel === "tanggal surat" || normalizedLabel === "tgl surat") {
    return detail.tanggalSurat
  }

  return undefined
}

function getMatchingDateGroupIndexes(
  reg: RegisterSurat,
  detail: DetailSurat,
  selectedColumn: string,
  range: { start: Date; end: Date }
) {
  if (selectedColumn === "tanggal_terima") {
    return isSameInputDate(reg.tanggalTerima, range)
      ? Array.from({ length: getDetailGroupCount(detail) }, (_, index) => index)
      : []
  }

  const selectedLabel = getDetailColumnSearchLabel(selectedColumn)

  if (!selectedLabel) {
    return getDetailDateColumnValues(reg, detail, selectedColumn)
      .some((value) => isSameInputDate(value, range))
      ? Array.from({ length: getDetailGroupCount(detail) }, (_, index) => index)
      : []
  }

  const displayColumns = reg.dept.displayColumns ?? reg.dept.columns ?? []
  const matchingColumns = displayColumns.filter((column) => isSelectedDetailColumn(column, selectedColumn))

  if (matchingColumns.length === 0) {
    if (selectedLabel === "tanggal surat" || selectedLabel === "tgl surat") {
      return isSameInputDate(detail.tanggalSurat, range) ? [0] : []
    }
    return []
  }

  return Array.from({ length: getDetailGroupCount(detail) }, (_, index) => index)
    .filter((groupIndex) =>
      matchingColumns.some((column) =>
        isSameInputDate(getColumnDateValueForGroup(column, reg, detail, groupIndex), range)
      )
    )
}

function compactDetailGroups(detail: DetailSurat, groupIndexes: number[]) {
  const groupCount = getDetailGroupCount(detail)
  if (groupIndexes.length === groupCount && groupIndexes.every((value, index) => value === index)) {
    return detail
  }

  const selectedIndexMap = new Map(groupIndexes.map((oldIndex, newIndex) => [oldIndex, newIndex]))
  const customFields = detail.customFields ?? {}
  const groupedBaseKeys = new Set<string>()

  Object.keys(customFields).forEach((key) => {
    const match = key.match(/^(.*)_group_(\d+)$/)
    if (match) groupedBaseKeys.add(match[1])
  })

  const nextCustomFields: Record<string, string> = {}

  Object.entries(customFields).forEach(([key, value]) => {
    const match = key.match(/^(.*)_group_(\d+)$/)
    if (match) {
      const oldGroupIndex = Number(match[2])
      const newGroupIndex = selectedIndexMap.get(oldGroupIndex)
      if (newGroupIndex === undefined) return

      const baseKey = match[1]
      nextCustomFields[newGroupIndex === 0 ? baseKey : `${baseKey}_group_${newGroupIndex}`] = value
      return
    }

    if (!selectedIndexMap.has(0) && groupedBaseKeys.has(key)) return
    nextCustomFields[key] = value
  })

  return {
    ...detail,
    customFields: nextCustomFields,
  }
}

function filterSuratBySelectedDate(data: RegisterSurat[], date?: string | null, column?: string | null) {
  const range = getDateInputDayRange(date)
  if (!range) return data

  const selectedColumn = column?.trim() || "tanggal_terima"

  return data
    .map((reg) => {
      const matchingDetails = (reg.detailSurat ?? [])
        .map((detail) => {
          const matchingGroupIndexes = getMatchingDateGroupIndexes(reg, detail, selectedColumn, range)
          return matchingGroupIndexes.length > 0
            ? compactDetailGroups(detail, matchingGroupIndexes)
            : null
        })
        .filter((detail): detail is DetailSurat => detail !== null)

      return matchingDetails.length > 0
        ? { ...reg, detailSurat: matchingDetails }
        : null
    })
    .filter((reg): reg is RegisterSurat => reg !== null)
}

function paginateData(data: RegisterSurat[], pagination?: { page: number; limit: number }) {
  if (!pagination) return data

  const start = (pagination.page - 1) * pagination.limit
  const pagedData = data.slice(start, start + pagination.limit)

  return {
    data: pagedData,
    hasMore: start + pagedData.length < data.length,
  }
}

function buildSuratWhere(
  ids: number[] | null,
  date?: string | null,
  depts?: string[] | null,
  column?: string | null,
) {
  const where: Record<string, unknown> = {
    dept: { is: { isActive: true } },
    detailSurat: { some: {} },
  }
  if (ids?.length) where.id = { in: ids }
  if (depts?.length) {
    where.OR = [
      { deptId: { in: depts } },
      { dept: { is: { shortName: { in: depts } } } },
    ]
  }
  if (date && (!column || column === "tanggal_terima")) {
    const range = getDateInputDayRange(date)
    if (range) where.tanggalTerima = { gte: range.start, lte: range.end }
  }
  return where
}

async function serializeRows(rows: Array<{ deptId: string; detailSurat: Array<{ id: number }> } & Record<string, unknown>>) {
  const detailIds = rows.flatMap((row) => row.detailSurat.map((detail) => detail.id))
  const customFields = await loadSuratCustomFields(detailIds)
  const departmentColumns = await loadDepartmentColumns(rows.map((row) => row.deptId))
  return rows.map((row) => serializeSurat(row, customFields, departmentColumns))
}

export async function findAllSurat(
  ids: number[] | null,
  pagination?: { page: number; limit: number },
  date?: string | null,
  depts?: string[] | null,
  search?: string | null,
  column?: string | null,
): Promise<SuratResult[] | PaginatedResult<SuratResult>> {
  await ensureCustomFieldColumns()
  const hasSearch = Boolean(search?.trim())
  const hasPostDateFilter = Boolean(date && column && column !== "tanggal_terima")
  const needsPostFilter = hasSearch || hasPostDateFilter
  const skip = pagination && !needsPostFilter ? (pagination.page - 1) * pagination.limit : undefined
  const take = pagination && !needsPostFilter ? pagination.limit : undefined
  const suratWhere = buildSuratWhere(ids, date, depts, column)

  const [rows, total] = await Promise.all([
    prisma.registerSurat.findMany({
      where:   suratWhere as Prisma.RegisterSuratWhereInput,
      include: { dept: { select: deptSelect }, detailSurat: true },
      orderBy: { tanggalTerima: "desc" },
      skip,
      take,
    }),
    pagination
      ? prisma.registerSurat.count({ where: suratWhere as Prisma.RegisterSuratWhereInput })
      : Promise.resolve(0),
  ])

  const data = await serializeRows(rows as unknown as Array<{ deptId: string; detailSurat: Array<{ id: number }> } & Record<string, unknown>>)
  const dateFilteredData = hasPostDateFilter
    ? filterSuratBySelectedDate(data, date, column)
    : data
  const filteredData = filterSuratBySearch(dateFilteredData, search, column)
  if (needsPostFilter) return paginateData(filteredData, pagination)
  if (!pagination) return filteredData

  return {
    data: filteredData,
    hasMore: (pagination.page - 1) * pagination.limit + data.length < total,
  }
}

export async function findSuratByIdAndDept(id: number, dept: string): Promise<SuratResult | null> {
  await ensureCustomFieldColumns()
  const department = await findActiveDepartmentByRef(dept)
  if (!department) return null

  const row = await prisma.registerSurat.findFirst({
    where:   { id, deptId: department.id, dept: { is: { isActive: true } } },
    include: { dept: { select: deptSelect }, detailSurat: true },
  })
  if (!row) return null

  const data = await serializeRows([row as unknown as { deptId: string; detailSurat: Array<{ id: number }> } & Record<string, unknown>])
  return data[0] ?? null
}
