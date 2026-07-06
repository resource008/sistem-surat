import type { Prisma } from "@/generated/prisma"
import { prisma } from "@/infrastructure/databases/prisma-client"
import type { DepartemenColumnType } from "@/types"

export type DepartmentRow = {
  id: string
  shortName: string
  fullName: string
  tujuan: string
  printSheetName: string
  isActive: boolean
}

export type DepartmentColumnRow = {
  id: string
  departmentId: string
  label: string
  type: DepartemenColumnType
  defaultValue: string
  isDefault: boolean
  isRequired: boolean
  showInDataSurat: boolean
  showInPrint: boolean
  sortOrder: number
}

export type DbClient = Prisma.TransactionClient | typeof prisma
