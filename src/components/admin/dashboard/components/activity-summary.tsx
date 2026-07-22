import { Card, CardContent } from "@/components/ui/card"
import { ACTIVITY_CARD_STYLES } from "@/constants/admin-dashboard"
import type { DashboardStatsResult } from "@/domain/admin-dashboard/types"
import { formatNumber } from "@/lib/admin-dashboard"
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CircleUserRound,
  Inbox,
  Minus,
} from "lucide-react"
import type { ElementType } from "react"

interface ActivitySummaryProps {
  aktivitas: DashboardStatsResult["aktivitas"]
}

interface ActivityCardProps {
  title: string
  value: number
  icon: ElementType
  surface: string
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
  surface,
  iconBg,
  iconColor,
  changePercent,
}: ActivityCardProps) {
  return (
    <Card className={`border-0 ${surface} shadow-sm ring-0 dark:shadow-none`}>
      <CardContent className="flex h-full min-h-[160px] flex-col p-4 sm:p-5">
        <div className="flex w-full items-start justify-between gap-3">
          <div className={`-mt-1 flex size-9 items-center justify-center rounded-xl sm:size-10 ${iconBg}`}>
            <Icon className={`size-4 sm:size-5 ${iconColor}`} />
          </div>
          {changePercent !== undefined && <ChangeBadge value={changePercent} />}
        </div>
        <div className="mt-auto flex w-full translate-y-1 flex-col gap-1 sm:translate-y-1.5">
          <span className="text-2xl font-bold tracking-tight text-white drop-shadow-sm sm:text-3xl">
            {formatNumber(value)}
          </span>
          <span className="text-sm font-medium text-white/90 drop-shadow-sm sm:text-base">
            {title}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function ActivitySummary({ aktivitas }: ActivitySummaryProps) {
  return (
    <div className="grid h-full grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-3">
      <ActivityCard
        title="Jumlah Pengguna"
        value={aktivitas.jumlahAkun}
        icon={CircleUserRound}
        surface={ACTIVITY_CARD_STYLES[0].surface}
        iconBg={ACTIVITY_CARD_STYLES[0].iconBg}
        iconColor={ACTIVITY_CARD_STYLES[0].iconColor}
      />
      <ActivityCard
        title="Total Departemen"
        value={aktivitas.totalDepartemen}
        icon={Building2}
        surface={ACTIVITY_CARD_STYLES[1].surface}
        iconBg={ACTIVITY_CARD_STYLES[1].iconBg}
        iconColor={ACTIVITY_CARD_STYLES[1].iconColor}
      />
      <ActivityCard
        title="Total Surat Masuk"
        value={aktivitas.totalSuratMasuk}
        icon={Inbox}
        surface={ACTIVITY_CARD_STYLES[2].surface}
        iconBg={ACTIVITY_CARD_STYLES[2].iconBg}
        iconColor={ACTIVITY_CARD_STYLES[2].iconColor}
        changePercent={aktivitas.perubahanSuratMasuk}
      />
    </div>
  )
}
