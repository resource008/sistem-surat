import {
  getCustomFieldInputValue,
  getCustomFieldValue,
  getSuratBuiltInColumnKey,
} from "@/domain/surat/custom-fields"
import { formatRegisterNumber } from "@/lib/format-register-number"
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
  return column ? getCustomFieldValue(column, customFields) ?? "" : ""
}

function getFirstCustomFieldValue(customFields: Record<string, string>) {
  return Object.values(customFields).find((value) => value.trim().length > 0) ?? ""
}

function normalizeDetailDate(value: string | undefined, fallback: Date) {
  if (!value) return fallback
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? fallback : date
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
  fallbackDate: Date
) {
  const customFields = normalizeCustomFields(item.customFields ?? {})
  const getValue = (key: ReturnType<typeof getSuratBuiltInColumnKey>) => {
    const column = columns.find((column) => getSuratBuiltInColumnKey(column) === key)
    return column ? getCustomFieldInputValue(column, item) : getDynamicDetailValue(columns, customFields, key)
  }
  const perihal = getValue("perihal") || getFirstCustomFieldValue(customFields) || "-"
  const noSurat = getValue("noSurat") || null
  const lampiran = getValue("lampiran") || null
  const tanggalSurat = normalizeDetailDate(
    getValue("tanggalSurat"),
    fallbackDate
  )

  return {
    perihal,
    noSurat,
    lampiran,
    tujuan: item.tujuan ?? tujuan,
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
        .filter((column) => column.showInDataSurat),
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
