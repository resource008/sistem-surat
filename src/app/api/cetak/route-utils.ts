import { NextResponse } from "next/server"
import { AppError } from "@/lib/errors"
import { requireUserPermission } from "@/lib/current-user-permissions"
import { SuratRepository } from "@/infrastructure/repositories/surat-repositories"
import type { PaginatedResult, SuratResult } from "@/domain/surat/repositories"

const MAX_IDS = 100
const repository = new SuratRepository()

function isPaginatedResult(value: SuratResult[] | PaginatedResult<SuratResult>): value is PaginatedResult<SuratResult> {
  return !Array.isArray(value)
}

function parseIds(idsParam: string | null) {
  if (!idsParam?.trim()) return []

  const parts = idsParam.split(",").map((part) => part.trim()).filter(Boolean)
  if (parts.length === 0) return []

  const ids = parts.map((part) => Number(part))
  const hasInvalidId = parts.some((part, index) => !/^\d+$/.test(part) || !Number.isInteger(ids[index]) || ids[index] <= 0)

  if (hasInvalidId) {
    throw new AppError(400, "Parameter ids tidak valid")
  }

  return ids.slice(0, MAX_IDS)
}

function filterByPrintColumnName(data: SuratResult[], printColumnName: string) {
  const normalized = printColumnName.trim().toLowerCase()

  return data.filter((item) =>
    (item.dept.printColumnName ?? "").trim().toLowerCase() === normalized
  )
}

function compactCetakResponse(data: SuratResult[]) {
  return data.map((item) => ({
    ...item,
    dept: {
      id:              item.dept.id,
      shortName:       item.dept.shortName,
      printColumnName: item.dept.printColumnName,
    },
  }))
}

export async function getCetakByPrintColumnName(req: Request, printColumnName: string) {
  try {
    await requireUserPermission("canPrint")

    const { searchParams } = new URL(req.url)
    const ids = parseIds(searchParams.get("ids"))
    const includeColumns = searchParams.get("includeColumns") === "true"

    if (ids.length === 0) {
      return NextResponse.json([])
    }

    const result = await repository.findAll(null, ids)
    const data = isPaginatedResult(result) ? result.data : result
    const filteredData = filterByPrintColumnName(data, printColumnName)

    return NextResponse.json(includeColumns ? filteredData : compactCetakResponse(filteredData))
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    const message = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json({
      error : `Gagal mengambil data cetak ${printColumnName}`,
      detail: process.env.NODE_ENV === "development" ? message : undefined,
    }, { status: 500 })
  }
}

export async function getAllCetak(req: Request) {
  try {
    await requireUserPermission("canPrint")

    const { searchParams } = new URL(req.url)
    const ids = parseIds(searchParams.get("ids"))
    const includeColumns = searchParams.get("includeColumns") === "true"

    if (ids.length === 0) {
      return NextResponse.json([])
    }

    const result = await repository.findAll(null, ids)
    const data = isPaginatedResult(result) ? result.data : result

    return NextResponse.json(includeColumns ? data : compactCetakResponse(data))
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }

    const message = error instanceof Error ? error.message : "Unknown error"

    return NextResponse.json({
      error : "Gagal mengambil semua data cetak",
      detail: process.env.NODE_ENV === "development" ? message : undefined,
    }, { status: 500 })
  }
}
