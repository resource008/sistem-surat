import type { Prisma } from "@/generated/prisma"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { formatRegisterNumber } from "@/lib/format-register-number"
import { findActiveDepartmentByRef } from "./departments"

export async function generateNomor(
  tx: Prisma.TransactionClient,
  deptId: string,
): Promise<string> {
  const registers = await tx.registerSurat.findMany({ where: { deptId }, select: { nomor: true } })

  const last = registers.reduce((max, register) => {
    const number = Number.parseInt(register.nomor, 10)
    return Number.isNaN(number) ? max : Math.max(max, number)
  }, 0)

  const rows = await tx.$queryRawUnsafe<Array<{ counter: number }>>(
    `
      INSERT INTO nomor_counter (dept_id, counter)
      VALUES ($1, $2)
      ON CONFLICT (dept_id) DO UPDATE
      SET counter = GREATEST(nomor_counter.counter + 1, EXCLUDED.counter)
      RETURNING counter
    `,
    deptId,
    last + 1
  )

  const next = rows[0]?.counter ?? last + 1
  return formatRegisterNumber(next)
}

export async function getPreviewNomorForDepartment(deptId: string): Promise<string> {
  const dept = await findActiveDepartmentByRef(deptId)
  if (!dept) throw new Error(`NOT_FOUND: Departemen '${deptId}' tidak ditemukan`)

  const [registers, counter] = await Promise.all([
    prisma.registerSurat.findMany({
      where:  { deptId: dept.id },
      select: { nomor: true },
    }),
    prisma.nomorCounter.findUnique({
      where: { deptId: dept.id },
      select: { counter: true },
    }),
  ])

  const lastNumber = Math.max(
    ...registers.map((register) => Number.parseInt(register.nomor, 10)).filter(Number.isFinite),
    counter?.counter ?? 0
  )
  return formatRegisterNumber(lastNumber + 1)
}
