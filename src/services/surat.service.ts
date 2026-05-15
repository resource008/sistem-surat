import { prisma } from "@/infrastructure/databases/prisma-client"

const PI_DEPT_ID = "PI"

export class SuratService {
  // ─── GET LOGIC ────────────────────────────────────────────────────────
  static async getAllSurat(type: string | null, idsParam: string | null) {
    const ids = idsParam?.split(",").map(Number).filter(Boolean)

    if (type === "pi") {
      return await prisma.registerPI.findMany({
        where: ids && ids.length > 0 ? { id: { in: ids } } : undefined,
        include: { dept: true, detailPI: true },
        orderBy: { tanggalTerima: "desc" },
      })
    }

    return await prisma.registerSurat.findMany({
      where: ids && ids.length > 0 ? { id: { in: ids } } : undefined,
      include: { dept: true, detailSurat: true },
      orderBy: { tanggalTerima: "desc" },
    })
  }

  // ─── POST LOGIC ───────────────────────────────────────────────────────
  static async createSurat(payload: any) {
    const { deptId, asalSurat, tanggalTerima } = payload

    const dept = await prisma.department.findUnique({ where: { id: deptId } })
    if (!dept) throw new Error(`NOT_FOUND: Departemen '${deptId}' tidak ditemukan`)

    const parsedTanggal = new Date(tanggalTerima)
    if (isNaN(parsedTanggal.getTime())) throw new Error("BAD_REQUEST: Format tanggal tidak valid")

    if (deptId === PI_DEPT_ID) {
      return await this.createPI(payload, parsedTanggal)
    } else {
      return await this.createBiasa(payload, parsedTanggal)
    }
  }

  // ─── HELPER: GENERATE NOMOR (Mencegah Duplikasi) ──────────────────────
  private static async generateNomor(tx: any, deptId: string, isPI: boolean): Promise<string> {
    const registers = isPI 
      ? await tx.registerPI.findMany({ where: { deptId }, select: { nomor: true } })
      : await tx.registerSurat.findMany({ where: { deptId }, select: { nomor: true } })

    const lastNumber = registers.reduce((max: number, r: any) => {
      const n = parseInt(r.nomor, 10)
      return isNaN(n) ? max : Math.max(max, n)
    }, 0)

    return String(lastNumber + 1).padStart(4, "0")
  }

  // ─── INTERNAL HANDLERS ────────────────────────────────────────────────
  private static async createPI(payload: any, parsedTanggal: Date) {
    const { deptId, asalSurat, piList } = payload
    if (!Array.isArray(piList) || piList.length === 0) throw new Error("BAD_REQUEST: piList kosong")

    return await prisma.$transaction(async (tx) => {
      // ✅ Panggil fungsi helper, tidak ada lagi logika pencarian nomor yang panjang di sini
      const nomor = await this.generateNomor(tx, deptId, true)

      return await tx.registerPI.create({
        data: {
          nomor,
          dept: { connect: { id: deptId } },
          asalSurat,
          tanggalTerima: parsedTanggal,
          detailPI: {
            create: piList.map((p: any) => ({
              namaSupplier: p.namaSupplier,
              noInvoice: p.noInvoice || null,
              nomorSurat: p.nomorSurat || null,
              tujuan: p.tujuan || null,
              cc: p.cc || null,
              tanggalSurat: new Date(p.tanggalSurat),
            })),
          },
        },
        include: { dept: true, detailPI: true },
      })
    })
  }

  private static async createBiasa(payload: any, parsedTanggal: Date) {
    const { deptId, asalSurat, tujuan, suratList } = payload
    if (!Array.isArray(suratList) || suratList.length === 0) throw new Error("BAD_REQUEST: suratList kosong")

    return await prisma.$transaction(async (tx) => {
      // ✅ Panggil fungsi helper
      const nomor = await this.generateNomor(tx, deptId, false)

      return await tx.registerSurat.create({
        data: {
          nomor,
          dept: { connect: { id: deptId } },
          asalSurat,
          tujuan: tujuan || "",
          tanggalTerima: parsedTanggal,
          detailSurat: {
            create: suratList.map((s: any) => ({
              perihal: s.perihal,
              noSurat: s.noSurat || null,
              lampiran: s.lampiran || null,
              tanggalSurat: new Date(s.tanggalSurat),
            })),
          },
        },
        include: { dept: true, detailSurat: true },
      })
    })
  }
}