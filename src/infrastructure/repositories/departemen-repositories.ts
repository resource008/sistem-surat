// src/infrastructure/repositories/departemen-repository.ts

import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"

export class DepartemenRepository {
  private async usesFullNameColumn() {
    const columns = await prisma.$queryRaw<Array<{ column_name: string }>>`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_name = 'departments'
        AND column_name IN ('full_name', 'tujuan')
    `

    return columns.some((column) => column.column_name === "full_name")
  }

  async findAllActive() {
    const usesFullName = await this.usesFullNameColumn()

    if (usesFullName) {
      return prisma.$queryRaw<Array<{ id: string; shortName: string; fullName: string; tujuan: string }>>`
        SELECT
          id,
          short_name AS "shortName",
          full_name AS "fullName",
          full_name AS tujuan
        FROM departments
        WHERE is_active = true
        ORDER BY short_name ASC
      `
    }

    return prisma.$queryRaw<Array<{ id: string; shortName: string; fullName: string; tujuan: string }>>`
      SELECT
        id,
        short_name AS "shortName",
        tujuan AS "fullName",
        tujuan
      FROM departments
      WHERE is_active = true
      ORDER BY short_name ASC
    `
  }

  async findById(id: string) {
    const usesFullName = await this.usesFullNameColumn()
    const rows = usesFullName
      ? await prisma.$queryRaw<Array<{ id: string; shortName: string; fullName: string; tujuan: string }>>`
          SELECT
            id,
            short_name AS "shortName",
            full_name AS "fullName",
            full_name AS tujuan
          FROM departments
          WHERE id = ${id}
            AND is_active = true
          LIMIT 1
        `
      : await prisma.$queryRaw<Array<{ id: string; shortName: string; fullName: string; tujuan: string }>>`
          SELECT
            id,
            short_name AS "shortName",
            tujuan AS "fullName",
            tujuan
          FROM departments
          WHERE id = ${id}
            AND is_active = true
          LIMIT 1
        `

    const departemen = rows[0]
    if (!departemen) throw new AppError(404, "Departemen tidak ditemukan")
    return departemen
  }

  async create(input: CreateDepartemenInput) {
    const id = input.shortName
    const existing = await prisma.department.findUnique({ where: { id } })

    if (existing?.isActive) {
      throw new AppError(409, "Singkatan departemen sudah digunakan")
    }

    if (existing) {
      return prisma.department.update({
        where: { id },
        data: {
          shortName: input.shortName,
          tujuan:    input.tujuan,
          isActive:  true,
        },
        select: { id: true, shortName: true, tujuan: true },
      })
    }

    return prisma.department.create({
      data: {
        id,
        shortName: input.shortName,
        tujuan:    input.tujuan,
      },
      select: { id: true, shortName: true, tujuan: true },
    })
  }

  async update(id: string, input: UpdateDepartemenInput) {
    const current = await prisma.department.findFirst({
      where: { id, isActive: true },
    })

    if (!current) throw new AppError(404, "Departemen tidak ditemukan")

    const nextId = input.shortName
    if (nextId !== id) {
      const duplicate = await prisma.department.findUnique({ where: { id: nextId } })
      if (duplicate?.isActive) {
        throw new AppError(409, "Singkatan departemen sudah digunakan")
      }
      if (duplicate && !duplicate.isActive) {
        throw new AppError(409, "Singkatan departemen pernah digunakan oleh data yang sudah dihapus")
      }
    }

    return prisma.department.update({
      where: { id },
      data: {
        id:        nextId,
        shortName: input.shortName,
        tujuan:    input.tujuan,
      },
      select: { id: true, shortName: true, tujuan: true },
    })
  }

  async delete(id: string) {
    const current = await prisma.department.findFirst({
      where: { id, isActive: true },
      select: { id: true },
    })

    if (!current) throw new AppError(404, "Departemen tidak ditemukan")

    await prisma.department.update({
      where: { id },
      data:  { isActive: false },
    })
  }
}
