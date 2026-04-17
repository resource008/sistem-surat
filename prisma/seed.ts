import 'dotenv/config'
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient, Role } from "../src/generated/prisma"
import { scryptAsync } from "@noble/hashes/scrypt"
import { randomBytes, bytesToHex } from "@noble/hashes/utils"
import { Pool } from "pg"

// Setup Adapter
const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
})
const adapter = new PrismaPg(pool as any)
const prisma = new PrismaClient({ adapter })

// Hashing Password
async function hashPassword(password: string): Promise<string> {
  const salt = bytesToHex(randomBytes(16))
  const key = await scryptAsync(password.normalize("NFKC"), salt, {
    N: 16384,
    r: 16,
    p: 1,
    dkLen: 64,
    maxmem: 128 * 16384 * 16 * 2,
  })
  return `${salt}:${bytesToHex(key)}`
}

async function main() {
  console.log("🌱 Memulai seeding...")

  // ─── 1. DEPARTEMEN ────────────────────────────────────────────────────────
  console.log("📂 Membuat data departemen...")

  const depts = [
  { id: "HRD", shortName: "HRD" },
  { id: "IT",  shortName: "IT"  },
  { id: "ENG", shortName: "ENG" },
  { id: "BPA", shortName: "BPA" },
  { id: "SND", shortName: "SND" },
  { id: "SMD", shortName: "SMD" },
  { id: "IAD", shortName: "IAD" },
  { id: "MD",  shortName: "MD"  },
  { id: "GIS", shortName: "GIS" },
  { id: "FAD", shortName: "FAD" },
  { id: "TAX", shortName: "TAX" },
  { id: "PS",  shortName: "PS"  },
  { id: "ERP", shortName: "ERP" },
  { id: "CID", shortName: "CID" },
  { id: "MED", shortName: "MED" },
]

for (const d of depts) {
  await prisma.department.upsert({
    where:  { id: d.id },
    update: { shortName: d.shortName },
    create: d,
  })
}

  console.log(`   ✅ ${depts.length} departemen berhasil dibuat`)

  // ─── 2. USERS ─────────────────────────────────────────────────────────────
  console.log("👥 Membuat data users...")

  const users = [
    { name: "Admin",      email: "admin@admin.com", username: "admin",  password: "admin123", role: Role.ADMIN },
    { name: "Staff Satu", email: "staff@staff.com", username: "staff1", password: "staff123", role: Role.STAFF },
    { name: "PKL Satu",   email: "pkl@pkl.com",     username: "pkl1",   password: "pkl123",   role: Role.PKL   },
  ]

  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (existing) {
      console.log(`   ⏩ User ${u.email} sudah ada, dilewati`)
      continue
    }

    const user = await prisma.user.create({
      data: {
        id:            crypto.randomUUID(),
        name:          u.name,
        email:         u.email,
        username:      u.username,
        emailVerified: true,
        role:          u.role,
      },
    })

    await prisma.account.create({
      data: {
        id:         crypto.randomUUID(),
        accountId:  user.id,
        providerId: "credential",
        userId:     user.id,
        password:   await hashPassword(u.password),
      },
    })

    console.log(`   ✅ User ${u.email} berhasil dibuat`)
  }

  // ─── 3. DATA SURAT ────────────────────────────────────────────────────────
  console.log("📝 Membuat data surat simulasi...")

  const dataSurat = [
    {
      nomor:         "0001",
      deptId:        "HRD",
      tanggalTerima: new Date("2026-04-01"),
      tanggalSurat:  new Date("2026-03-28"),
      asalSurat:     "PT. Maju Mundur",
      perihal:       "Permohonan Cuti Massal Karyawan Q2 2026",
      tujuan:        "HRD",
      noSurat:       "092/HRD/III/2026",
      lampiran:      null,
    },
    {
      nomor:         "0002",
      deptId:        "HRD",
      tanggalTerima: new Date("2026-04-03"),
      tanggalSurat:  new Date("2026-04-01"),
      asalSurat:     "Dinas Ketenagakerjaan",
      perihal:       "Undangan Rapat Koordinasi Ketenagakerjaan",
      tujuan:        "HRD",
      noSurat:       "045/DISNAKER/IV/2026",
      lampiran:      "1 SET",
    },
    {
      nomor:         "0001",
      deptId:        "IT",
      tanggalTerima: new Date("2026-04-02"),
      tanggalSurat:  new Date("2026-03-30"),
      asalSurat:     "PT. Solusi Digital",
      perihal:       "Penawaran Lisensi Software ERP",
      tujuan:        "IT",
      noSurat:       "SD/2026/031",
      lampiran:      "1 SET",
    },
    {
      nomor:         "0001",
      deptId:        "ENG",
      tanggalTerima: new Date("2026-04-04"),
      tanggalSurat:  new Date("2026-04-02"),
      asalSurat:     "PT. Konstruksi Nusantara",
      perihal:       "Laporan Progres Pembangunan Gedung Baru",
      tujuan:        "ENG",
      noSurat:       "KN/ENG/IV/2026/014",
      lampiran:      "3 SET",
    },
    {
      nomor:         "0001",
      deptId:        "BPA",
      tanggalTerima: new Date("2026-04-03"),
      tanggalSurat:  new Date("2026-04-01"),
      asalSurat:     "Konsultan Bisnis Indonesia",
      perihal:       "Rekomendasi Perbaikan Proses Bisnis Q2",
      tujuan:        "BPA",
      noSurat:       "KBI/2026/IV/007",
      lampiran:      "1 SET",
    },
    {
      nomor:         "0001",
      deptId:        "SND",
      tanggalTerima: new Date("2026-04-05"),
      tanggalSurat:  new Date("2026-04-03"),
      asalSurat:     "PT. Distributor Utama",
      perihal:       "Konfirmasi Kontrak Distribusi 2026",
      tujuan:        "SND",
      noSurat:       "DU/KONTR/IV/2026/22",
      lampiran:      null,
    },
    {
      nomor:         "0001",
      deptId:        "SMD",
      tanggalTerima: new Date("2026-04-04"),
      tanggalSurat:  new Date("2026-04-02"),
      asalSurat:     "Supplier Logistik Andalan",
      perihal:       "Perubahan Jadwal Pengiriman Barang",
      tujuan:        "SMD",
      noSurat:       "SLA/IV/2026/033",
      lampiran:      null,
    },
    {
      nomor:         "0001",
      deptId:        "IAD",
      tanggalTerima: new Date("2026-04-06"),
      tanggalSurat:  new Date("2026-04-04"),
      asalSurat:     "Kantor Akuntan Publik",
      perihal:       "Jadwal Audit Internal Q1 2026",
      tujuan:        "IAD",
      noSurat:       "KAP/2026/IV/019",
      lampiran:      "1 SET",
    },
    {
      nomor:         "0001",
      deptId:        "FAD",
      tanggalTerima: new Date("2026-04-04"),
      tanggalSurat:  new Date("2026-04-02"),
      asalSurat:     "Bank BCA",
      perihal:       "Konfirmasi Pencairan Dana Operasional",
      tujuan:        "FAD",
      noSurat:       "BCA/2026/04/5521",
      lampiran:      null,
    },
    {
      nomor:         "0001",
      deptId:        "TAX",
      tanggalTerima: new Date("2026-04-05"),
      tanggalSurat:  new Date("2026-04-03"),
      asalSurat:     "Kantor Pajak Pratama",
      perihal:       "Pemberitahuan Pemeriksaan Pajak Tahunan",
      tujuan:        "TAX",
      noSurat:       "KPP/2026/IV/112",
      lampiran:      "2 SET",
    },
    {
      nomor:         "0001",
      deptId:        "MED",
      tanggalTerima: new Date("2026-04-06"),
      tanggalSurat:  new Date("2026-04-05"),
      asalSurat:     "Rumah Sakit Sehat Selalu",
      perihal:       "Undangan Pemeriksaan Kesehatan Tahunan Karyawan",
      tujuan:        "MED",
      noSurat:       "AKN/PROP/IV/2026/08",
      lampiran:      "1 SET",
    },
    {
      nomor:         "0002",
      deptId:        "MED",
      tanggalTerima: new Date("2026-04-06"),
      tanggalSurat:  new Date("2026-04-05"),
      asalSurat:     "Rumah Sakit Sehat Selalu",
      perihal:       "Undangan Pemeriksaan Kesehatan Tahunan Karyawan",
      tujuan:        "MED",
      noSurat:       "AKN/PROP/IV/2026/08",
      lampiran:      "1 SET",
    },
  ]

  for (const s of dataSurat) {
  const register = await prisma.registerSurat.create({
    data: {
      nomor:         s.nomor,
      deptId:        s.deptId,
      tanggalTerima: s.tanggalTerima,
      asalSurat:     s.asalSurat,
      tujuan:        s.tujuan,
    },
  })

  await prisma.detailSurat.create({
    data: {
      registerId:   register.id,
      perihal:      s.perihal,
      noSurat:      s.noSurat,
      lampiran:     s.lampiran,
      tanggalSurat: s.tanggalSurat,
    },
  })
}

  // ─── 4. NOMOR COUNTER ─────────────────────────────────────────────────────
  console.log("🔢 Mengatur counter penomoran...")

  const counters = [
    { deptId: "HRD", counter: 2 },
    { deptId: "IT",  counter: 1 },
    { deptId: "ENG", counter: 1 },
    { deptId: "BPA", counter: 1 },
    { deptId: "SND", counter: 1 },
    { deptId: "SMD", counter: 1 },
    { deptId: "IAD", counter: 1 },
    { deptId: "MD",  counter: 0 },
    { deptId: "GIS", counter: 0 },
    { deptId: "FAD", counter: 1 },
    { deptId: "TAX", counter: 1 },
    { deptId: "PS",  counter: 0 },
    { deptId: "ERP", counter: 0 },
    { deptId: "CID", counter: 0 },
    { deptId: "MED", counter: 1 },
  ]

  for (const c of counters) {
    await prisma.nomorCounter.upsert({
      where:  { deptId: c.deptId },
      update: { counter: c.counter },
      create: { deptId: c.deptId, counter: c.counter },
    })
  }
  console.log(`   ✅ ${counters.length} counter berhasil diatur`)

  console.log("\n✨ Seeding selesai dengan sukses!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding gagal:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })