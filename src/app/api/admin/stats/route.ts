// src/app/api/admin/stats/route.ts
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { auth } from "@/infrastructure/auth/better-auth"
import { headers } from "next/headers"

type Period = "hari_ini" | "minggu_ini" | "bulan_ini" | "tahun_ini"

function getDateRange(period: Period): { start: Date; end: Date } {
  const now = new Date()
  const end = new Date(now)

  const start = new Date(now)
  start.setHours(0, 0, 0, 0)

  if (period === "hari_ini") {
    // dari 00:00 hari ini sampai sekarang
  } else if (period === "minggu_ini") {
    // Senin s.d. hari ini
    const day = start.getDay() // 0=Sun, 1=Mon, …
    const diffToMonday = (day === 0 ? -6 : 1 - day)
    start.setDate(start.getDate() + diffToMonday)
  } else if (period === "bulan_ini") {
    start.setDate(1)
  } else if (period === "tahun_ini") {
    start.setMonth(0, 1)
  }

  return { start, end }
}

function getTrendBuckets(period: Period, start: Date, end: Date) {
  const buckets: { label: string; start: Date; end: Date }[] = []

  if (period === "hari_ini") {
    // Per jam 08:00 – 20:00
    for (let h = 8; h <= 20; h++) {
      const s = new Date(start)
      s.setHours(h, 0, 0, 0)
      const e = new Date(start)
      e.setHours(h, 59, 59, 999)
      buckets.push({
        label: `${String(h).padStart(2, "0")}:00`,
        start: s,
        end: e,
      })
    }
  } else if (period === "minggu_ini") {
    // Per hari Senin–Jumat (5 hari kerja)
    const DAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"]
    for (let d = 0; d < 5; d++) { // Ubah dari 7 menjadi 5
      const s = new Date(start)
      s.setDate(start.getDate() + d)
      const e = new Date(s)
      e.setHours(23, 59, 59, 999)
      buckets.push({ label: DAYS[s.getDay()], start: s, end: e })
    }
  } else if (period === "bulan_ini") {
    let cur = new Date(start)
    let weekNum = 1
    while (cur < end) {
      const s = new Date(cur)
      const e = new Date(cur)
      e.setDate(cur.getDate() + 6)
      if (e > end) e.setTime(end.getTime())
      buckets.push({ label: `Mg ${weekNum}`, start: s, end: e })
      cur.setDate(cur.getDate() + 7)
      weekNum++
    }
  } else if (period === "tahun_ini") {
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Ags", "Sep", "Okt", "Nov", "Des"]
    const currentYear = start.getFullYear()
    for (let m = 0; m < 12; m++) {
      const s = new Date(currentYear, m, 1)
      const e = new Date(currentYear, m + 1, 0, 23, 59, 59, 999)
      buckets.push({ label: MONTHS[m], start: s, end: e })
    }
  }

  return buckets
}

