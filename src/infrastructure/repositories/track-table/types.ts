import type { Prisma } from "@/generated/prisma"
import { prisma } from "@/infrastructure/databases/prisma-client"
import type { TrackFieldType } from "@/types"

export type DbClient = Prisma.TransactionClient | typeof prisma

export type TrackSheetRow = {
  id: string
  name: string
  sortOrder: number
  displayCategoryId: string | null
  hiddenAt: Date | null
}

export type TrackCategoryRow = {
  id: string
  sheetId: string
  name: string
  color: string
  fillRequired: boolean
  addRoleValues: string
  editRoleValues: string
  deleteRoleValues: string
  sortOrder: number
}

export type TrackFieldRow = {
  id: string
  sheetId: string
  categoryId: string | null
  category: string
  categoryColor: string
  region: string
  columnName: string
  type: TrackFieldType
  defaultValue: string
  categoryOptions: string
  fillRequired: boolean
  addRoleValues: string
  editRoleValues: string
  deleteRoleValues: string
  hiddenAt: Date | null
  sortOrder: number
}
