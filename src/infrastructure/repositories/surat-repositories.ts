import { prisma }    from "@/infrastructure/databases/prisma-client"
import { isPIDept }  from "@/domain/surat/entities"
import { Prisma }    from "@/generated/prisma"
import { AppError }  from "@/lib/errors"
import type { ISuratRepository, SuratResult, PaginatedResult } from "@/domain/surat/repositories"
import type { CreateSuratPayload, UpdateSuratPayload }         from "@/domain/surat/types"
import type { RegisterSurat, RegisterPI }                      from "@/types"

// ─── Serializer: Date → string agar cocok dengan type RegisterSurat/RegisterPI ─

function serializeSurat(row: Record<string, unknown>): RegisterSurat {
  const dept = row.dept as Record<string, unknown> | undefined
  const deptShortName = String(dept?.shortName ?? row.deptId)

  return {
    id:            Number(row.id),
    nomor:         String(row.nomor),
    deptId:        String(row.deptId),
    dept: {
      id:        String(dept?.id ?? row.deptId),
      shortName: deptShortName,
    },
    asalSurat:     String(row.asalSurat ?? ""),
    tujuan:        deptShortName,
    tanggalTerima: row.tanggalTerima instanceof Date
      ? row.tanggalTerima.toISOString()
      : String(row.tanggalTerima),
    detailSurat: (row.detailSurat as Record<string, unknown>[])?.map((d) => ({
      id:       Number(d.id),
      perihal:  String(d.perihal ?? ""),
      noSurat:  d.noSurat  === null || d.noSurat  === undefined ? null : String(d.noSurat),
      lampiran: d.lampiran === null || d.lampiran === undefined ? null : String(d.lampiran),
      tujuan:   deptShortName,
      tanggalSurat: d.tanggalSurat instanceof Date
        ? d.tanggalSurat.toISOString()
        : String(d.tanggalSurat),
    })),
  } as RegisterSurat
}

function serializePI(row: Record<string, unknown>): RegisterPI {
  const dept = row.dept as Record<string, unknown> | undefined
  const deptShortName = String(dept?.shortName ?? row.deptId)

  return {
    id:            Number(row.id),
    nomor:         String(row.nomor),
    deptId:        String(row.deptId),
    dept: {
      id:        String(dept?.id ?? row.deptId),
      shortName: deptShortName,
    },
    asalSurat:     String(row.asalSurat ?? ""),
    tanggalTerima: row.tanggalTerima instanceof Date
      ? row.tanggalTerima.toISOString()
      : String(row.tanggalTerima),
    detailPI: (row.detailPI as Record<string, unknown>[])?.map((d) => ({
      id:           Number(d.id),
      namaSupplier: String(d.namaSupplier ?? ""),
      noInvoice:    d.noInvoice  === null || d.noInvoice  === undefined ? null : String(d.noInvoice),
      nomorSurat:   d.nomorSurat === null || d.nomorSurat === undefined ? null : String(d.nomorSurat),
      tujuan:       deptShortName,
      cc:           d.cc         === null || d.cc         === undefined ? null : String(d.cc),
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
      if (depts?.length) {
        where.OR = [
          { deptId: { in: depts } },
          { dept: { is: { shortName: { in: depts } } } },
        ]
      }
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
    const department = await prisma.department.findUnique({
      where: { id: dept },
      select: { shortName: true },
    })
    if (isPIDept(department?.shortName ?? "")) {
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
    const { deptId, asalSurat, tanggalTerima, piList, suratList } = payload

    const dept = await prisma.department.findUnique({ where: { id: deptId } })
    if (!dept) throw new AppError(404, `Departemen '${deptId}' tidak ditemukan`)
    const tujuan = dept.shortName
    const isPI = isPIDept(dept.shortName)

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
                tujuan,
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
              tujuan,
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
  const { deptId, asalSurat, tanggalTerima, piList, suratList } = payload
  const nextDeptId = deptId ?? dept
  const currentDepartment = await prisma.department.findUnique({
    where: { id: dept },
    select: { shortName: true },
  })
  const department = await prisma.department.findUnique({ where: { id: nextDeptId } })
  if (!department) throw new AppError(404, `Departemen '${nextDeptId}' tidak ditemukan`)
  const tujuan = department.shortName

  if (isPIDept(currentDepartment?.shortName ?? "")) {
    return prisma.$transaction(async (tx) => {
      // Generate nomor baru jika dept berubah
      const nomor = deptId && deptId !== dept
        ? await this._generateNomor(tx, deptId, true)
        : undefined

      const row = await tx.registerPI.update({
        where: { id },
        data: {
          ...(deptId        && { dept: { connect: { id: deptId } } }),
          ...(nomor         && { nomor }),
          asalSurat,
          tanggalTerima: tanggalTerima ? new Date(tanggalTerima) : undefined,
          detailPI: piList ? {
            deleteMany: {},
            create: piList.map((p) => ({
              namaSupplier: p.namaSupplier,
              noInvoice:    p.noInvoice  ?? null,
              nomorSurat:   p.nomorSurat ?? null,
              tujuan,
              cc:           p.cc         ?? null,
              tanggalSurat: new Date(p.tanggalSurat),
            })),
          } : undefined,
        },
        include: { dept: true, detailPI: true },
      })
      return serializePI(row as unknown as Record<string, unknown>)
    })
  }

  return prisma.$transaction(async (tx) => {
    // Generate nomor baru jika dept berubah
    const nomor = deptId && deptId !== dept
      ? await this._generateNomor(tx, deptId, false)
      : undefined

    const row = await tx.registerSurat.update({
      where: { id },
      data: {
        ...(deptId && { dept: { connect: { id: deptId } } }),
        ...(nomor  && { nomor }),
        asalSurat,
        tujuan,
        tanggalTerima: tanggalTerima ? new Date(tanggalTerima) : undefined,
        detailSurat: suratList ? {
          deleteMany: {},
          create: suratList.map((s) => ({
            perihal:      s.perihal,
            noSurat:      s.noSurat   ?? null,
            lampiran:     s.lampiran  ?? null,
            tujuan,
            tanggalSurat: new Date(s.tanggalSurat),
          })),
        } : undefined,
      },
      include: { dept: true, detailSurat: true },
    })
    return serializeSurat(row as unknown as Record<string, unknown>)
  })
}

  async delete(id: number, dept: string): Promise<void> {
    const department = await prisma.department.findUnique({
      where: { id: dept },
      select: { shortName: true },
    })

    if (isPIDept(department?.shortName ?? "")) {
      await prisma.registerPI.delete({ where: { id } })
    } else {
      await prisma.registerSurat.delete({ where: { id } })
    }
  }

  async getPreviewNomor(deptId: string): Promise<string> {
    const dept = await prisma.department.findUnique({ where: { id: deptId } })
    if (!dept) throw new Error(`NOT_FOUND: Departemen '${deptId}' tidak ditemukan`)

    const last = isPIDept(dept.shortName)
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
