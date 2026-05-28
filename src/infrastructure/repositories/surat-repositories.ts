import { prisma }    from "@/infrastructure/databases/prisma-client"
import { isPIDept }  from "@/domain/surat/entities"
import { Prisma }    from "@/generated/prisma"
import { AppError }  from "@/lib/errors"
import type { ISuratRepository, SuratResult, PaginatedResult } from "@/domain/surat/repositories"
import type { CreateSuratPayload, UpdateSuratPayload }         from "@/domain/surat/types"
import type { RegisterSurat, RegisterPI }                      from "@/types"

// ─── Serializer: Date → string agar cocok dengan type RegisterSurat/RegisterPI ─

function serializeSurat(row: Record<string, unknown>): RegisterSurat {
  return {
    ...row,
    tanggalTerima: row.tanggalTerima instanceof Date
      ? row.tanggalTerima.toISOString()
      : String(row.tanggalTerima),
    detailSurat: (row.detailSurat as Record<string, unknown>[])?.map((d) => ({
      ...d,
      tanggalSurat: d.tanggalSurat instanceof Date
        ? d.tanggalSurat.toISOString()
        : String(d.tanggalSurat),
    })),
  } as RegisterSurat
}

function serializePI(row: Record<string, unknown>): RegisterPI {
  return {
    ...row,
    tanggalTerima: row.tanggalTerima instanceof Date
      ? row.tanggalTerima.toISOString()
      : String(row.tanggalTerima),
    detailPI: (row.detailPI as Record<string, unknown>[])?.map((d) => ({
      ...d,
      tanggalSurat: d.tanggalSurat instanceof Date
        ? d.tanggalSurat.toISOString()
        : String(d.tanggalSurat),
    })),
  } as RegisterPI
}

// ─── Repository ───────────────────────────────────────────────────────────────

export class SuratRepository implements ISuratRepository {

  async findAll(
    type:        string | null,
    ids:         number[] | null,
    pagination?: { page: number; limit: number },
    date?:       string | null,
    depts?:      string[] | null,
  ): Promise<SuratResult[] | PaginatedResult<SuratResult>> {
    const skip = pagination ? (pagination.page - 1) * pagination.limit : undefined
    const take = pagination?.limit

    const buildWhere = () => {
      const where: Record<string, unknown> = {}
      if (ids?.length)   where.id     = { in: ids }
      if (depts?.length) where.deptId = { in: depts }
      if (date) {
        const start = new Date(date); start.setHours(0,  0,  0,   0)
        const end   = new Date(date); end.setHours(23, 59, 59, 999)
        where.tanggalTerima = { gte: start, lte: end }
      }
      return where
    }

    const where = buildWhere()

    if (type === "pi") {
      const [rows, total] = await Promise.all([
        prisma.registerPI.findMany({
          where:   where as Prisma.RegisterPIWhereInput,
          include: { dept: true, detailPI: true },
          orderBy: { tanggalTerima: "desc" },
          skip,
          take,
        }),
        pagination
          ? prisma.registerPI.count({ where: where as Prisma.RegisterPIWhereInput })
          : Promise.resolve(0),
      ])
      const data = rows.map((r) => serializePI(r as unknown as Record<string, unknown>))
      if (!pagination) return data
      return {
        data,
        hasMore: (pagination.page - 1) * pagination.limit + data.length < total,
      }
    }

    const [rows, total] = await Promise.all([
      prisma.registerSurat.findMany({
        where:   where as Prisma.RegisterSuratWhereInput,
        include: { dept: true, detailSurat: true },
        orderBy: { tanggalTerima: "desc" },
        skip,
        take,
      }),
      pagination
        ? prisma.registerSurat.count({ where: where as Prisma.RegisterSuratWhereInput })
        : Promise.resolve(0),
    ])
    const data = rows.map((r) => serializeSurat(r as unknown as Record<string, unknown>))
    if (!pagination) return data
    return {
      data,
      hasMore: (pagination.page - 1) * pagination.limit + data.length < total,
    }
  }

  async findByIdAndDept(id: number, dept: string): Promise<SuratResult | null> {
    if (isPIDept(dept)) {
      const row = await prisma.registerPI.findFirst({
        where:   { id, deptId: dept },
        include: { dept: true, detailPI: true },
      })
      return row ? serializePI(row as unknown as Record<string, unknown>) : null
    }
    const row = await prisma.registerSurat.findFirst({
      where:   { id, deptId: dept },
      include: { dept: true, detailSurat: true },
    })
    return row ? serializeSurat(row as unknown as Record<string, unknown>) : null
  }

  async create(payload: CreateSuratPayload): Promise<SuratResult> {
    const { deptId, asalSurat, tanggalTerima, tujuan, isPIDept: isPI, piList, suratList } = payload

    const dept = await prisma.department.findUnique({ where: { id: deptId } })
    if (!dept) throw new AppError(404, `Departemen '${deptId}' tidak ditemukan`)

    const parsedTanggal = new Date(tanggalTerima)
    if (isNaN(parsedTanggal.getTime())) throw new AppError(400, "Format tanggal tidak valid")

    if (isPI) {
      if (!piList?.length) throw new AppError(400, "piList kosong")
      return prisma.$transaction(async (tx) => {
        const nomor = await this._generateNomor(tx, deptId, true)
        const row = await tx.registerPI.create({
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
        return serializePI(row as unknown as Record<string, unknown>)
      })
    }

    if (!suratList?.length) throw new AppError(400, "suratList kosong")
    return prisma.$transaction(async (tx) => {
      const nomor = await this._generateNomor(tx, deptId, false)
      const row = await tx.registerSurat.create({
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
      return serializeSurat(row as unknown as Record<string, unknown>)
    })
  }

  async update(id: number, dept: string, payload: UpdateSuratPayload): Promise<SuratResult> {
    const { asalSurat, tujuan, tanggalTerima, piList, suratList } = payload

    if (isPIDept(dept)) {
      const row = await prisma.registerPI.update({
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
      return serializePI(row as unknown as Record<string, unknown>)
    }

    const row = await prisma.registerSurat.update({
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
    return serializeSurat(row as unknown as Record<string, unknown>)
  }

  async delete(id: number, dept: string): Promise<void> {
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
    tx:     Prisma.TransactionClient,
    deptId: string,
    isPI:   boolean,
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