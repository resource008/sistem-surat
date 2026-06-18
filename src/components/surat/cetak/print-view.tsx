import { isCetakRowSpanColumn } from "@/domain/surat/custom-fields"
import { formatTanggalCetak, getCetakColumnValue } from "@/lib/surat-helpers"
import type { CetakGroup, DetailSurat, RegisterSurat } from "@/types/surat-types"

interface Props {
  groups: CetakGroup[]
  totalSurat?: number
  printedAt?: string
}

export function CetakPrintView({ groups = [] }: Props) {
  return (
    <div className="print-view">
      {groups.map((group: CetakGroup) => {
        const columns = group.columns ?? group.registers[0]?.dept?.columns ?? []

        return (
          <table key={group.key} className="pt">
            <thead>
              <tr className="gh">
                <td colSpan={columns.length + 1}>
                  {formatTanggalCetak(group.date)} ({group.dept})
                </td>
              </tr>
              <tr>
                {columns.map((column) => (
                  <th key={column.id}>{column.label}</th>
                ))}
                <th>TANDA TERIMA</th>
              </tr>
            </thead>

            <tbody>
              {group.registers.flatMap((reg: RegisterSurat) => {
                const details = reg.detailSurat ?? []

                return details.map((detail: DetailSurat, idx: number) => (
                  <tr key={`${reg.id}-${idx}`}>
                    {columns.map((column) => {
                      if (isCetakRowSpanColumn(column)) {
                        if (idx > 0) return null

                        return (
                          <td key={column.id} rowSpan={details.length}>
                            {getCetakColumnValue(column, reg, detail)}
                          </td>
                        )
                      }

                      return (
                        <td key={column.id} className={column.id.includes("default_nomor_register") ? "td-nomor" : undefined}>
                          {getCetakColumnValue(column, reg, detail)}
                        </td>
                      )
                    })}
                    {idx === 0 && <td rowSpan={details.length} className="td-ttd"></td>}
                  </tr>
                ))
              })}
            </tbody>
          </table>
        )
      })}
    </div>
  )
}
