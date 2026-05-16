import { prisma } from "@/infrastructure/databases/prisma-client"

const includeAll = {
  dept:        true,
  detailSurat: true,
} as const

type DetailInput = {
  perihal:      string
  noSurat?:     string | null
  lampiran?:    string | null
  tanggalSurat: Date
}

type CreateInput = {
  nomor:         string
  asalSurat:     string
  tujuan?:       string | null
  tanggalTerima: Date
  deptId:        string
  detailSurat:   DetailInput[]
}

type UpdateInput = {
  nomor?:         string
  asalSurat?:     string
  tujuan?:        string | null
  tanggalTerima?: Date
  detailSurat?:   DetailInput[]
}

// null → undefined agar kompatibel dengan Prisma String? field
function toStr(v: string | null | undefined): string | undefined {
  return v ?? undefined
}

// mapping detail — null field dibuang
function mapDetail(d: DetailInput) {
  return {
    perihal:      d.perihal,
    noSurat:      toStr(d.noSurat),
    lampiran:     toStr(d.lampiran),
    tanggalSurat: d.tanggalSurat,
  }
}

export class SuratRepository {

  static async findAllByDept(deptId: string) {
    return prisma.registerSurat.findMany({
      where:   { deptId },
      include: includeAll,
      orderBy: { createdAt: "desc" },
    })
  }

  static async findByIdAndDept(id: number, deptId: string) {
    return prisma.registerSurat.findFirst({
      where:   { id, deptId },
      include: includeAll,
    })
  }

  static async create(data: CreateInput) {
    return prisma.registerSurat.create({
      data: {
        nomor:         data.nomor,
        asalSurat:     data.asalSurat,
        tujuan:        toStr(data.tujuan),   // ✅ null → undefined
        tanggalTerima: data.tanggalTerima,
        deptId:        data.deptId,
        detailSurat: {
          create: data.detailSurat.map(mapDetail),
        },
      },
      include: includeAll,
    })
  }

  static async update(id: number, deptId: string, data: UpdateInput) {
    return prisma.$transaction(async (tx) => {
      if (data.detailSurat) {
        await tx.detailSurat.deleteMany({ where: { registerId: id } })
      }

      return tx.registerSurat.update({
        where: { id, deptId },
        data: {
          ...(data.nomor         !== undefined && { nomor:         data.nomor                }),
          ...(data.asalSurat     !== undefined && { asalSurat:     data.asalSurat            }),
          ...(data.tanggalTerima !== undefined && { tanggalTerima: data.tanggalTerima        }),
          ...(data.tujuan        !== undefined && { tujuan:        toStr(data.tujuan)        }), // ✅ null → undefined
          ...(data.detailSurat   !== undefined && {
            detailSurat: {
              create: data.detailSurat.map(mapDetail),
            },
          }),
        },
        include: includeAll,
      })
    })
  }

  static async delete(id: number, deptId: string) {
    return prisma.registerSurat.delete({
      where: { id, deptId },
    })
  }
}

// ─── PI Repository ────────────────────────────────────────────────────────────

const includeAllPI = {
  dept:     true,
  detailPI: true,
} as const

type DetailPIInput = {
  namaSupplier: string
  noInvoice?:   string | null
  nomorSurat?:  string | null
  tujuan?:      string | null
  cc?:          string | null
  tanggalSurat: Date
}

type UpdatePIInput = {
  asalSurat?:     string
  tanggalTerima?: Date
  detailPI?:      DetailPIInput[]
}

function mapDetailPI(d: DetailPIInput) {
  return {
    namaSupplier: d.namaSupplier,
    noInvoice:    toStr(d.noInvoice),
    nomorSurat:   toStr(d.nomorSurat),
    tujuan:       toStr(d.tujuan),
    cc:           toStr(d.cc),
    tanggalSurat: d.tanggalSurat,
  }
}

export class PIRepository {

  static async findAll() {
    return prisma.registerPI.findMany({
      include: includeAllPI,
      orderBy: { createdAt: "desc" },
    })
  }

  static async findByIdAndDept(id: number, deptId: string) {
    return prisma.registerPI.findFirst({
      where:   { id, deptId },
      include: includeAllPI,
    })
  }

  static async update(id: number, deptId: string, data: UpdatePIInput) {
    return prisma.$transaction(async (tx) => {
      if (data.detailPI) {
        await tx.detailPI.deleteMany({ where: { registerId: id } })
      }

      return tx.registerPI.update({
        where: { id, deptId },
        data: {
          ...(data.asalSurat     !== undefined && { asalSurat:     data.asalSurat     }),
          ...(data.tanggalTerima !== undefined && { tanggalTerima: data.tanggalTerima }),
          ...(data.detailPI      !== undefined && {
            detailPI: { create: data.detailPI.map(mapDetailPI) },
          }),
        },
        include: includeAllPI,
      })
    })
  }

  static async delete(id: number, deptId: string) {
    return prisma.registerPI.delete({
      where: { id, deptId },
    })
  }
}