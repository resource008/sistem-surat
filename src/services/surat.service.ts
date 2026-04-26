import { format } from "date-fns"
import { id }     from "date-fns/locale"
import type { RegisterSurat, CetakGroup } from "@/types/surat.types"

export function groupCetakData(data: RegisterSurat[]): CetakGroup[] {
  const map = new Map<string, CetakGroup>()

  for (const reg of data) {
    const dateStr = format(new Date(reg.tanggalTerima), "yyyy-MM-dd")
    const key     = `${dateStr}__${reg.dept.shortName}`

    if (!map.has(key)) {
      // ✅ Tambah field label langsung di sini
      const labelDate = format(new Date(reg.tanggalTerima), "dd MMMM yyyy", { locale: id })
                          .toUpperCase()
      map.set(key, {
        key,
        label:     `${labelDate} (${reg.dept.shortName})`, // ✅ "23 APRIL 2026 (CID)"
        date:      reg.tanggalTerima,
        dept:      reg.dept.shortName,
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
  return data.reduce((sum, r) => sum + r.detailSurat.length, 0)
}