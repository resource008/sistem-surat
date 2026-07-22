import {
  getCustomFieldExactValue,
  getCustomFieldInputValue,
  getSuratBuiltInColumnKey,
  validateCustomFieldValue,
} from "@/domain/surat/custom-fields"
import { getColumnAutoFill } from "@/constants/departemen-columns"
import { formatRegisterNumber } from "@/lib/format-register-number"
import { AppError } from "@/lib/errors"
import type { DepartemenColumn, RegisterSurat } from "@/types"
import { normalizeCustomFields } from "./custom-fields"
import type { CustomFieldsMap, DepartmentColumnsMap } from "./types"

function getDynamicDetailValue(
  columns: DepartemenColumn[],
  customFields: Record<string, string>,
  key: ReturnType<typeof getSuratBuiltInColumnKey>
) {
  if (!key) return ""
  const column = columns.find((item) => getSuratBuiltInColumnKey(item) === key)
  return column ? getCustomFieldExactValue(column, customFields) ?? "" : ""
}

function getFirstCustomFieldValue(customFields: Record<string, string>) {
  return Object.values(customFields).find((value) => value.trim().length > 0) ?? ""
}

function normalizeDetailDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? fallback : date
}

function getColumnByBuiltInKey(
  columns: DepartemenColumn[],
  key: ReturnType<typeof getSuratBuiltInColumnKey>
) {
  if (!key) return undefined
  return columns.find((column) => getSuratBuiltInColumnKey(column) === key)
}

function requireValidManualValue(
  column: DepartemenColumn | undefined,
  value: string,
) {
  if (!column) return
  const error = validateCustomFieldValue(column, value)
  if (error) throw new AppError(400, error)
}

export function buildDynamicSuratDetail(
  item: {
    customFields?: Record<string, string>
    tujuan?: string | null
    perihal?: unknown
    noSurat?: unknown
    lampiran?: unknown
    tanggalSurat?: unknown
  },
  columns: DepartemenColumn[],
  tujuan: string,
  fallbackDate: Date,
  sequenceNumber = ""
) {
  const customFields = normalizeCustomFields(item.customFields ?? {})
  const getManualValue = (key: ReturnType<typeof getSuratBuiltInColumnKey>) => {
    const column = getColumnByBuiltInKey(columns, key)
    return column ? getCustomFieldInputValue(column, item) : getDynamicDetailValue(columns, customFields, key)
  }
  const getAutoFill = (key: ReturnType<typeof getSuratBuiltInColumnKey>) => {
    const column = getColumnByBuiltInKey(columns, key)
    return column ? getColumnAutoFill(column.defaultValue) : "none"
  }
  const noSuratColumn = getColumnByBuiltInKey(columns, "noSurat")
  const tanggalSuratColumn = getColumnByBuiltInKey(columns, "tanggalSurat")
  const noSuratAutoFill = getAutoFill("noSurat")
  const tanggalSuratAutoFill = getAutoFill("tanggalSurat")
  const manualNoSurat = getManualValue("noSurat")
  const manualTanggalSurat = getManualValue("tanggalSurat")

  if (noSuratAutoFill !== "sequence") requireValidManualValue(noSuratColumn, manualNoSurat)
  if (tanggalSuratAutoFill !== "currentDate") requireValidManualValue(tanggalSuratColumn, manualTanggalSurat)

  const perihal = getManualValue("perihal") || getFirstCustomFieldValue(customFields) || "-"
  const noSurat = noSuratAutoFill === "sequence"
    ? sequenceNumber
    : manualNoSurat || null
  const lampiran = getManualValue("lampiran") || null
  const tanggalSurat = normalizeDetailDate(
    tanggalSuratAutoFill === "currentDate" ? fallbackDate.toISOString() : manualTanggalSurat,
    fallbackDate
  )

  return {
    perihal,
    noSurat,
    lampiran,
    tujuan: getAutoFill("tujuan") === "department" ? tujuan : getManualValue("tujuan") || item.tujuan || tujuan,
    tanggalSurat,
  }
}

export function serializeSurat(
  row: Record<string, unknown>,
  customFields: CustomFieldsMap = {},
  departmentColumns: DepartmentColumnsMap = {}
): RegisterSurat {
  const dept = row.dept as Record<string, unknown> | undefined
  const deptShortName = String(dept?.shortName ?? row.deptId)

  return {
    id:            Number(row.id),
    nomor:         formatRegisterNumber(String(row.nomor)),
    deptId:        String(row.deptId),
    dept: {
      id:              String(dept?.id ?? row.deptId),
      shortName:       deptShortName,
      printSheetName: String(dept?.printSheetName ?? ""),
      columns: departmentColumns[String(dept?.id ?? row.deptId)] ?? [],
      displayColumns: (departmentColumns[String(dept?.id ?? row.deptId)] ?? [])
        .filter((column) => column.showInDataSurat)
        .sort((a, b) => (a.displayOrder ?? a.sortOrder) - (b.displayOrder ?? b.sortOrder)),
    },
    asalSurat:     String(row.asalSurat ?? ""),
    tujuan:        deptShortName,
    tanggalTerima: row.tanggalTerima instanceof Date
      ? row.tanggalTerima.toISOString()
      : String(row.tanggalTerima),
    detailSurat: (row.detailSurat as Record<string, unknown>[])?.map((d) => ({
      id:       Number(d.id),
      registerId: Number(d.registerId ?? row.id),
      perihal:  String(d.perihal ?? ""),
      noSurat:  d.noSurat  === null || d.noSurat  === undefined ? null : String(d.noSurat),
      lampiran: d.lampiran === null || d.lampiran === undefined ? null : String(d.lampiran),
      tujuan:   deptShortName,
      tanggalSurat: d.tanggalSurat instanceof Date
        ? d.tanggalSurat.toISOString()
        : String(d.tanggalSurat),
      customFields: customFields[Number(d.id)] ?? normalizeCustomFields(d.customFields),
    })),
  } as RegisterSurat
}
