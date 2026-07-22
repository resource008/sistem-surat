import { RegisterSurat } from "@/components/surat/shared"
import { getSuratBuiltInColumnKey, isAutoFilledSuratColumn } from "@/domain/surat/custom-fields"
import { getStoredCustomFieldValue } from "@/lib/surat-display"
import { FileText } from "lucide-react"
import { CustomFieldsView, getCustomSuratColumns } from "../custom-fields"

interface Props {
  register: RegisterSurat
}

function getDetailFieldValues(register: RegisterSurat, detail: RegisterSurat["detailSurat"][number]) {
  const customFields = detail.customFields ?? {}
  const customColumns = getCustomSuratColumns(register.dept.columns, true)
  const baseCustomValues = Object.entries(customFields)
    .filter(([key, value]) => !/_group_\d+$/.test(key) && String(value ?? "").trim())
    .map(([, value]) => String(value))
  const groupedCustomValues = Object.entries(customFields).reduce<Record<string, string[]>>((acc, [key, value]) => {
    const match = key.match(/_group_(\d+)$/)
    if (!match || !String(value ?? "").trim()) return acc

    acc[match[1]] ??= []
    acc[match[1]].push(String(value))
    return acc
  }, {})
  const values: Record<string, string> = {
    ...customFields,
  }

  customColumns.forEach((column) => {
    if (values[column.id]?.trim()) return

    const storedValue = getStoredCustomFieldValue(column, register, detail)
    if (storedValue?.trim()) values[column.id] = storedValue
  })

  customColumns.filter((column) => !isAutoFilledSuratColumn(column)).forEach((column, index) => {
    if (values[column.id]?.trim()) return
    const fallbackValue = baseCustomValues[index]
    if (fallbackValue?.trim()) values[column.id] = fallbackValue
  })

  customColumns
    .filter((_, index) => index % 2 === 1)
    .filter((column) => !isAutoFilledSuratColumn(column))
    .forEach((column, index) => {
      Object.entries(groupedCustomValues).forEach(([groupIndex, groupValues]) => {
        const fieldKey = `${column.id}_group_${groupIndex}`
        if (values[fieldKey]?.trim()) return

        const fallbackValue = groupValues[index]
        if (fallbackValue?.trim()) values[fieldKey] = fallbackValue
      })
    })

  customColumns.forEach((column) => {
    const builtInKey = getSuratBuiltInColumnKey(column)
    if (!builtInKey) return
    if (values[column.id]?.trim()) return

    const value = detail[builtInKey]
    values[column.id] = value == null ? "" : String(value)
  })

  return {
    ...values,
    Perihal: detail.perihal ?? "",
    "Perihal Surat": detail.perihal ?? "",
    Lampiran: detail.lampiran ?? "",
    "Nomor Surat": detail.noSurat ?? "",
    "No Surat": detail.noSurat ?? "",
    "Tanggal Surat": detail.tanggalSurat ?? "",
    Tujuan: detail.tujuan ?? "",
    "Tujuan Surat": detail.tujuan ?? "",
  }
}

export function SuratListPanel({ register }: Props) {
  if (!register.detailSurat?.length) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-200 dark:border-neutral-800
                      px-6 py-12 text-center lg:h-full
                      flex flex-col items-center justify-center min-h-50">
        <FileText className="mb-3 h-8 w-8 text-slate-300 dark:text-slate-700" />
        <p className="text-[13px] text-slate-400 dark:text-slate-500">
          Belum ada surat dalam register ini.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {register.detailSurat.map((detail) => (
        <div key={detail.id}
          className="shrink-0">
          {getCustomSuratColumns(register.dept.columns, true).length > 0 ? (
            <CustomFieldsView
              columns={register.dept.columns}
              values={getDetailFieldValues(register, detail)}
              includeBuiltIn
              splitLayout
            />
          ) : (
            <div className="rounded-xl border border-dashed border-border/60 px-4 py-3 text-sm text-muted-foreground">
              Tidak ada kolom untuk ditampilkan.
            </div>
          )}

        </div>
      ))}
    </div>
  )
}
