// src/domain/stats/helpers.ts
//
// Pure date-math helpers. No Prisma, no HTTP — only Date arithmetic.

import type { DateRange, Period } from "./types"
import { VALID_PERIODS } from "./types"

export function parsePeriod(raw: string | null): Period {
  return VALID_PERIODS.has(raw as Period) ? (raw as Period) : "tahun_ini"
}

export function getPeriodRange(period: Period): DateRange {
  const end   = new Date()
  const start = new Date(end)
  start.setHours(0, 0, 0, 0)

  if (period === "minggu_ini") {
    const day = start.getDay()
    start.setDate(start.getDate() + (day === 0 ? -6 : 1 - day)) // back to Monday
  } else if (period === "bulan_ini") {
    start.setDate(1)
  } else if (period === "tahun_ini") {
    start.setMonth(0, 1)
  }
  // "hari_ini" → no adjustment

  return { start, end }
}

export function getTrendRange(period: Period, periodStart: Date): DateRange {
  // For tahun_ini we show last 8 weeks instead of the full year
  if (period === "tahun_ini") {
    const start = new Date()
    start.setDate(start.getDate() - 7 * 8)
    return { start, end: new Date() }
  }
  return { start: periodStart, end: new Date() }
}

export function getDailyRanges(): { today: DateRange; yesterday: DateRange } {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const startOfYesterday = new Date(startOfToday)
  startOfYesterday.setDate(startOfToday.getDate() - 1)

  const endOfYesterday = new Date(startOfToday)
  endOfYesterday.setMilliseconds(-1)

  return {
    today:     { start: startOfToday,     end: new Date() },
    yesterday: { start: startOfYesterday, end: endOfYesterday },
  }
}