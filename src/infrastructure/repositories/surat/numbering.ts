import type { Prisma } from "@/generated/prisma"
import { prisma } from "@/infrastructure/databases/prisma-client"
import { AppError } from "@/lib/errors"
import { formatRegisterNumber } from "@/lib/format-register-number"
import { findActiveDepartmentByRef } from "./departments"

export async function generateNomor(
  tx: Prisma.TransactionClient,
  deptId: string,
  tanggalTerima: Date,
): Promise<string> {
  const year = getRegisterYear(tanggalTerima)
  const registers = await tx.registerSurat.findMany({
    where: {
      deptId,
      tanggalTerima: {
        gte: new Date(Date.UTC(year, 0, 1)),
        lt: new Date(Date.UTC(year + 1, 0, 1)),
      },
    },
    select: { nomor: true },
  })

  const last = registers.reduce((max, register) => {
    const number = Number.parseInt(register.nomor, 10)
    return Number.isNaN(number) ? max : Math.max(max, number)
  }, 0)

  const rows = await tx.$queryRawUnsafe<Array<{ counter: number | bigint }>>(
    `
      INSERT INTO nomor_counter (dept_id, "year", counter)
      VALUES ($1, $2, $3)
      ON CONFLICT (dept_id, "year") DO UPDATE
      SET counter = GREATEST(nomor_counter.counter + 1, EXCLUDED.counter)
      RETURNING counter
    `,
    deptId,
    year,
    last + 1
  )

  const next = Number(rows[0]?.counter ?? last + 1)
  return formatRegisterNumber(next)
}

function getRegisterYear(date: Date) {
  const year = date.getUTCFullYear()
  return Number.isFinite(year) ? year : new Date().getUTCFullYear()
}

export async function getPreviewNomorForDepartment(deptId: string, tanggalTerima = new Date()): Promise<string> {
  const dept = await findActiveDepartmentByRef(deptId)
  if (!dept) throw new AppError(404, `Departemen '${deptId}' tidak ditemukan`)

  const year = getRegisterYear(tanggalTerima)
  const startDate = new Date(Date.UTC(year, 0, 1))
  const endDate = new Date(Date.UTC(year + 1, 0, 1))

  const [registers, counter] = await Promise.all([
    prisma.registerSurat.findMany({
      where:  {
        deptId: dept.id,
        tanggalTerima: {
          gte: startDate,
          lt: endDate,
        },
      },
      select: { nomor: true },
    }),
    prisma.$queryRaw<Array<{ counter: number | bigint | null }>>`
      SELECT counter
      FROM nomor_counter
      WHERE dept_id = ${dept.id}
        AND "year" = ${year}
      LIMIT 1
    `,
  ])

  const lastNumber = Math.max(
    ...registers.map((register) => Number.parseInt(register.nomor, 10)).filter(Number.isFinite),
    Number(counter[0]?.counter ?? 0)
  )
  return formatRegisterNumber(lastNumber + 1)
}