export async function GET(req: NextRequest) {
  try {
    // ── Auth check ────────────────────────────────────────────────
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    // ── Parse period ──────────────────────────────────────────────
    const searchParams = req.nextUrl.searchParams
    const rawPeriod = searchParams.get("period") ?? "tahun_ini"
    const period: Period = ["hari_ini", "minggu_ini", "bulan_ini", "tahun_ini"].includes(
      rawPeriod
    )
      ? (rawPeriod as Period)
      : "tahun_ini"

    const { start: periodStart, end: periodEnd } = getDateRange(period)

    // ── Range: hari ini & kemarin ─────────────────────────────────
    const now = new Date()
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)

    const startOfYesterday = new Date(startOfToday)
    startOfYesterday.setDate(startOfToday.getDate() - 1)

    const endOfYesterday = new Date(startOfToday)
    endOfYesterday.setMilliseconds(-1)

    // ── Range tren: sesuai period ─────────────────────────────────
    const trendStart =
      period === "tahun_ini"
        ? (() => {
            const d = new Date(startOfToday)
            d.setDate(d.getDate() - 7 * 8)
            return d
          })()
        : periodStart

    // ── Query paralel ─────────────────────────────────────────────
    const [
      totalUsers,
      usersByRole,
      totalDept,
      totalSurat,
      totalPI,
      suratPerDept,
      suratHariIni,
      suratKemarin,
      piHariIni,
      piKemarin,
      suratTrend,
      departments,
    ] = await Promise.all([
      prisma.user.count(),

      prisma.user.groupBy({ by: ["role"], _count: { id: true } }),

      prisma.department.count({ where: { isActive: true } }),

      prisma.registerSurat.count(),

      prisma.registerPI.count(),

      // Surat per departemen dalam period yang dipilih
      prisma.registerSurat.groupBy({
        by: ["deptId"],
        _count: { id: true },
        where: { tanggalTerima: { gte: periodStart, lte: periodEnd } },
      }),

      prisma.registerSurat.count({
        where: { tanggalTerima: { gte: startOfToday } },
      }),

      prisma.registerSurat.count({
        where: { tanggalTerima: { gte: startOfYesterday, lte: endOfYesterday } },
      }),

      prisma.registerPI.count({
        where: { tanggalTerima: { gte: startOfToday } },
      }),

      prisma.registerPI.count({
        where: { tanggalTerima: { gte: startOfYesterday, lte: endOfYesterday } },
      }),

      // Surat untuk trend
      prisma.registerSurat.findMany({
        where: { tanggalTerima: { gte: trendStart } },
        select: { tanggalTerima: true, deptId: true },
      }),

      prisma.department.findMany({
        where: { isActive: true },
        select: { id: true, shortName: true },
      }),
    ])

    // ── Build maps ────────────────────────────────────────────────
    const deptMap = Object.fromEntries(departments.map((d) => [d.id, d.shortName]))
    const deptKeys = departments.map((d) => d.shortName)

    // ── Daily change ──────────────────────────────────────────────
    const totalHariIni = suratHariIni + piHariIni
    const totalKemarin = suratKemarin + piKemarin
    
    // 1. Perhitungan Gabungan (Total Surat + PI)
    let dailyChangePercent: number | null = null
    if (totalKemarin > 0) {
      dailyChangePercent = Math.round(
        ((totalHariIni - totalKemarin) / totalKemarin) * 100
      )
    } else if (totalHariIni > 0) {
      dailyChangePercent = 100
    }

    // 2. Perhitungan Spesifik Surat Saja
    let suratChangePercent: number | null = null
    if (suratKemarin > 0) {
      suratChangePercent = Math.round(
        ((suratHariIni - suratKemarin) / suratKemarin) * 100
      )
    } else if (suratHariIni > 0) {
      suratChangePercent = 100
    }

    // 3. Perhitungan Spesifik PI Saja
    let piChangePercent: number | null = null
    if (piKemarin > 0) {
      piChangePercent = Math.round(
        ((piHariIni - piKemarin) / piKemarin) * 100
      )
    } else if (piHariIni > 0) {
      piChangePercent = 100
    }

    // ── Tren mingguan per departemen ──────────────────────────────
    const buckets = getTrendBuckets(period, periodStart, periodEnd)

    const weeklyBuckets: Record<string, string | number>[] = buckets.map(
      ({ label, start: bs, end: be }) => {
        const bucket: Record<string, string | number> = { label }
        for (const dept of departments) {
          bucket[dept.shortName] = suratTrend.filter((s) => {
            const d = new Date(s.tanggalTerima)
            return s.deptId === dept.id && d >= bs && d <= be
          }).length
        }
        return bucket
      }
    )

    // ── Surat per dept formatted ──────────────────────────────────
    const suratPerDeptFormatted = suratPerDept.map((s) => ({
      deptId:   s.deptId,
      deptName: deptMap[s.deptId] ?? s.deptId,
      count:    s._count.id,
    }))

    const usersByRoleFormatted = Object.fromEntries(
      usersByRole.map((u) => [u.role, u._count.id])
    )

    return NextResponse.json({
      totalUsers,
      usersByRole: usersByRoleFormatted,
      totalDept,
      totalSurat,
      totalPI,
      suratPerDept: suratPerDeptFormatted,
      daily: {
        hariIni:            totalHariIni,
        kemarin:            totalKemarin,
        changePercent:      dailyChangePercent, // Gabungan
        suratChangePercent: suratChangePercent, // Spesifik Surat
        piChangePercent:    piChangePercent,    // Spesifik PI
      },
      weeklyTrend: weeklyBuckets,
      deptKeys,
    })
  } catch (error: any) {
    console.error("GET /api/admin/stats error:", error.message)
    return NextResponse.json(
      { error: "Gagal mengambil statistik" },
      { status: 500 }
    )
  }
}