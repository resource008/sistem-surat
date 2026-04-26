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