// prisma/seed.ts
import 'dotenv/config'
import { PrismaPg }     from "@prisma/adapter-pg"
import { PrismaClient, Role } from "../src/generated/prisma"
import { scryptAsync }  from "@noble/hashes/scrypt"
import { randomBytes, bytesToHex } from "@noble/hashes/utils"
import { Pool }         from "pg"

const pool    = new Pool({ connectionString: process.env.DATABASE_URL! })
const adapter = new PrismaPg(pool as any)
const prisma  = new PrismaClient({ adapter })

async function hashPassword(password: string): Promise<string> {
  const salt = bytesToHex(randomBytes(16))
  const key  = await scryptAsync(password.normalize("NFKC"), salt, {
    N: 16384, r: 16, p: 1, dkLen: 64,
    maxmem: 128 * 16384 * 16 * 2,
  })
  return `${salt}:${bytesToHex(key)}`
}

async function main() {
  console.log("🌱 Memulai seeding...")

  // ─── 1. DEPARTEMEN ────────────────────────────────────────────
  console.log("📂 Membuat data departemen...")
  const depts = [
    { id: "HRD", shortName: "HRD", tujuan: "HRD" },
    { id: "IT",  shortName: "IT",  tujuan: "IT"  },
    { id: "ENG", shortName: "ENG", tujuan: "ENG" },
    { id: "BPA", shortName: "BPA", tujuan: "BPA" },
    { id: "SND", shortName: "SND", tujuan: "SND" },
    { id: "SMD", shortName: "SMD", tujuan: "SMD" },
    { id: "IAD", shortName: "IAD", tujuan: "IAD" },
    { id: "MD",  shortName: "MD",  tujuan: "MD"  },
    { id: "GIS", shortName: "GIS", tujuan: "GIS" },
    { id: "FAD", shortName: "FAD", tujuan: "FAD" },
    { id: "TAX", shortName: "TAX", tujuan: "TAX" },
    { id: "PS",  shortName: "PS",  tujuan: "PS"  },
    { id: "ERP", shortName: "ERP", tujuan: "ERP" },
    { id: "CID", shortName: "CID", tujuan: "CID" },
    { id: "MED", shortName: "MED", tujuan: "MED" },
    { id: "OMD", shortName: "OMD", tujuan: "OMD" },
    { id: "PI",  shortName: "PI",  tujuan: "PI"  },
  ]
  for (const d of depts) {
    await prisma.department.upsert({
      where:  { id: d.id },
      update: { shortName: d.shortName, tujuan: d.tujuan },
      create: d,
    })
  }
  console.log(`   ✅ ${depts.length} departemen selesai`)

  // ─── 2. USERS ──────────────────────────────────────────────────
  console.log("👥 Membuat data users...")
  const users = [
    { name: "Admin",      email: "admin@admin.com", username: "admin",  password: "admin123", role: Role.ADMIN },
    { name: "Staff Satu", email: "staff@staff.com", username: "staff1", password: "staff123", role: Role.STAFF },
    { name: "PKL Satu",   email: "pkl@pkl.com",     username: "pkl1",   password: "pkl123",   role: Role.PKL   },
  ]
  for (const u of users) {
    const existing = await prisma.user.findUnique({ where: { email: u.email } })
    if (existing) { console.log(`   ⏩ ${u.email} sudah ada`); continue }

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
    console.log(`   ✅ ${u.email} dibuat`)
  }

  // ─── 3. DATA SURAT ─────────────────────────────────────────────
  console.log("📝 Membuat data surat simulasi...")

  const existingCount = await prisma.registerSurat.count()
  if (existingCount > 0) {
    console.log(`   ⏩ Data surat sudah ada (${existingCount} register), dilewati`)
  } else {
    const dataSurat = [
      // ─── HRD ───────────────────────────────────────────────────
      {
        nomor: "0001", deptId: "HRD",
        tanggalTerima: new Date("2026-04-01"),
        asalSurat: "PT. Maju Mundur", tujuan: "HRD",
        detailSurat: [{
          perihal: "Permohonan Cuti Massal Karyawan Q2 2026",
          noSurat: "092/HRD/III/2026", lampiran: null,
          tanggalSurat: new Date("2026-03-28"),
        }],
      },
      {
        nomor: "0002", deptId: "HRD",
        tanggalTerima: new Date("2026-04-03"),
        asalSurat: "Dinas Ketenagakerjaan", tujuan: "HRD",
        detailSurat: [{
          perihal: "Undangan Rapat Koordinasi Ketenagakerjaan",
          noSurat: "045/DISNAKER/IV/2026", lampiran: "1 SET",
          tanggalSurat: new Date("2026-04-01"),
        }],
      },
      // ─── IT ────────────────────────────────────────────────────
      {
        nomor: "0001", deptId: "IT",
        tanggalTerima: new Date("2026-04-02"),
        asalSurat: "PT. Solusi Digital", tujuan: "IT",
        detailSurat: [{
          perihal: "Penawaran Lisensi Software ERP",
          noSurat: "SD/2026/031", lampiran: "1 SET",
          tanggalSurat: new Date("2026-03-30"),
        }],
      },
      // ─── ENG ───────────────────────────────────────────────────
      {
        nomor: "0001", deptId: "ENG",
        tanggalTerima: new Date("2026-04-04"),
        asalSurat: "PT. Konstruksi Nusantara", tujuan: "ENG",
        detailSurat: [{
          perihal: "Laporan Progres Pembangunan Gedung Baru",
          noSurat: "KN/ENG/IV/2026/014", lampiran: "3 SET",
          tanggalSurat: new Date("2026-04-02"),
        }],
      },
      // ─── BPA ───────────────────────────────────────────────────
      {
        nomor: "0001", deptId: "BPA",
        tanggalTerima: new Date("2026-04-03"),
        asalSurat: "Konsultan Bisnis Indonesia", tujuan: "BPA",
        detailSurat: [{
          perihal: "Rekomendasi Perbaikan Proses Bisnis Q2",
          noSurat: "KBI/2026/IV/007", lampiran: "1 SET",
          tanggalSurat: new Date("2026-04-01"),
        }],
      },
      // ─── SND ───────────────────────────────────────────────────
      {
        nomor: "0001", deptId: "SND",
        tanggalTerima: new Date("2026-04-05"),
        asalSurat: "PT. Distributor Utama", tujuan: "SND",
        detailSurat: [{
          perihal: "Konfirmasi Kontrak Distribusi 2026",
          noSurat: "DU/KONTR/IV/2026/22", lampiran: null,
          tanggalSurat: new Date("2026-04-03"),
        }],
      },
      // ─── SMD ───────────────────────────────────────────────────
      {
        nomor: "0001", deptId: "SMD",
        tanggalTerima: new Date("2026-04-04"),
        asalSurat: "Supplier Logistik Andalan", tujuan: "SMD",
        detailSurat: [{
          perihal: "Perubahan Jadwal Pengiriman Barang",
          noSurat: "SLA/IV/2026/033", lampiran: null,
          tanggalSurat: new Date("2026-04-02"),
        }],
      },
      // ─── IAD ───────────────────────────────────────────────────
      {
        nomor: "0001", deptId: "IAD",
        tanggalTerima: new Date("2026-04-06"),
        asalSurat: "Kantor Akuntan Publik", tujuan: "IAD",
        detailSurat: [{
          perihal: "Jadwal Audit Internal Q1 2026",
          noSurat: "KAP/2026/IV/019", lampiran: "1 SET",
          tanggalSurat: new Date("2026-04-04"),
        }],
      },
      // ─── FAD ───────────────────────────────────────────────────
      {
        nomor: "0001", deptId: "FAD",
        tanggalTerima: new Date("2026-04-04"),
        asalSurat: "Bank BCA", tujuan: "FAD",
        detailSurat: [{
          perihal: "Konfirmasi Pencairan Dana Operasional",
          noSurat: "BCA/2026/04/5521", lampiran: null,
          tanggalSurat: new Date("2026-04-02"),
        }],
      },
      // ─── TAX ───────────────────────────────────────────────────
      {
        nomor: "0001", deptId: "TAX",
        tanggalTerima: new Date("2026-04-05"),
        asalSurat: "Kantor Pajak Pratama", tujuan: "TAX",
        detailSurat: [{
          perihal: "Pemberitahuan Pemeriksaan Pajak Tahunan",
          noSurat: "KPP/2026/IV/112", lampiran: "2 SET",
          tanggalSurat: new Date("2026-04-03"),
        }],
      },
      // ─── MED ───────────────────────────────────────────────────
      {
        nomor: "0001", deptId: "MED",
        tanggalTerima: new Date("2026-04-06"),
        asalSurat: "Rumah Sakit Sehat Selalu", tujuan: "MED",
        detailSurat: [{
          perihal: "Undangan Pemeriksaan Kesehatan Tahunan Karyawan",
          noSurat: "AKN/PROP/IV/2026/08", lampiran: "1 SET",
          tanggalSurat: new Date("2026-04-05"),
        }],
      },
      {
        nomor: "0002", deptId: "MED",
        tanggalTerima: new Date("2026-04-06"),
        asalSurat: "Rumah Sakit Sehat Selalu", tujuan: "MED",
        detailSurat: [{
          perihal: "Undangan Pemeriksaan Kesehatan Tahunan Karyawan",
          noSurat: "AKN/PROP/IV/2026/08", lampiran: "1 SET",
          tanggalSurat: new Date("2026-04-05"),
        }],
      },
      // ─── OMD ───────────────────────────────────────────────────
      {
        nomor: "0001", deptId: "OMD",
        tanggalTerima: new Date("2026-04-04"),
        asalSurat: "Kementerian BUMN", tujuan: "OMD",
        detailSurat: [{
          perihal: "Surat Edaran Tata Kelola Organisasi dan Manajemen",
          noSurat: "KBUMN/SE/IV/2026/017", lampiran: "1 SET",
          tanggalSurat: new Date("2026-04-02"),
        }],
      },
      {
        nomor: "0002", deptId: "OMD",
        tanggalTerima: new Date("2026-04-08"),
        asalSurat: "Lembaga Sertifikasi Profesi", tujuan: "OMD",
        detailSurat: [{
          perihal: "Jadwal Sertifikasi Kompetensi Manajerial Karyawan",
          noSurat: "LSP/OMD/IV/2026/044", lampiran: null,
          tanggalSurat: new Date("2026-04-06"),
        }],
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
          detailSurat: { create: s.detailSurat },
        },
      })
      console.log(`   ✅ Register ${register.deptId}#${register.nomor} dibuat`)
    }
  }

  // ─── 4. DATA PI ────────────────────────────────────────────────
  console.log("📋 Membuat data PI simulasi...")

  const existingPICount = await prisma.registerPI.count()
  if (existingPICount > 0) {
    console.log(`   ⏩ Data PI sudah ada (${existingPICount} register), dilewati`)
  } else {
    const dataPI = [
      {
        nomor: "0001", deptId: "PI",
        tanggalTerima: new Date("2026-04-05"),
        asalSurat: "PT. Investama Nusantara",
        detailPI: [{
          namaSupplier: "PT. Investama Nusantara",
          noInvoice:    "INV/2026/04/001",
          nomorSurat:   "IN/PROP/IV/2026/08",
          tanggalSurat: new Date("2026-04-03"),
          tujuan:       "PI",
          cc:           null,
        }],
      },
      {
        nomor: "0002", deptId: "PI",
        tanggalTerima: new Date("2026-04-07"),
        asalSurat: "Bappeda Provinsi Sumatera Utara",
        detailPI: [{
          namaSupplier: "Bappeda Provinsi Sumatera Utara",
          noInvoice:    null,
          nomorSurat:   "BAPPEDA/IV/2026/031",
          tanggalSurat: new Date("2026-04-05"),
          tujuan:       "PI",
          cc:           null,
        }],
      },
    ]

    for (const p of dataPI) {
      const register = await prisma.registerPI.create({
        data: {
          nomor:         p.nomor,
          deptId:        p.deptId,
          tanggalTerima: p.tanggalTerima,
          asalSurat:     p.asalSurat,
          detailPI: { create: p.detailPI },
        },
      })
      console.log(`   ✅ Register PI#${register.nomor} dibuat`)
    }
  }

  // ─── 5. NOMOR COUNTER ──────────────────────────────────────────
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
    { deptId: "MED", counter: 2 },
    { deptId: "OMD", counter: 2 },
    { deptId: "PI",  counter: 2 },
  ]
  for (const c of counters) {
    await prisma.nomorCounter.upsert({
      where:  { deptId: c.deptId },
      update: { counter: c.counter },
      create: { deptId: c.deptId, counter: c.counter },
    })
  }
  console.log(`   ✅ ${counters.length} counter selesai`)

  console.log("\n✨ Seeding selesai!")
}

main()
  .catch((e) => { console.error("❌ Seeding gagal:", e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect(); await pool.end() })