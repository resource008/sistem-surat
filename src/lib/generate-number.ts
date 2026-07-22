import { prisma } from "@/infrastructure/databases/prisma-client"
import { formatRegisterNumber } from "@/lib/format-register-number"

function getRegisterYear(date = new Date()) {
  const year = date.getUTCFullYear()
  return Number.isFinite(year) ? year : new Date().getUTCFullYear()
}

// Increment counter dan kembalikan nomor baru.
// Dipanggil saat CREATE surat, counter langsung naik untuk departemen dan tahun terkait.
export async function generateNomor(deptId: string, tanggalTerima = new Date()): Promise<string> {
  const year = getRegisterYear(tanggalTerima)
  const rows = await prisma.$queryRaw<Array<{ counter: number | bigint }>>`
    INSERT INTO nomor_counter (dept_id, year, counter)
    VALUES (${deptId}, ${year}, 1)
    ON CONFLICT (dept_id, year) DO UPDATE
    SET counter = nomor_counter.counter + 1
    RETURNING counter
  `

  return formatRegisterNumber(Number(rows[0]?.counter ?? 1))
}

// Preview nomor berikutnya tanpa increment.
export async function getNextNomor(deptId: string, tanggalTerima = new Date()): Promise<string> {
  const year = getRegisterYear(tanggalTerima)
  const rows = await prisma.$queryRaw<Array<{ counter: number | bigint | null }>>`
    SELECT counter
    FROM nomor_counter
    WHERE dept_id = ${deptId}
      AND year = ${year}
    LIMIT 1
  `

  const next = Number(rows[0]?.counter ?? 0) + 1
  return formatRegisterNumber(next)
}
