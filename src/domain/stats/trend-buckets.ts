// src/domain/stats/trend-buckets.ts
//
// Builds the time-axis buckets used for the weekly trend chart.
// Each bucket has a label, start, and end date.

import type { Period, TrendBucket } from "./types"

const DAYS   = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"] as const
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"] as const

export function getTrendBuckets(period: Period, start: Date, end: Date): TrendBucket[] {
  if (period === "hari_ini")   return buildHourlyBuckets(start)
  if (period === "minggu_ini") return buildDailyBuckets(start)
  if (period === "bulan_ini")  return buildWeeklyBuckets(start, end)
  return buildMonthlyBuckets(start)
}

// ── Builders ──────────────────────────────────────────────────────────────────

function buildHourlyBuckets(start: Date): TrendBucket[] {
  // 08:00 – 20:00 (13 buckets)
  return Array.from({ length: 13 }, (_, i) => {
    const hour = 8 + i
    const s    = new Date(start); s.setHours(hour, 0, 0, 0)
    const e    = new Date(start); e.setHours(hour, 59, 59, 999)
    return { label: `${String(hour).padStart(2, "0")}:00`, start: s, end: e }
  })
}

function buildDailyBuckets(start: Date): TrendBucket[] {
  // Monday – Friday (5 working days)
  return Array.from({ length: 5 }, (_, d) => {
    const s = new Date(start); s.setDate(start.getDate() + d)
    const e = new Date(s);     e.setHours(23, 59, 59, 999)
    return { label: DAYS[s.getDay()], start: s, end: e }
  })
}

function buildWeeklyBuckets(start: Date, end: Date): TrendBucket[] {
  const buckets: TrendBucket[] = []
  let   cur     = new Date(start)
  let   weekNum = 1

  while (cur < end) {
    const s = new Date(cur)
    const e = new Date(cur); e.setDate(cur.getDate() + 6)
    if (e > end) e.setTime(end.getTime())
    buckets.push({ label: `Mg ${weekNum}`, start: s, end: e })
    cur.setDate(cur.getDate() + 7)
    weekNum++
  }

  return buckets
}

function buildMonthlyBuckets(start: Date): TrendBucket[] {
  const year = start.getFullYear()
  return Array.from({ length: 12 }, (_, m) => ({
    label: MONTHS[m],
    start: new Date(year, m, 1),
    end:   new Date(year, m + 1, 0, 23, 59, 59, 999),
  }))
}