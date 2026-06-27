import { Prisma } from "@/generated/prisma"
import type {
  PaginatedResult,
  SuratResult,
} from "@/domain/surat/repositories"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { findActiveDepartmentByRef } from "./departments"
import { ensureCustomFieldColumns, loadSuratCustomFields } from "./custom-fields"
import { loadDepartmentColumns } from "./department-columns"
import { serializeSurat } from "./serializer"
import { deptSelect } from "./types"

function buildSuratWhere(
  ids: number[] | null,
  date?: string | null,
  depts?: string[] | null,
) {
  const where: Record<string, unknown> = {
    dept: { is: { isActive: true } },
    detailSurat: { some: {} },
  }
  if (ids?.length) where.id = { in: ids }
  if (depts?.length) {
    where.OR = [
      { deptId: { in: depts } },
      { dept: { is: { shortName: { in: depts } } } },
    ]
  }
  if (date) {
    const start = new Date(date); start.setHours(0, 0, 0, 0)
    const end = new Date(date); end.setHours(23, 59, 59, 999)
    where.tanggalTerima = { gte: start, lte: end }
  }
  return where
}

async function serializeRows(rows: Array<{ deptId: string; detailSurat: Array<{ id: number }> } & Record<string, unknown>>) {
  const detailIds = rows.flatMap((row) => row.detailSurat.map((detail) => detail.id))
  const customFields = await loadSuratCustomFields(detailIds)
  const departmentColumns = await loadDepartmentColumns(rows.map((row) => row.deptId))
  return rows.map((row) => serializeSurat(row, customFields, departmentColumns))
}

export async function findAllSurat(
  ids: number[] | null,
  pagination?: { page: number; limit: number },
  date?: string | null,
  depts?: string[] | null,
): Promise<SuratResult[] | PaginatedResult<SuratResult>> {
  await ensureCustomFieldColumns()
  const skip = pagination ? (pagination.page - 1) * pagination.limit : undefined
  const take = pagination?.limit
  const suratWhere = buildSuratWhere(ids, date, depts)

  const [rows, total] = await Promise.all([
    prisma.registerSurat.findMany({
      where:   suratWhere as Prisma.RegisterSuratWhereInput,
      include: { dept: { select: deptSelect }, detailSurat: true },
      orderBy: { tanggalTerima: "desc" },
      skip,
      take,
    }),
    pagination
      ? prisma.registerSurat.count({ where: suratWhere as Prisma.RegisterSuratWhereInput })
      : Promise.resolve(0),
  ])

  const data = await serializeRows(rows as unknown as Array<{ deptId: string; detailSurat: Array<{ id: number }> } & Record<string, unknown>>)
  if (!pagination) return data

  return {
    data,
    hasMore: (pagination.page - 1) * pagination.limit + data.length < total,
  }
}

export async function findSuratByIdAndDept(id: number, dept: string): Promise<SuratResult | null> {
  await ensureCustomFieldColumns()
  const department = await findActiveDepartmentByRef(dept)
  if (!department) return null

  const row = await prisma.registerSurat.findFirst({
    where:   { id, deptId: department.id, dept: { is: { isActive: true } } },
    include: { dept: { select: deptSelect }, detailSurat: true },
  })
  if (!row) return null

  const data = await serializeRows([row as unknown as { deptId: string; detailSurat: Array<{ id: number }> } & Record<string, unknown>])
  return data[0] ?? null
}
