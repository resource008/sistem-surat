import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { DEPT_COLORS } from "../constants"
import { getPeriodLabel } from "../helpers"
import { SuratPerDept, Period } from "../types"

interface DeptSuratCardsProps {
  data: SuratPerDept[]
  period: Period
}

export function DeptSuratCards({ data, period }: DeptSuratCardsProps) {
  const periodLabel = getPeriodLabel(period)
  const sorted = [...data].sort((a, b) => b.count - a.count)
  const total = sorted.reduce((sum, d) => sum + d.count, 0)

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-muted-foreground/30 py-12 text-sm text-muted-foreground">
        Belum ada data surat
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {sorted.map((item, idx) => {
        const color = DEPT_COLORS[idx % DEPT_COLORS.length]
        const pct = total > 0 ? Math.round((item.count / total) * 100) : 0

        return (
          <Card key={item.deptId} className="relative overflow-hidden transition-shadow hover:shadow-md duration-200">
            <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" style={{ backgroundColor: color }} />
            <CardHeader className="pb-1 pl-5">
              <CardTitle className="text-xs font-medium text-muted-foreground truncate">
                {item.deptName}
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-5">
              <div className="text-2xl font-bold tracking-tight">
                {item.count.toLocaleString("id-ID")}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">Surat masuk {periodLabel.toLowerCase()}</p>
              <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 text-right">{pct}% dari total</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}