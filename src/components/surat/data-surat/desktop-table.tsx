import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

export function DesktopTable({ registers, showPI, selectedIds, basePath, actions }: any) {
  const router = useRouter()

  return (
    <div className="hidden xl:block overflow-x-auto">
      <Table className="border-collapse w-full">
        <TableHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className="w-12 border-r border-slate-200 dark:border-slate-800 p-0" />
            <TableHead className="w-36 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800">Nomor Reg</TableHead>
            {showPI ? (
              <>
                <TableHead className="min-w-[140px] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800">Nama Supplier</TableHead>
                <TableHead className="w-36 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800">No. Invoice</TableHead>
                <TableHead className="w-40 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800">No. Surat</TableHead>
                <TableHead className="w-28 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Tujuan</TableHead>
              </>
            ) : (
              <>
                <TableHead className="min-w-[140px] text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800">Perihal</TableHead>
                <TableHead className="w-28 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4 border-r border-slate-200 dark:border-slate-800 text-center">Lampiran</TableHead>
                <TableHead className="w-28 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest px-4">Tujuan</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {registers.map((reg: any, regIdx: number) => {
            const isLastReg = regIdx === registers.length - 1
            const details = showPI ? (reg.detailPI ?? []) : (reg.detailSurat ?? [])
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
                  <TableCell className={`py-3 px-4 border-r border-r-slate-200 dark:border-r-slate-800 text-[13px] text-slate-600 dark:text-slate-300 font-medium leading-relaxed whitespace-normal break-words min-w-[140px] ${innerBorder}`}>
                    {showPI ? (detail.namaSupplier ?? "-") : detail.perihal}
                  </TableCell>
                  <TableCell className={`py-3 px-4 border-r border-r-slate-200 dark:border-r-slate-800 text-[13px] ${showPI ? 'text-slate-500 dark:text-slate-400' : 'text-center font-medium text-slate-400 dark:text-slate-500'} ${innerBorder}`}>
                    {showPI ? (detail.noInvoice ?? "-") : (detail.lampiran ?? "-")}
                  </TableCell>
                  <TableCell className={`py-3 px-4 ${showPI ? 'border-r border-r-slate-200 dark:border-r-slate-800 text-[13px] text-slate-500 dark:text-slate-400' : 'text-[13px] text-slate-500 dark:text-slate-400'} ${innerBorder}`}>
                    {showPI ? (detail.nomorSurat ?? "-") : reg.dept.shortName}
                  </TableCell>
                  {showPI && isFirst && (
                    <TableCell rowSpan={details.length} className={`py-4 px-4 align-middle text-[13px] text-slate-500 dark:text-slate-400 ${spanBorder}`}>
                      {detail.tujuan ?? reg.dept.shortName}
                    </TableCell>
                  )}
                </TableRow>
              )
            })
          })}
        </TableBody>
      </Table>
    </div>
  )
}