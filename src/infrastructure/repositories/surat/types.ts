import type { Prisma } from "@/generated/prisma"
import { prisma } from "@/infrastructure/databases/prisma-client"
import type { DepartemenColumn } from "@/types"

export const deptSelect = {
  id:              true,
  shortName:       true,
  printSheetName: true,
} as const

export type DbClient = Prisma.TransactionClient | typeof prisma
export type CustomFieldsMap = Record<number, Record<string, string>>
export type DepartmentColumnsMap = Record<string, DepartemenColumn[]>
