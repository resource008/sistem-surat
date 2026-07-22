import { RegisterSurat } from "@/components/surat/shared"
import { Checkbox } from "@/components/ui/checkbox"
import { getSuratColumnValue, getSuratDisplayColumns, getSuratDisplayParts, getSuratDisplayTitle } from "@/lib/surat-display"
import { useRouter } from "next/navigation"

export function MobileList({ registers, selectedIds, basePath, actions }: any) {
  const router = useRouter()
  const getDepartmentPathSegment = (reg: RegisterSurat) => encodeURIComponent(reg.dept?.shortName || reg.deptId)

  return (
    <div className="xl:hidden divide-y divide-slate-100 dark:divide-slate-800">
      {registers.map((reg: RegisterSurat) => {
        const displayParts = getSuratDisplayParts(reg, 2)
        const [primaryPart, secondaryPart] = displayParts

        return (
        <div key={reg.id} className="px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2" onClick={e => e.stopPropagation()}>
              <Checkbox
                checked={selectedIds.has(reg.id)}
                onCheckedChange={() => actions.toggleSelect(reg.id)}
                className="border-slate-300 dark:border-slate-600 rounded-sm"
              />
              <span className="truncate text-[12px] font-bold text-blue-600 dark:text-blue-400">
                {primaryPart?.value ?? getSuratDisplayTitle(reg)}
              </span>
            </div>
            {secondaryPart ? (
              <span className="shrink-0 truncate text-[11px] text-slate-400 dark:text-slate-500">
                {secondaryPart.value}
              </span>
            ) : null}
          </div>

          <div className={(reg.detailSurat ?? []).length > 1
            ? "rounded-lg border border-slate-100 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden"
            : ""
          }>
            {(reg.detailSurat ?? []).map((detail: any) => {
              const detailDisplayColumns = getSuratDisplayColumns(reg)
              const primaryColumn = detailDisplayColumns[0]
              const primaryText = primaryColumn
                ? getSuratColumnValue(primaryColumn, reg, detail)
                : detail.perihal
              return (
                <div
                  key={detail.id}
                  onClick={() => router.push(`${basePath}/view/${getDepartmentPathSegment(reg)}/${reg.id}`)}
                  className="flex items-start gap-3 px-3 py-2.5 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 cursor-pointer active:bg-blue-100/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-snug mb-1 break-words whitespace-pre-line">
                      {primaryText}
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                      {detailDisplayColumns.slice(1).map((column: any) => (
                        <span key={column.id} className="whitespace-pre-line text-[11px] text-slate-400 dark:text-slate-500">
                          <span className="text-slate-500 dark:text-slate-400">{column.label}: </span>
                          {getSuratColumnValue(column, reg, detail)}
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
        )
      })}
    </div>
  )
}
