import { prisma } from "@/infrastructure/databases/prisma-client"

const deptSelect = {
  dept: {
    select: { id: true, name: true, shortName: true },
  },
} as const

export class SuratRepository {

  // Cari surat berdasarkan id DAN deptId sekaligus
  // Ini mencegah user dept A bisa akses surat dept B hanya dengan ganti id
  static async findByIdAndDept(id: number, deptId: string) {
    return prisma.dataSurat.findFirst({
      where:   { id, deptId },
      include: deptSelect,
    })
  }

  // List semua surat (dengan optional filter dept)
  static async findAll(deptId?: string) {
    return prisma.dataSurat.findMany({
      where:   deptId ? { deptId } : undefined,
      include: deptSelect,
      orderBy: { tanggalTerima: "desc" },
    })
  }

  // Update — tetap validasi deptId agar tidak bisa cross-dept
  static async update(
    id: number,
    deptId: string,
    data: {
      perihal?:       string
      asalSurat?:     string
      tujuan?:        string
      noSurat?:       string | null
      lampiran?:      string | null
      tanggalSurat?:  Date
      tanggalTerima?: Date
    }
  ) {
    // Pastikan surat milik dept ini dulu
    const existing = await prisma.dataSurat.findFirst({
      where: { id, deptId },
    })
    if (!existing) return null

    return prisma.dataSurat.update({
      where:   { id },
      data,
      include: deptSelect,
    })
  }

  // Delete — validasi deptId juga
  static async delete(id: number, deptId: string) {
    const existing = await prisma.dataSurat.findFirst({
      where: { id, deptId },
    })
    if (!existing) return null

    return prisma.dataSurat.delete({ where: { id } })
  }

  // Create surat baru
  static async create(data: {
    deptId:        string
    nomor:         string
    asalSurat:     string
    perihal:       string
    tujuan:        string
    noSurat?:      string | null
    lampiran?:     string | null
    tanggalSurat:  Date
    tanggalTerima: Date
  }) {
    return prisma.dataSurat.create({
      data,
      include: deptSelect,
    })
  }
}