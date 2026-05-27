import { Card, CardContent } from "@/components/ui/card"
import type { SuratPerDepartemen } from "@/domain/admin-dashboard/types"
import { formatNumber } from "@/lib/admin-dashboard"

interface SuratPerDepartemenTableProps {
  data: SuratPerDepartemen[]
}

const ROW_COLORS = [
  "bg-amber-50   dark:bg-amber-400/10",
  "bg-emerald-50 dark:bg-emerald-400/10",
  "bg-rose-50    dark:bg-rose-400/10",
  "bg-cyan-50    dark:bg-cyan-400/10",
  "bg-violet-50  dark:bg-violet-400/10",
  "bg-fuchsia-50 dark:bg-fuchsia-400/10",
]

export function SuratPerDepartemenTable({ data }: SuratPerDepartemenTableProps) {
  return (
    <Card className="overflow-hidden rounded-xl">
      <CardContent className="p-4 sm:p-5">
        {/* Header */}
        <div className="grid grid-cols-[1fr_64px_72px] px-2 pb-2.5 text-xs font-medium tracking-wide text-muted-foreground sm:grid-cols-[1fr_80px_80px] sm:px-3">
          <div>Departemen</div>
          <div>Jumlah</div>
          <div>Dalam %</div>
        </div>

        {/* Rows */}
        <div className="max-h-[360px] space-y-1.5 overflow-y-auto pr-0.5">
          {data.map((item, index) => (
            <div
              key={item.departemenId}
              className={`grid grid-cols-[1fr_64px_72px] rounded-lg px-2 py-2 text-sm sm:grid-cols-[1fr_80px_80px] sm:px-3 sm:py-2.5 ${
                ROW_COLORS[index % ROW_COLORS.length]
              }`}
            >
              <div className="font-medium text-foreground">{item.departemen}</div>
              <div className="text-foreground/70">{formatNumber(item.jumlah)}</div>
              <div className="text-foreground/70">{item.persen}%</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}