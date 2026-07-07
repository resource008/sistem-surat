import type { Prisma } from "@/generated/prisma"
import { prisma } from "@/infrastructure/databases/prisma-client"
import type { TrackFieldType } from "@/types"

export type DbClient = Prisma.TransactionClient | typeof prisma

export type TrackSheetRow = {
  id: string
  name: string
  description: string
  sortOrder: number
  hiddenAt: Date | null
}

export type TrackCategoryRow = {
  id: string
  sheetId: string
  name: string
  color: string
  fillByHrd: boolean
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
  fillByHrd: boolean
  hiddenAt: Date | null
  sortOrder: number
}
