import type { TipeWaktuStatistik } from "@/domain/admin-dashboard/types"

export const DEFAULT_STATS_DEPT_ID = ""

export const STATISTIC_TIME_OPTIONS: { value: TipeWaktuStatistik; label: string }[] = [
  { value: "mingguan", label: "Mingguan" },
  { value: "bulanan",  label: "Bulanan" },
  { value: "tahunan",  label: "Tahunan" },
]

export const ACTIVITY_CARD_STYLES = [
  {
    surface:   "bg-sky-600 dark:bg-sky-700",
    iconBg:    "bg-white/15",
    iconColor: "text-white",
  },
  {
    surface:   "bg-indigo-600 dark:bg-indigo-700",
    iconBg:    "bg-white/15",
    iconColor: "text-white",
  },
  {
    surface:   "bg-emerald-600 dark:bg-emerald-700",
    iconBg:    "bg-white/15",
    iconColor: "text-white",
  },
  {
    surface:   "bg-rose-600 dark:bg-rose-700",
    iconBg:    "bg-white/15",
    iconColor: "text-white",
  },
] as const
