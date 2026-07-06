import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import { createRandomId } from "@/lib/random-id"
import type { DbClient } from "./types"

export type DepartmentStatusRow = {
  id: string
  isActive: boolean
}

export type DepartmentShortNameRow = {
  id: string
  shortName: string
}

export async function findActiveDepartmentRef(ref: string) {
  const rows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
    `
      SELECT id
      FROM departments
      WHERE is_active = true
        AND (id = $1 OR short_name = $1)
      LIMIT 1
    `,
    ref
  )

  return rows[0]?.id ?? null
}

export async function findAnyDepartmentRef(ref: string) {
  const byIdRows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
    `
      SELECT id
      FROM departments
      WHERE id = $1
      LIMIT 1
    `,
    ref
  )

  if (byIdRows[0]?.id) return byIdRows[0].id

  const byShortNameRows = await prisma.$queryRawUnsafe<Array<{ id: string }>>(
    `
      SELECT id
      FROM departments
      WHERE short_name = $1
    `,
    ref
  )

  if (byShortNameRows.length > 1) {
    throw new AppError(409, "Ada lebih dari satu departemen dengan singkatan ini. Gunakan ID departemen.")
  }

  return byShortNameRows[0]?.id ?? null
}

export function getSimpleDepartmentNumber(id: string) {
  const match = id.match(/^(?:dept_)?(\d+)$/)
  if (!match) return null

  const value = Number(match[1])
  return Number.isSafeInteger(value) ? value : null
}

function formatDepartmentId(value: number) {
  return value.toString()
}

export async function createDepartmentId(db: DbClient = prisma) {
  const rows = await db.$queryRawUnsafe<Array<{ id: string }>>(`
    SELECT id
    FROM departments
  `)
  const usedIds = new Set(rows.map((row) => row.id))
  const maxNumericId = rows.reduce((max, row) => {
    const value = getSimpleDepartmentNumber(row.id)
    return value === null ? max : Math.max(max, value)
  }, 0)

  for (let offset = 1; offset <= 10000; offset += 1) {
    const id = formatDepartmentId(maxNumericId + offset)
    if (!usedIds.has(id) && !usedIds.has(`dept_${id}`)) return id
  }

  throw new AppError(500, "Gagal membuat ID departemen")
}

export function isUniqueConflict(error: unknown) {
  const knownError = error as { code?: string; meta?: { code?: string }; message?: string }
  return knownError.code === "P2002" ||
    knownError.meta?.code === "23505" ||
    knownError.message?.toLowerCase().includes("duplicate key")
}

export async function findDepartmentsByShortName(shortName: string): Promise<DepartmentStatusRow[]> {
  return prisma.$queryRawUnsafe<DepartmentStatusRow[]>(
    `
      SELECT id, is_active AS "isActive"
      FROM departments
      WHERE short_name = $1
      ORDER BY is_active DESC, id ASC
    `,
    shortName
  )
}

export async function findActiveDepartmentShortName(id: string) {
  const rows = await prisma.$queryRawUnsafe<DepartmentShortNameRow[]>(
    `
      SELECT id, short_name AS "shortName"
      FROM departments
      WHERE id = $1
        AND is_active = true
      LIMIT 1
    `,
    id
  )

  return rows[0] ?? null
}

export async function findAnyDepartmentShortName(id: string) {
  const rows = await prisma.$queryRawUnsafe<DepartmentShortNameRow[]>(
    `
      SELECT id, short_name AS "shortName"
      FROM departments
      WHERE id = $1
      LIMIT 1
    `,
    id
  )

  return rows[0] ?? null
}

export async function findDepartmentDuplicateByShortName(
  shortName: string,
  exceptDepartmentId: string
) {
  const rows = await prisma.$queryRawUnsafe<DepartmentStatusRow[]>(
    `
      SELECT id, is_active AS "isActive"
      FROM departments
      WHERE short_name = $1
        AND id <> $2
      ORDER BY is_active DESC, id ASC
      LIMIT 1
    `,
    shortName,
    exceptDepartmentId
  )

  return rows[0] ?? null
}

export async function insertDepartment(
  db: DbClient,
  departmentId: string,
  nameColumn: string,
  input: CreateDepartemenInput,
  printSheetName: string
) {
  await db.$executeRawUnsafe(
    `
      INSERT INTO departments (id, short_name, ${nameColumn}, print_column_name, is_active)
      VALUES ($1, $2, $3, $4, true)
    `,
    departmentId,
    input.shortName,
    input.tujuan,
    printSheetName
  )

  return departmentId
}

export async function reactivateDepartment(
  db: DbClient,
  departmentId: string,
  nameColumn: string,
  input: CreateDepartemenInput,
  printSheetName: string
) {
  await db.$executeRawUnsafe(
    `
      UPDATE departments
      SET
        short_name = $2,
        ${nameColumn} = $3,
        print_column_name = $4,
        is_active = true
      WHERE id = $1
    `,
    departmentId,
    input.shortName,
    input.tujuan,
    printSheetName
  )
}

export async function renameInactiveDepartment(
  db: DbClient,
  departmentId: string,
  shortName: string
) {
  await db.$executeRawUnsafe(
    `
      UPDATE departments
      SET short_name = $2
      WHERE id = $1
        AND is_active = false
    `,
    departmentId,
    `${shortName}_INACTIVE_${createRandomId().replace(/-/g, "").slice(0, 8)}`
  )
}

export async function updateDepartment(
  db: DbClient,
  departmentId: string,
  nameColumn: string,
  input: UpdateDepartemenInput,
  printSheetName: string
) {
  await db.$executeRawUnsafe(
    `
      UPDATE departments
      SET
        short_name = $2,
        ${nameColumn} = $3,
        print_column_name = $4
      WHERE id = $1
    `,
    departmentId,
    input.shortName,
    input.tujuan,
    printSheetName
  )
}

export async function softDeleteDepartment(departmentId: string) {
  await prisma.$executeRaw`
    UPDATE departments
    SET is_active = false
    WHERE id = ${departmentId}
  `
}

export async function showDepartment(departmentId: string) {
  await prisma.$executeRaw`
    UPDATE departments
    SET is_active = true
    WHERE id = ${departmentId}
  `
}

export async function getDepartmentRegisterUsageCount(departmentId: string) {
  const rows = await prisma.$queryRawUnsafe<Array<{ count: bigint }>>(
    `
      SELECT COUNT(*)::bigint AS count
      FROM register_surat
      WHERE dept_id = $1
    `,
    departmentId
  )

  return Number(rows[0]?.count ?? 0)
}

export async function hardDeleteDepartmentData(departmentId: string) {
  await prisma.$transaction(async (tx) => {
    await tx.$executeRaw`
      DELETE FROM nomor_counter
      WHERE dept_id = ${departmentId}
    `
    await tx.$executeRaw`
      DELETE FROM department_columns
      WHERE department_id = ${departmentId}
    `
    await tx.$executeRaw`
      DELETE FROM departments
      WHERE id = ${departmentId}
    `
  })
}
