import { prisma } from "@/infrastructure/databases/prisma-client"

// Increment counter dan kembalikan nomor baru
// Dipanggil saat CREATE surat — counter langsung naik
export async function generateNomor(deptId: string): Promise<string> {
  const counter = await prisma.nomorCounter.upsert({
    where:  { deptId },          // ← field sesuai schema: deptId bukan dept
    update: { counter: { increment: 1 } },
    create: { deptId, counter: 1 },
  })

  return String(counter.counter).padStart(4, "0")
}

// Preview nomor berikutnya TANPA increment
// Dipanggil saat form create untuk tampilan preview saja
export async function getNextNomor(deptId: string): Promise<string> {
  const counter = await prisma.nomorCounter.findUnique({
    where: { deptId },
  })

  const next = (counter?.counter ?? 0) + 1
  return String(next).padStart(4, "0")
}