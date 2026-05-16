// src/infrastructure/repositories/stats-repository.ts

import type { IStatsRepository } from "@/domain/stats/repositories"
import type { DateRange, StatsQueryResult } from "@/domain/stats/types"
import { prisma } from "@/infrastructure/databases/prisma-client"

export class StatsRepository implements IStatsRepository {
  async fetchAll(ranges: {
    period:    DateRange
    trend:     DateRange
    today:     DateRange
    yesterday: DateRange
  }): Promise<StatsQueryResult> {
    const { period, trend, today, yesterday } = ranges

    const [
      totalUsers,
      usersByRoleRaw,
      totalDept,
      totalSurat,
      totalPI,
      suratPerDeptRaw,
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

      prisma.registerSurat.groupBy({
        by:    ["deptId"],
        _count: { id: true },
        where: { tanggalTerima: { gte: period.start, lte: period.end } },
      }),

      prisma.registerSurat.count({
        where: { tanggalTerima: { gte: today.start } },
      }),

      prisma.registerSurat.count({
        where: { tanggalTerima: { gte: yesterday.start, lte: yesterday.end } },
      }),

      prisma.registerPI.count({
        where: { tanggalTerima: { gte: today.start } },
      }),

      prisma.registerPI.count({
        where: { tanggalTerima: { gte: yesterday.start, lte: yesterday.end } },
      }),

      prisma.registerSurat.findMany({
        where:  { tanggalTerima: { gte: trend.start } },
        select: { tanggalTerima: true, deptId: true },
      }),

      prisma.department.findMany({
        where:  { isActive: true },
        select: { id: true, shortName: true },
      }),
    ])

    return {
      totalUsers,
      usersByRole:  usersByRoleRaw.map((u) => ({ role: u.role, count: u._count.id })),
      totalDept,
      totalSurat,
      totalPI,
      suratPerDept: suratPerDeptRaw.map((s) => ({ deptId: s.deptId, count: s._count.id })),
      suratHariIni,
      suratKemarin,
      piHariIni,
      piKemarin,
      suratTrend,
      departments,
    }
  }
}