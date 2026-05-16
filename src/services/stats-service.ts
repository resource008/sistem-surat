// src/services/stats.service.ts

import { parsePeriod } from "@/domain/stats/helpers"
import { getAdminStats } from "@/domain/stats/use-cases"
import type { AdminStatsResult } from "@/domain/stats/types"
import { StatsRepository } from "@/infrastructure/repositories/stats-repositories"

const repository = new StatsRepository()

export async function fetchAdminStats(rawPeriod: string | null): Promise<AdminStatsResult> {
  const period = parsePeriod(rawPeriod)
  return getAdminStats(period, repository)
}