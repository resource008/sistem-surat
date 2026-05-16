// src/domain/stats/use-cases.ts

import { buildDailyChange, buildSuratPerDept, buildWeeklyTrend } from "./entities"
import type { IStatsRepository } from "./repositories"
import type { AdminStatsResult, Period } from "./types"
import { getDailyRanges, getPeriodRange, getTrendRange } from "./helpers"
import { getTrendBuckets } from "./trend-buckets"

export async function getAdminStats(
  period:     Period,
  repository: IStatsRepository,
): Promise<AdminStatsResult> {
  const periodRange          = getPeriodRange(period)
  const { today, yesterday } = getDailyRanges()
  const trendRange           = getTrendRange(period, periodRange.start)

  const raw = await repository.fetchAll({
    period:    periodRange,
    trend:     trendRange,
    today,
    yesterday,
  })

  const deptMap  = Object.fromEntries(raw.departments.map((d) => [d.id, d.shortName]))
  const deptKeys = raw.departments.map((d) => d.shortName)
  const buckets  = getTrendBuckets(period, periodRange.start, periodRange.end)

  return {
    totalUsers:  raw.totalUsers,
    usersByRole: Object.fromEntries(raw.usersByRole.map((u) => [u.role, u.count])),
    totalDept:   raw.totalDept,
    totalSurat:  raw.totalSurat,
    totalPI:     raw.totalPI,

    suratPerDept: buildSuratPerDept(raw.suratPerDept, deptMap),

    daily: buildDailyChange(
      raw.suratHariIni,
      raw.suratKemarin,
      raw.piHariIni,
      raw.piKemarin,
    ),

    weeklyTrend: buildWeeklyTrend(buckets, raw.suratTrend, raw.departments),

    deptKeys,
  }
}