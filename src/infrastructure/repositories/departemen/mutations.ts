import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import type { DepartemenColumn } from "@/types"
import { normalizeInputColumns } from "./columns"
import {
  copyDepartmentColumnsFromDepartment,
  saveDepartmentColumns,
} from "./column-store"
import {
  createDepartmentId,
  findActiveDepartmentRef,
  findActiveDepartmentShortName,
  findAnyDepartmentShortName,
  findAnyDepartmentRef,
  findDepartmentDuplicateByShortName,
  findDepartmentsByShortName,
  getDepartmentRegisterUsageCount,
  getSimpleDepartmentNumber,
  hardDeleteDepartmentData,
  insertDepartment,
  isUniqueConflict,
  reactivateDepartment,
  renameInactiveDepartment,
  showDepartment,
  softDeleteDepartment,
  updateDepartment,
} from "./departments"
import { ensureUniquePrintStructure, resolvePrintSheetName } from "./print-structure"
import {
  ensureDepartmentColumnTable,
  ensureDepartmentMetaColumns,
  getDepartmentNameColumn,
} from "./schema"

async function resolveInputColumns(input: CreateDepartemenInput | UpdateDepartemenInput) {
  return input.columnMode === "existing" && input.sourceDepartmentId
    ? await copyDepartmentColumnsFromDepartment(input.sourceDepartmentId)
    : normalizeInputColumns(input)
}

function splitExistingDepartments(rows: Awaited<ReturnType<typeof findDepartmentsByShortName>>) {
  return {
    activeExisting: rows.find((row) => row.isActive),
    reusableExisting: rows.find((row) =>
      !row.isActive && getSimpleDepartmentNumber(row.id) !== null
    ),
    staleRandomExisting: rows.filter((row) =>
      !row.isActive && getSimpleDepartmentNumber(row.id) === null
    ),
  }
}

async function createFreshDepartment(
  input: CreateDepartemenInput,
  nameColumn: string,
  printSheetName: string,
  columns: DepartemenColumn[],
  staleRandomExisting: { id: string }[]
) {
  let departmentId = ""

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      departmentId = await prisma.$transaction(async (tx) => {
        for (const stale of staleRandomExisting) {
          await renameInactiveDepartment(tx, stale.id, input.shortName)
        }

        const nextDepartmentId = await createDepartmentId(tx)
        await insertDepartment(tx, nextDepartmentId, nameColumn, input, printSheetName)
        await saveDepartmentColumns(tx, nextDepartmentId, columns)
        return nextDepartmentId
      })
      break
    } catch (error) {
      if (isUniqueConflict(error)) continue
      throw error
    }
  }

  if (!departmentId) throw new AppError(500, "Gagal membuat ID departemen")
  return departmentId
}

export async function createDepartmentMutation(input: CreateDepartemenInput) {
  await ensureDepartmentMetaColumns()
  await ensureDepartmentColumnTable()
  const nameColumn = await getDepartmentNameColumn()
  const printSheetName = resolvePrintSheetName(input)
  const columns = await resolveInputColumns(input)
  const existingRows = await findDepartmentsByShortName(input.shortName)
  const { activeExisting, reusableExisting, staleRandomExisting } = splitExistingDepartments(existingRows)

  if (activeExisting) {
    throw new AppError(409, "Singkatan departemen sudah digunakan")
  }

  await ensureUniquePrintStructure(printSheetName, columns, reusableExisting?.id)

  if (reusableExisting) {
    await prisma.$transaction(async (tx) => {
      await reactivateDepartment(tx, reusableExisting.id, nameColumn, input, printSheetName)
      await saveDepartmentColumns(tx, reusableExisting.id, columns)
    })
    return reusableExisting.id
  }

  return createFreshDepartment(input, nameColumn, printSheetName, columns, staleRandomExisting)
}

export async function updateDepartmentMutation(id: string, input: UpdateDepartemenInput) {
  await ensureDepartmentMetaColumns()
  await ensureDepartmentColumnTable()
  const nameColumn = await getDepartmentNameColumn()
  const printSheetName = resolvePrintSheetName(input)
  const columns = await resolveInputColumns(input)
  const resolvedId = await findActiveDepartmentRef(id)
  if (!resolvedId) throw new AppError(404, "Departemen tidak ditemukan")

  const current = await findActiveDepartmentShortName(resolvedId)
  if (!current) throw new AppError(404, "Departemen tidak ditemukan")

  if (input.shortName !== current.shortName) {
    const duplicate = await findDepartmentDuplicateByShortName(input.shortName, resolvedId)
    if (duplicate?.isActive) {
      throw new AppError(409, "Singkatan departemen sudah digunakan")
    }
    if (duplicate && !duplicate.isActive) {
      throw new AppError(409, "Singkatan departemen pernah digunakan oleh data yang sudah dihapus")
    }
  }

  await ensureUniquePrintStructure(printSheetName, columns, resolvedId)

  await prisma.$transaction(async (tx) => {
    await updateDepartment(tx, resolvedId, nameColumn, input, printSheetName)
    await saveDepartmentColumns(tx, resolvedId, columns)
  })

  return resolvedId
}

export async function deleteDepartmentMutation(id: string) {
  const resolvedId = await findActiveDepartmentRef(id)
  if (!resolvedId) throw new AppError(404, "Departemen tidak ditemukan")

  const current = await findActiveDepartmentShortName(resolvedId)
  if (!current) throw new AppError(404, "Departemen tidak ditemukan")

  await softDeleteDepartment(resolvedId)
}

export async function showDepartmentMutation(id: string) {
  const resolvedId = await findAnyDepartmentRef(id)
  if (!resolvedId) throw new AppError(404, "Departemen tidak ditemukan")

  const current = await findAnyDepartmentShortName(resolvedId)
  if (!current) throw new AppError(404, "Departemen tidak ditemukan")

  const duplicate = await findDepartmentDuplicateByShortName(current.shortName, resolvedId)
  if (duplicate?.isActive) {
    throw new AppError(409, "Singkatan departemen sudah digunakan")
  }

  await showDepartment(resolvedId)
  return resolvedId
}

export async function hardDeleteDepartmentMutation(id: string) {
  await ensureDepartmentColumnTable()
  const resolvedId = await findAnyDepartmentRef(id)
  if (!resolvedId) throw new AppError(404, "Departemen tidak ditemukan")

  const usageCount = await getDepartmentRegisterUsageCount(resolvedId)
  if (usageCount > 0) {
    throw new AppError(
      409,
      "Departemen tidak bisa dihapus permanen karena masih memiliki data surat. Hapus atau pindahkan data suratnya terlebih dahulu."
    )
  }

  await hardDeleteDepartmentData(resolvedId)
}
