// src/domain/stats/repositories.ts

import type { DateRange, StatsQueryResult } from "./types"

export interface IStatsRepository {
  fetchAll(ranges: {
    period:    DateRange
    trend:     DateRange
    today:     DateRange
    yesterday: DateRange
  }): Promise<StatsQueryResult>
}