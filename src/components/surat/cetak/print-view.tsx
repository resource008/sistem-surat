import { NOMOR_DEFAULT_ID } from "@/constants/departemen-columns"
import { isCetakRowSpanColumn } from "@/domain/surat/custom-fields"
import {
  getSuratColumnGroupValue,
  getSuratDetailGroupCount,
  isSuratGroupedColumn,
} from "@/lib/surat-display"
import { formatTanggalCetak, getCetakColumnValue, getCetakPrintColumns } from "@/lib/surat-helpers"
import type { CetakGroup, DetailSurat, RegisterSurat } from "@/types/surat"

interface Props {
  groups: CetakGroup[]
  totalSurat?: number
  printedAt?: string
}

export function CetakPrintView({ groups = [] }: Props) {
  return (
    <div className="print-view">
      {groups.map((group: CetakGroup) => {
        const columns = getCetakPrintColumns(group.registers[0])

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

                return details.flatMap((detail: DetailSurat, idx: number) => {
                  const groupedColumns = columns.filter((column) => isSuratGroupedColumn(column, reg, detail))
                  const hasGroupedColumns = groupedColumns.length > 0
                  const staticColumns = hasGroupedColumns
                    ? columns.filter((column) => !isSuratGroupedColumn(column, reg, detail))
                    : []
                  const rowColumns = hasGroupedColumns ? groupedColumns : columns
                  const groupRows = Array.from({ length: hasGroupedColumns ? getSuratDetailGroupCount(detail) : 1 })

                  return groupRows.map((_, groupIndex) => (
                  <tr key={`${reg.id}-${idx}-${groupIndex}`}>
                    {groupIndex === 0 && staticColumns.map((column) => {
                      if (isCetakRowSpanColumn(column)) {
                        return (
                          <td key={column.id} rowSpan={groupRows.length}>
                            {getCetakColumnValue(column, reg, detail)}
                          </td>
                        )
                      }

                      return (
                        <td key={column.id} rowSpan={groupRows.length} className={column.id.includes(NOMOR_DEFAULT_ID) ? "td-nomor" : undefined}>
                          {getCetakColumnValue(column, reg, detail)}
                        </td>
                      )
                    })}
                    {rowColumns.map((column) => (
                      <td key={column.id} className={column.id.includes(NOMOR_DEFAULT_ID) ? "td-nomor" : undefined}>
                        {hasGroupedColumns
                          ? getSuratColumnGroupValue(column, reg, detail, groupIndex)
                          : getCetakColumnValue(column, reg, detail)}
                      </td>
                    ))}
                    {idx === 0 && groupIndex === 0 && <td rowSpan={details.reduce((total, item) => total + getSuratDetailGroupCount(item), 0)} className="td-ttd"></td>}
                  </tr>
                  ))
                })
              })}
            </tbody>
          </table>
        )
      })}
    </div>
  )
}
