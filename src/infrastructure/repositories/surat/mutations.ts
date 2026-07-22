import type { CreateSuratPayload, UpdateSuratPayload } from "@/domain/surat/types"
import type { SuratResult } from "@/domain/surat/repositories"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import { findActiveDepartmentByRef } from "./departments"
import {
  ensureCustomFieldColumns,
  loadSuratCustomFields,
  saveSuratCustomFields,
} from "./custom-fields"
import { loadDepartmentColumns } from "./department-columns"
import { generateNomor } from "./numbering"
import { buildDynamicSuratDetail, serializeSurat } from "./serializer"
import { deptSelect } from "./types"
import { parseDateInput } from "@/lib/date-input"

export async function createSuratMutation(payload: CreateSuratPayload): Promise<SuratResult> {
  await ensureCustomFieldColumns()
  const { deptId: deptRef, asalSurat, tanggalTerima, suratList } = payload

  const dept = await findActiveDepartmentByRef(deptRef)
  if (!dept) throw new AppError(404, "Departemen tidak ditemukan. Hubungi administrator untuk menambahkannya.")
  const deptId = dept.id
  const tujuan = dept.shortName
  const departmentColumns = await loadDepartmentColumns([deptId])
  const currentDepartmentColumns = departmentColumns[deptId] ?? []

  const parsedTanggal = parseDateInput(tanggalTerima)
  if (!parsedTanggal) throw new AppError(400, "Format tanggal tidak valid")

  if (!suratList?.length) throw new AppError(400, "suratList kosong")
  return prisma.$transaction(async (tx) => {
    const nomor = await generateNomor(tx, deptId, parsedTanggal)
    const row = await tx.registerSurat.create({
      data: {
        nomor,
        dept:          { connect: { id: deptId } },
        asalSurat,
        tujuan:        tujuan ?? "",
        tanggalTerima: parsedTanggal,
        detailSurat: {
          create: suratList.map((surat) => ({
            ...buildDynamicSuratDetail(surat, currentDepartmentColumns, tujuan, parsedTanggal, nomor),
          })),
        },
      },
      include: { dept: { select: deptSelect }, detailSurat: true },
    })
    await saveSuratCustomFields(
      row.detailSurat.map((detail, index) => ({
        id: detail.id,
        customFields: suratList[index]?.customFields,
      })),
      tx
    )
    const customFields = await loadSuratCustomFields(row.detailSurat.map((detail) => detail.id), tx)
    return serializeSurat(row as unknown as Record<string, unknown>, customFields, departmentColumns)
  })
}

export async function updateSuratMutation(
  id: number,
  dept: string,
  payload: UpdateSuratPayload
): Promise<SuratResult> {
  await ensureCustomFieldColumns()
  const { deptId: nextDeptRef, asalSurat, tanggalTerima, suratList } = payload
  const currentDepartment = await findActiveDepartmentByRef(dept)
  if (!currentDepartment) throw new AppError(404, "Departemen tidak ditemukan. Hubungi administrator untuk menambahkannya.")
  const department = await findActiveDepartmentByRef(nextDeptRef ?? currentDepartment.id)
  if (!department) throw new AppError(404, "Departemen tidak ditemukan. Hubungi administrator untuk menambahkannya.")
  const currentDeptId = currentDepartment.id
  const nextDeptId = department.id
  const isDeptChanged = nextDeptId !== currentDeptId
  const tujuan = department.shortName
  const departmentColumns = await loadDepartmentColumns([nextDeptId])
  const currentDepartmentColumns = departmentColumns[nextDeptId] ?? []

  return prisma.$transaction(async (tx) => {
    const currentRegister = await tx.registerSurat.findFirst({
      where: { id, deptId: currentDeptId, dept: { is: { isActive: true } } },
      select: { id: true, nomor: true },
    })

    if (!currentRegister) {
      throw new AppError(404, "Data tidak ditemukan")
    }

    const nextTanggalTerima = tanggalTerima ? parseDateInput(tanggalTerima) : new Date()
    if (!nextTanggalTerima) throw new AppError(400, "Format tanggal tidak valid")
    const nomor = isDeptChanged
      ? await generateNomor(tx, nextDeptId, nextTanggalTerima)
      : undefined

    const row = await tx.registerSurat.update({
      where: { id },
      data: {
        ...(isDeptChanged && { dept: { connect: { id: nextDeptId } } }),
        ...(nomor && { nomor }),
        asalSurat,
        tujuan,
        tanggalTerima: tanggalTerima ? nextTanggalTerima : undefined,
        detailSurat: suratList ? {
          deleteMany: {},
          create: suratList.map((surat) => ({
            ...buildDynamicSuratDetail(
              surat,
              currentDepartmentColumns,
              tujuan,
              nextTanggalTerima,
              nomor ?? currentRegister.nomor
            ),
          })),
        } : undefined,
      },
      include: { dept: { select: deptSelect }, detailSurat: true },
    })
    if (suratList) {
      await saveSuratCustomFields(
        row.detailSurat.map((detail, index) => ({
          id: detail.id,
          customFields: suratList[index]?.customFields,
        })),
        tx
      )
    }
    const customFields = await loadSuratCustomFields(row.detailSurat.map((detail) => detail.id), tx)
    return serializeSurat(row as unknown as Record<string, unknown>, customFields, departmentColumns)
  })
}

export async function deleteSuratMutation(id: number, dept: string): Promise<void> {
  const department = await findActiveDepartmentByRef(dept)
  if (!department) throw new AppError(404, "Data tidak ditemukan")

  const result = await prisma.registerSurat.deleteMany({
    where: { id, deptId: department.id, dept: { is: { isActive: true } } },
  })

  if (result.count === 0) {
    throw new AppError(404, "Data tidak ditemukan")
  }
}
