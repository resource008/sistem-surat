// src/infrastructure/repositories/departemen-repository.ts

import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import type {
  CreateDepartemenInput,
  UpdateDepartemenInput,
} from "@/app/validation/departemen"

export class DepartemenRepository {
  findAllActive() {
    return prisma.department.findMany({
      where  : { isActive: true },
      select : { id: true, shortName: true, tujuan: true },
      orderBy: { shortName: "asc" },
    })
  }

  async findById(id: string) {
    const departemen = await prisma.department.findFirst({
      where: { id, isActive: true },
      select: { id: true, shortName: true, tujuan: true },
    })

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
