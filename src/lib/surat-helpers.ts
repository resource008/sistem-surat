import { format } from "date-fns"
import { id } from "date-fns/locale"
import type { RegisterSurat, CetakGroup } from "@/types/surat.types"

export function groupCetakData(data: RegisterSurat[]): CetakGroup[] {
  const map = new Map<string, CetakGroup>()

  for (const reg of data) {
    const dateStr = format(new Date(reg.tanggalTerima), "yyyy-MM-dd")
    const key = `${dateStr}__${reg.dept.shortName}`

    if (!map.has(key)) {
      const labelDate = format(new Date(reg.tanggalTerima), "dd MMMM yyyy", { locale: id }).toUpperCase()
      map.set(key, {
        key,
        label: `${labelDate} (${reg.dept.shortName})`,
        date: reg.tanggalTerima,
        dept: reg.dept.shortName,
        registers: [],
      })
    }
    map.get(key)!.registers.push(reg)
  }

  return Array.from(map.values()).sort((a, b) => {
    const diff = new Date(a.date).getTime() - new Date(b.date).getTime()
    return diff !== 0 ? diff : a.dept.localeCompare(b.dept)
  })
}

export function calcTotalSurat(data: RegisterSurat[]): number {
  return data.reduce((sum, r) => {
    const detail = r.detailSurat ?? (r as any).detailPI ?? []
    return sum + detail.length
  }, 0)
}

// --- Helper Format Tanggal ---
export function formatTanggalCetak(dateStr?: string | Date | null): string {
  if (!dateStr) return "-"
  try {
    return format(new Date(dateStr), "dd MMMM yyyy", { locale: id }).toUpperCase()
  } catch {
    return "-"
  }
}

export function formatTanggalShort(dateStr?: string | Date | null): string {
  if (!dateStr) return "-"
  try {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: id })
  } catch {
    return "-"
  }
}

// --- Helper Resolusi Label Detail ---
export function getDetailLabel(detail: any, field: "perihal" | "lampiran" | "noSurat") {
  if (field === "perihal")  return detail.perihal  ?? detail.namaSupplier ?? "-"
  if (field === "lampiran") return detail.lampiran ?? detail.noInvoice    ?? "-"
  if (field === "noSurat")  return detail.noSurat  ?? detail.nomorSurat   ?? "-"
  return "-"
}