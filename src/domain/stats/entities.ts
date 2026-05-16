// src/domain/stats/entities.ts

import type { DailyChange, DepartmentInfo, RawSuratTrend, SuratPerDept } from "./types"

export function buildDailyChange(
  suratHariIni: number,
  suratKemarin: number,
  piHariIni:    number,
  piKemarin:    number,
): DailyChange {
  const hariIni = suratHariIni + piHariIni
  const kemarin = suratKemarin + piKemarin

  return {
    hariIni,
    kemarin,
    changePercent:      calcChangePercent(hariIni,      kemarin),
    suratChangePercent: calcChangePercent(suratHariIni, suratKemarin),
    piChangePercent:    calcChangePercent(piHariIni,    piKemarin),
  }
}

export function buildSuratPerDept(
  raw:     { deptId: string; count: number }[],
  deptMap: Record<string, string>,
): SuratPerDept[] {
  return raw.map((s) => ({
    deptId:   s.deptId,
    deptName: deptMap[s.deptId] ?? s.deptId,
    count:    s.count,
  }))
}

export function buildWeeklyTrend(
  buckets:     { label: string; start: Date; end: Date }[],
  suratTrend:  RawSuratTrend[],
  departments: DepartmentInfo[],
): Record<string, string | number>[] {
  return buckets.map(({ label, start, end }) => {
    const bucket: Record<string, string | number> = { label }

    for (const dept of departments) {
      bucket[dept.shortName] = suratTrend.filter((s) => {
        const d = new Date(s.tanggalTerima)
        return s.deptId === dept.id && d >= start && d <= end
      }).length
    }

    return bucket
  })
}

// ── Private ───────────────────────────────────────────────────────────────────

function calcChangePercent(today: number, yesterday: number): number | null {
  if (yesterday > 0) return Math.round(((today - yesterday) / yesterday) * 100)
  if (today > 0)     return 100
  return null
}