import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ASAL_DEFAULT_ID,
  NOMOR_DEFAULT_ID,
  TANGGAL_DEFAULT_ID,
} from "@/constants/departemen-columns"
import { formatCustomFieldValue, getCustomFieldValue, getSuratBuiltInFieldValue, isTujuanColumn } from "@/domain/surat/custom-fields"
import { useRouter } from "next/navigation"

export function DesktopTable({ registers, selectedIds, basePath, actions }: any) {
  const router = useRouter()
  const displayColumns = (registers[0]?.dept?.displayColumns ?? [])
  const detailDisplayColumns = displayColumns
    .filter((column: any) => !String(column.id).includes(NOMOR_DEFAULT_ID))

  const getColumnValue = (column: any, reg: any, detail: any) => {
    if (String(column.id).includes(TANGGAL_DEFAULT_ID)) {
      return formatCustomFieldValue({ ...column, type: "date" }, reg.tanggalTerima)
    }
    if (String(column.id).includes(ASAL_DEFAULT_ID)) return reg.asalSurat || "-"
    if (isTujuanColumn(column)) return detail.tujuan || reg.dept.shortName || "-"

    const builtInValue = getSuratBuiltInFieldValue(column, detail)
    if (builtInValue !== null) return builtInValue

    return formatCustomFieldValue(column, getCustomFieldValue(column, detail.customFields))
  }

  return (
    <div className="hidden xl:block overflow-x-auto">
      <Table className="border-collapse w-full">
        <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-12 border-r border-slate-200 dark:border-slate-800 p-0" />
            <TableHead className="w-36 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-[0px] px-4 border-r border-slate-200 dark:border-slate-800">Nomor Reg</TableHead>
            {detailDisplayColumns.map((column: any) => (
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

            return details.map((detail: any, idx: number) => {
              const isFirst = idx === 0
              const isLast = idx === details.length - 1
              const isAbsoluteLast = isLastReg && isLast
              const innerBorder = isAbsoluteLast ? "" : isLast ? "border-b border-b-slate-200 dark:border-b-slate-800" : "border-b border-b-slate-100 dark:border-b-slate-800/50"
              const spanBorder = !isLastReg ? "border-b border-b-slate-200 dark:border-b-slate-800" : ""

              return (
                <TableRow
                  key={detail.id}
                  onClick={() => router.push(`${basePath}/view/${reg.deptId}/${reg.id}`)}
                  className="cursor-pointer hover:bg-blue-50/50 dark:hover:bg-blue-900/20 transition-all group"
                >
                  {isFirst && (
                    <TableCell rowSpan={details.length} onClick={e => e.stopPropagation()} className={`w-12 p-0 border-r border-r-slate-200 dark:border-r-slate-800 align-middle ${spanBorder}`}>
                      <div className="flex items-center justify-center w-full">
                        <Checkbox checked={selectedIds.has(reg.id)} onCheckedChange={() => actions.toggleSelect(reg.id)} className="border-slate-300 dark:border-slate-600 rounded-sm" />
                      </div>
                    </TableCell>
                  )}
                  {isFirst && (
                    <TableCell rowSpan={details.length} className={`py-4 px-4 border-r border-r-slate-200 dark:border-r-slate-800 align-middle ${spanBorder}`}>
                      <span className="font-mono text-[12px] font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{reg.nomor}</span>
                    </TableCell>
                  )}
                  {detailDisplayColumns.map((column: any) => {
                    if (isTujuanColumn(column)) {
                      if (!isFirst) return null

                      return (
                        <TableCell
                          key={column.id}
                          rowSpan={details.length}
                          className={`py-3 px-4 border-r border-r-slate-200 dark:border-r-slate-800 align-middle text-[13px] text-slate-500 dark:text-slate-400 ${spanBorder}`}
                        >
                          {getColumnValue(column, reg, detail)}
                        </TableCell>
                      )
                    }

                    return (
                      <TableCell key={column.id} className={`py-3 px-4 border-r border-r-slate-200 dark:border-r-slate-800 text-[13px] text-slate-500 dark:text-slate-400 ${innerBorder}`}>
                        {getColumnValue(column, reg, detail)}
                      </TableCell>
                    )
                  })}
                </TableRow>
              )
            })
          })}
        </TableBody>
      </Table>
    </div>
  )
}
