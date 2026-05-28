import { prisma } from "@/infrastructure/databases/prisma-client"
import { isPIDept } from "@/domain/surat/entities"
import { Prisma } from "@/generated/prisma"
import { AppError } from "@/lib/errors"
import type { ISuratRepository } from "@/domain/surat/repositories"
import type { CreateSuratPayload, UpdateSuratPayload } from "@/domain/surat/types"

export class SuratRepository implements ISuratRepository {

  async findAll(
    type: string | null,
    ids: number[] | null,
    pagination?: { page: number; limit: number }
  ) {
    const whereIds = ids && ids.length > 0 ? { id: { in: ids } } : undefined
    const skip = pagination ? (pagination.page - 1) * pagination.limit : undefined
    const take = pagination?.limit

    if (type === "pi") {
      const [data, total] = await Promise.all([
        prisma.registerPI.findMany({
          where:   whereIds,
          include: { dept: true, detailPI: true },
          orderBy: { tanggalTerima: "desc" },
          skip,
          take,
        }),
        pagination
          ? prisma.registerPI.count({ where: whereIds })
          : Promise.resolve(0),
      ])
      return pagination
        ? { data, hasMore: (pagination.page - 1) * pagination.limit + data.length < total }
        : data
    }

    const [data, total] = await Promise.all([
      prisma.registerSurat.findMany({
        where:   whereIds,
        include: { dept: true, detailSurat: true },
        orderBy: { tanggalTerima: "desc" },
        skip,
        take,
      }),
      pagination
        ? prisma.registerSurat.count({ where: whereIds })
        : Promise.resolve(0),
    ])
    return pagination
      ? { data, hasMore: (pagination.page - 1) * pagination.limit + data.length < total }
      : data
  }

  async findByIdAndDept(id: number, dept: string) {
    if (isPIDept(dept)) {
      return prisma.registerPI.findFirst({
        where:   { id, deptId: dept },
        include: { dept: true, detailPI: true },
      })
    }
    return prisma.registerSurat.findFirst({
      where:   { id, deptId: dept },
      include: { dept: true, detailSurat: true },
    })
  }

  async create(payload: CreateSuratPayload) {
    const { deptId, asalSurat, tanggalTerima, tujuan, isPIDept: isPI, piList, suratList } = payload

    const dept = await prisma.department.findUnique({ where: { id: deptId } })
    if (!dept) throw new AppError(404, `Departemen '${deptId}' tidak ditemukan`)

    const parsedTanggal = new Date(tanggalTerima)
    if (isNaN(parsedTanggal.getTime())) throw new AppError(400, "Format tanggal tidak valid")

    if (isPI) {
      if (!piList || piList.length === 0) throw new AppError(400, "piList kosong")
      return prisma.$transaction(async (tx) => {
        const nomor = await this._generateNomor(tx, deptId, true)
        return tx.registerPI.create({
          data: {
            nomor,
            dept:          { connect: { id: deptId } },
            asalSurat,
            tanggalTerima: parsedTanggal,
            detailPI: {
              create: piList.map((p) => ({
                namaSupplier: p.namaSupplier,
                noInvoice:    p.noInvoice    ?? null,
                nomorSurat:   p.nomorSurat   ?? null,
                tujuan:       p.tujuan       ?? null,
                cc:           p.cc           ?? null,
                tanggalSurat: new Date(p.tanggalSurat),
              })),
            },
          },
          include: { dept: true, detailPI: true },
        })
      })
    }

    if (!suratList || suratList.length === 0) throw new AppError(400, "suratList kosong")
    return prisma.$transaction(async (tx) => {
      const nomor = await this._generateNomor(tx, deptId, false)
      return tx.registerSurat.create({
        data: {
          nomor,
          dept:          { connect: { id: deptId } },
          asalSurat,
          tujuan:        tujuan ?? "",
          tanggalTerima: parsedTanggal,
          detailSurat: {
            create: suratList.map((s) => ({
              perihal:      s.perihal,
              noSurat:      s.noSurat   ?? null,
              lampiran:     s.lampiran  ?? null,
              tujuan:       s.tujuan    ?? null,
              tanggalSurat: new Date(s.tanggalSurat),
            })),
          },
        },
        include: { dept: true, detailSurat: true },
      })
    })
  }

  async update(id: number, dept: string, payload: UpdateSuratPayload) {
    const { asalSurat, tujuan, tanggalTerima, piList, suratList } = payload

    if (isPIDept(dept)) {
      return prisma.registerPI.update({
        where: { id },
        data: {
          asalSurat,
          tanggalTerima: tanggalTerima ? new Date(tanggalTerima) : undefined,
          detailPI: piList ? {
            deleteMany: {},
            create: piList.map((p) => ({
              namaSupplier: p.namaSupplier,
              noInvoice:    p.noInvoice  ?? null,
              nomorSurat:   p.nomorSurat ?? null,
              tujuan:       p.tujuan     ?? null,
              cc:           p.cc         ?? null,
              tanggalSurat: new Date(p.tanggalSurat),
            })),
          } : undefined,
        },
        include: { dept: true, detailPI: true },
      })
    }

    return prisma.registerSurat.update({
      where: { id },
      data: {
        asalSurat,
        tujuan,
        tanggalTerima: tanggalTerima ? new Date(tanggalTerima) : undefined,
        detailSurat: suratList ? {
          deleteMany: {},
          create: suratList.map((s) => ({
            perihal:      s.perihal,
            noSurat:      s.noSurat   ?? null,
            lampiran:     s.lampiran  ?? null,
            tujuan:       s.tujuan    ?? null,
            tanggalSurat: new Date(s.tanggalSurat),
          })),
        } : undefined,
      },
      include: { dept: true, detailSurat: true },
    })
  }

  async delete(id: number, dept: string) {
    if (isPIDept(dept)) {
      await prisma.registerPI.delete({ where: { id } })
    } else {
      await prisma.registerSurat.delete({ where: { id } })
    }
  }

  async getPreviewNomor(deptId: string): Promise<string> {
    const dept = await prisma.department.findUnique({ where: { id: deptId } })
    if (!dept) throw new Error(`NOT_FOUND: Departemen '${deptId}' tidak ditemukan`)

    const last = isPIDept(deptId)
      ? await prisma.registerPI.findFirst({
          where:   { deptId },
          orderBy: { nomor: "desc" },
          select:  { nomor: true },
        })
      : await prisma.registerSurat.findFirst({
          where:   { deptId },
          orderBy: { nomor: "desc" },
          select:  { nomor: true },
        })

    const lastNumber = last ? parseInt(last.nomor, 10) : 0
    return String(lastNumber + 1).padStart(4, "0")
  }

  private async _generateNomor(
    tx: Prisma.TransactionClient,
    deptId: string,
    isPI: boolean
  ): Promise<string> {
    const registers = isPI
      ? await tx.registerPI.findMany({ where: { deptId }, select: { nomor: true } })
      : await tx.registerSurat.findMany({ where: { deptId }, select: { nomor: true } })

    const last = registers.reduce((max, r) => {
      const n = parseInt(r.nomor, 10)
      return isNaN(n) ? max : Math.max(max, n)
  }, 0)

  return String(last + 1).padStart(4, "0")
  }
}