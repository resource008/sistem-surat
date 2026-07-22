import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  getSuratColumnGroupValue,
  getSuratColumnValue,
  getSuratDetailGroupCount,
  getSuratDisplayColumns,
  isSuratGroupedColumn,
} from "@/lib/surat-display"
import { useRouter } from "next/navigation"

export function DesktopTable({ registers, selectedIds, basePath, actions }: any) {
  const router = useRouter()
  const displayColumns = getSuratDisplayColumns(registers[0])
  const getDepartmentPathSegment = (reg: any) => encodeURIComponent(reg.dept?.shortName || reg.deptId)

  return (
    <div className="hidden xl:block overflow-x-auto">
      <Table className="border-collapse w-full">
        <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-12 border-r border-slate-200 dark:border-slate-800 p-0" />
            {displayColumns.map((column: any) => (
              <TableHead key={column.id} className="min-w-[140px] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0px] px-4 border-r border-slate-200 dark:border-slate-800">
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {registers.map((reg: any, regIdx: number) => {
            const isLastReg = regIdx === registers.length - 1
            const details = reg.detailSurat ?? []
            if (details.length === 0) return null
            const detailRowCounts = details.map((detail: any) => getSuratDetailGroupCount(detail))

            return details.flatMap((detail: any, idx: number) => {
              const detailGroupCount = detailRowCounts[idx] ?? 1
              const groupedColumns = displayColumns.filter((column: any) => isSuratGroupedColumn(column, reg, detail))
              const hasGroupedColumns = groupedColumns.length > 0
              const groupRows = Array.from({ length: hasGroupedColumns ? detailGroupCount : 1 })

              return groupRows.map((_, groupIndex) => {
              const isLast = idx === details.length - 1
              const isLastGroup = groupIndex === groupRows.length - 1
              const isAbsoluteLast = isLastReg && isLast && isLastGroup
              const innerBorder = isAbsoluteLast ? "" : isLast ? "border-b border-b-slate-200 dark:border-b-slate-800" : "border-b border-b-slate-100 dark:border-b-slate-800/50"
              const rowKey = `${detail.id}-${groupIndex}`

              return (
                <TableRow
                  key={rowKey}
                  onClick={() => router.push(`${basePath}/view/${getDepartmentPathSegment(reg)}/${reg.id}`)}
                  className="cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
                >
                  <TableCell onClick={e => e.stopPropagation()} className={`w-12 p-0 border-r border-r-slate-200 dark:border-r-slate-800 align-middle ${innerBorder}`}>
                    <div className="flex items-center justify-center w-full">
                      <Checkbox checked={selectedIds.has(reg.id)} onCheckedChange={() => actions.toggleSelect(reg.id)} className="border-slate-300 dark:border-slate-600 rounded-sm" />
                    </div>
                  </TableCell>
                  {displayColumns.map((column: any) => (
                    <TableCell key={column.id} className={`whitespace-pre-line py-3 px-4 border-r border-r-slate-200 dark:border-r-slate-800 text-[13px] text-slate-500 dark:text-slate-400 ${innerBorder}`}>
                      {hasGroupedColumns && isSuratGroupedColumn(column, reg, detail)
                        ? getSuratColumnGroupValue(column, reg, detail, groupIndex)
                        : getSuratColumnValue(column, reg, detail)}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
            })
          })}
        </TableBody>
      </Table>
    </div>
  )
}
