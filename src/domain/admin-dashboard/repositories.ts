import { DateRange } from "./types"

export interface AdminDashboardRepository {
  countUsers(): Promise<number>
  countActiveDepartments(): Promise<number>
  countSurat(range?: DateRange): Promise<number>

  findDepartments(): Promise<
    {
      id: string
      shortName: string
    }[]
  >

  findDepartmentById(
    deptId: string
  ): Promise<{ id: string; shortName: string } | null>

  countSuratByDepartment(): Promise<
    {
      deptId: string
      count: number
    }[]
  >

  findSuratStatistics(
    range: DateRange,
    deptId: string
  ): Promise<
    {
      tanggalTerima: Date
    }[]
  >

  findUserActivities(limit?: number): Promise<
    {
      id: string
      name: string
      lastLoginAt: Date | null
      sessions: {
        createdAt: Date
        updatedAt: Date
        expiresAt: Date
      }[]
    }[]
  >
}
