import { AdminDashboardRepository } from "@/domain/admin-dashboard/repositories"
import { DateRange } from "@/domain/admin-dashboard/types"
import { prisma } from "@/infrastructure/databases/prisma-client"

export class PrismaAdminDashboardRepository
  implements AdminDashboardRepository
{
  countUsers() {
    return prisma.user.count()
  }

  countActiveDepartments() {
    return prisma.department.count({
      where: { isActive: true },
    })
  }

  countSurat(range?: DateRange) {
    return prisma.registerSurat.count({
      where: range
        ? {
            tanggalTerima: {
              gte: range.start,
              lte: range.end,
            },
          }
        : undefined,
    })
  }

  countPI(range?: DateRange) {
    return prisma.registerPI.count({
      where: range
        ? {
            tanggalTerima: {
              gte: range.start,
              lte: range.end,
            },
          }
        : undefined,
    })
  }

  findDepartments() {
    return prisma.department.findMany({
      where: { isActive: true },
      select: {
        id: true,
        shortName: true,
      },
      orderBy: { shortName: "asc" },
    })
  }

  findDepartmentById(deptId: string) {
    return prisma.department.findFirst({
      where: {
        id: deptId,
        isActive: true,
      },
      select: {
        id: true,
        shortName: true,
      },
    })
  }

  async countSuratByDepartment() {
    const rows = await prisma.registerSurat.groupBy({
      by: ["deptId"],
      _count: { _all: true },
    })

    return rows.map((row) => ({
      deptId: row.deptId,
      count: row._count._all,
    }))
  }

  findSuratStatistics(range: DateRange, deptId: string) {
    return prisma.registerSurat.findMany({
      where: {
        deptId,
        tanggalTerima: {
          gte: range.start,
          lte: range.end,
        },
      },
      select: {
        tanggalTerima: true,
      },
      orderBy: { tanggalTerima: "asc" },
    })
  }

  findUserActivities(limit?: number) {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        lastLoginAt: true,
        sessions: {
          where: {
            expiresAt: {
              gt: new Date(),
            },
          },
          select: {
            createdAt: true,
            updatedAt: true,
            expiresAt: true,
          },
          orderBy: { updatedAt: "desc" },
          take: 1,
        },
      },
      orderBy: [{ lastLoginAt: "desc" }, { updatedAt: "desc" }],
      ...(limit ? { take: limit } : {}),
    })
  }
}
