import { RegisterSurat } from "@/components/surat/shared"
import { Checkbox } from "@/components/ui/checkbox"
import { formatCustomFieldValue, getCustomFieldValue, getSuratBuiltInFieldValue } from "@/domain/surat/custom-fields"
import { useRouter } from "next/navigation"

export function MobileList({ registers, selectedIds, basePath, actions }: any) {
  const router = useRouter()

  const getColumnValue = (column: any, reg: any, detail: any) => {
    if (String(column.id).includes("default_tanggal_terima")) {
      return formatCustomFieldValue({ ...column, type: "date" }, reg.tanggalTerima)
    }
    if (String(column.id).includes("default_asal_surat")) return reg.asalSurat || "-"
    if (String(column.id).includes("default_tujuan")) return detail.tujuan || reg.dept.shortName || "-"

    const builtInValue = getSuratBuiltInFieldValue(column, detail)
    if (builtInValue !== null) return builtInValue

    return formatCustomFieldValue(column, getCustomFieldValue(column, detail.customFields))
  }

  return (
    <div className="xl:hidden divide-y divide-slate-100 dark:divide-slate-800">
      {registers.map((reg: RegisterSurat) => (
        <div key={reg.id} className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
              <Checkbox
                checked={selectedIds.has(reg.id)}
                onCheckedChange={() => actions.toggleSelect(reg.id)}
                className="border-slate-300 dark:border-slate-600 rounded-sm"
              />
              <span className="font-mono text-[12px] font-bold text-blue-600 dark:text-blue-400">{reg.nomor}</span>
            </div>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0">{reg.dept.shortName}</span>
          </div>

          <div className={(reg.detailSurat ?? []).length > 1
            ? "rounded-lg border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden"
            : ""
          }>
            {(reg.detailSurat ?? []).map((detail: any) => {
              const detailDisplayColumns = (reg.dept.displayColumns ?? [])
                .filter((column: any) => !String(column.id).includes("default_nomor_register"))
              const primaryColumn = detailDisplayColumns[0]
              const primaryText = primaryColumn
                ? getColumnValue(primaryColumn, reg, detail)
                : detail.perihal
              return (
                <div
                  key={detail.id}
                  onClick={() => router.push(`${basePath}/view/${reg.deptId}/${reg.id}`)}
                  className="flex items-start gap-3 px-3 py-2.5 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer active:bg-blue-100/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-snug mb-1 break-words whitespace-normal">
                      {primaryText}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {detailDisplayColumns.slice(1).map((column: any) => (
                        <span key={column.id} className="text-[11px] text-slate-400 dark:text-slate-500">
                          <span className="text-slate-500 dark:text-slate-400">{column.label}: </span>
                          {getColumnValue(column, reg, detail)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <svg className="w-4 h-4 text-slate-300 dark:text-slate-600 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
