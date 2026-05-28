import type { TipeWaktuStatistik } from "@/domain/admin-dashboard/types"

export const DEFAULT_STATS_DEPT_ID = "ENG"

export const STATISTIC_TIME_OPTIONS: { value: TipeWaktuStatistik; label: string }[] = [
  { value: "mingguan", label: "Mingguan" },
  { value: "bulanan",  label: "Bulanan" },
  { value: "tahunan",  label: "Tahunan" },
]

export const ACTIVITY_CARD_STYLES = [
  {
    gradient:  "from-sky-400 to-blue-500 dark:from-sky-700/60 dark:to-blue-800/60",
    iconBg:    "bg-blue-600/30",
    iconColor: "text-white",
  },
  {
    gradient:  "from-violet-400 to-purple-500 dark:from-violet-700/60 dark:to-purple-800/60",
    iconBg:    "bg-purple-600/30",
    iconColor: "text-white",
  },
  {
    gradient:  "from-emerald-400 to-teal-500 dark:from-emerald-700/60 dark:to-teal-800/60",
    iconBg:    "bg-teal-600/30",
    iconColor: "text-white",
  },
  {
    gradient:  "from-rose-400 to-pink-500 dark:from-rose-700/60 dark:to-pink-800/60",
    iconBg:    "bg-pink-600/30",
    iconColor: "text-white",
  },
] as const