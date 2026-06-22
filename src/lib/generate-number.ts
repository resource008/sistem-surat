import { prisma } from "@/infrastructure/databases/prisma-client"
import { formatRegisterNumber } from "@/lib/format-register-number"

// Increment counter dan kembalikan nomor baru
// Dipanggil saat CREATE surat — counter langsung naik
export async function generateNomor(deptId: string): Promise<string> {
  const counter = await prisma.nomorCounter.upsert({
    where:  { deptId },          // ← field sesuai schema: deptId bukan dept
    update: { counter: { increment: 1 } },
    create: { deptId, counter: 1 },
  })

  return formatRegisterNumber(counter.counter)
}

// Preview nomor berikutnya TANPA increment
// Dipanggil saat form create untuk tampilan preview saja
export async function getNextNomor(deptId: string): Promise<string> {
  const counter = await prisma.nomorCounter.findUnique({
    where: { deptId },
  })

  const next = (counter?.counter ?? 0) + 1
  return formatRegisterNumber(next)
}
