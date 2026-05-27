import type { ElementType } from "react"
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CircleUserRound,
  FileText,
  Inbox,
  Minus,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { DashboardStatsResult } from "@/domain/admin-dashboard/types"
import { ACTIVITY_CARD_STYLES } from "@/constants/admin-dashboard"
import { formatNumber } from "@/lib/admin-dashboard"

interface ActivitySummaryProps {
  aktivitas: DashboardStatsResult["aktivitas"]
}

interface ActivityCardProps {
  title: string
  value: number
  icon: ElementType
  gradient: string
  iconBg: string
  iconColor: string
  changePercent?: number | null
}

function ChangeBadge({ value }: { value?: number | null }) {
  if (value === undefined) return null

  const isNeutral = value === null || value === 0
  const isUp      = value !== null && value > 0
  const Icon      = isNeutral ? Minus : isUp ? ArrowUpRight : ArrowDownRight
  const label     = value === null ? "0%" : `${Math.abs(value)}%`

  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white/90 backdrop-blur-sm">
      <Icon className="size-3 shrink-0" />
      <span>{label}</span>
    </div>
  )
}

function ActivityCard({
  title,
  value,
  icon: Icon,
  gradient,
  iconBg,
  iconColor,
  changePercent,
}: ActivityCardProps) {
  return (
    <Card className={`border-0 bg-gradient-to-br ${gradient} shadow-sm ring-0 dark:shadow-none`}>
      <CardContent className="flex h-full min-h-[160px] flex-col justify-between p-4 sm:p-5">
        <div className={`flex size-9 items-center justify-center rounded-xl sm:size-10 ${iconBg}`}>
          <Icon className={`size-4 sm:size-5 ${iconColor}`} />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
            {formatNumber(value)}
          </span>
          <div className="flex flex-wrap items-center justify-between gap-1.5">
            <span className="text-sm font-medium text-white/90 drop-shadow-sm sm:text-base">
              {title}
            </span>
            {changePercent !== undefined && <ChangeBadge value={changePercent} />}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function ActivitySummary({ aktivitas }: ActivitySummaryProps) {
  return (
    <div className="grid h-full grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-rows-2">
      <ActivityCard
        title="Jumlah akun"
        value={aktivitas.jumlahAkun}
        icon={CircleUserRound}
        gradient={ACTIVITY_CARD_STYLES[0].gradient}
        iconBg={ACTIVITY_CARD_STYLES[0].iconBg}
        iconColor={ACTIVITY_CARD_STYLES[0].iconColor}
      />
      <ActivityCard
        title="Total departemen"
        value={aktivitas.totalDepartemen}
        icon={Building2}
        gradient={ACTIVITY_CARD_STYLES[1].gradient}
        iconBg={ACTIVITY_CARD_STYLES[1].iconBg}
        iconColor={ACTIVITY_CARD_STYLES[1].iconColor}
      />
      <ActivityCard
        title="Total Surat Masuk"
        value={aktivitas.totalSuratMasuk}
        icon={Inbox}
        gradient={ACTIVITY_CARD_STYLES[2].gradient}
        iconBg={ACTIVITY_CARD_STYLES[2].iconBg}
        iconColor={ACTIVITY_CARD_STYLES[2].iconColor}
        changePercent={aktivitas.perubahanSuratMasuk}
      />
      <ActivityCard
        title="Total PI"
        value={aktivitas.totalSuratPI}
        icon={FileText}
        gradient={ACTIVITY_CARD_STYLES[3].gradient}
        iconBg={ACTIVITY_CARD_STYLES[3].iconBg}
        iconColor={ACTIVITY_CARD_STYLES[3].iconColor}
        changePercent={aktivitas.perubahanSuratPI}
      />
    </div>
  )
}