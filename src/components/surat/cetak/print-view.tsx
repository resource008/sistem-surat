import { formatTanggalCetak } from "@/lib/surat-helpers"
import type { CetakGroup, DetailSurat, RegisterSurat } from "@/types/surat-types"
import React from 'react'

interface Props {
  groups: CetakGroup[]
  totalSurat: number
  printedAt: string
}

export function CetakPrintView({ groups = [], totalSurat = 0, printedAt = '' }: Props) {
  return (
    <div className="print-view">
      <table className="pt">
        <colgroup>
          <col style={{ width: '8%'  }} />
          <col style={{ width: '9%'  }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '26%' }} />
          <col style={{ width: '5%'  }} />
          <col style={{ width: '9%'  }} />
          <col style={{ width: '13%' }} />
          <col style={{ width: '7%'  }} />
          <col style={{ width: '12%' }} />
        </colgroup>

        <thead>
          <tr>
            <th>NO. SURAT</th>
            <th>TGL. TERIMA</th>
            <th>ASAL SURAT</th>
            <th>PERIHAL</th>
            <th>LAMP.</th>
            <th>TGL. SURAT</th>
            <th>NO. SURAT</th>
            <th>TUJUAN</th>
            <th>TANDA TERIMA</th>
          </tr>
        </thead>

        <tbody>
          {groups.map((group: CetakGroup) => {
            const totalDetailRows = group.registers.reduce((sum, reg) => sum + (reg.detailSurat?.length || 1), 0)
            let isFirstRowOfGroup = true

            return (
              <React.Fragment key={group.key}>
                <tr className="gh"><td colSpan={9}>{group.label}</td></tr>

                {group.registers.flatMap((reg: RegisterSurat) => {
                  const details = reg.detailSurat ?? []
                  const span = details.length || 1
                  const tglTerima = formatTanggalCetak(reg.tanggalTerima)

                  return details.map((detail: DetailSurat, idx: number) => {
                    const tglSurat = formatTanggalCetak(detail.tanggalSurat)
                    const isVeryFirstRow = isFirstRowOfGroup
                    if (isFirstRowOfGroup) isFirstRowOfGroup = false

                    return (
                      <tr key={`${reg.id}-${idx}`}>
                        {idx === 0 && (
                          <>
                            <td rowSpan={span} className="td-nomor"><b>{reg.nomor}</b></td>
                            <td rowSpan={span}>{tglTerima}</td>
                            <td rowSpan={span}>{reg.asalSurat}</td>
                          </>
                        )}
                        <td>{detail.perihal}</td>
                        <td>{detail.lampiran ?? '-'}</td>
                        <td>{tglSurat}</td>
                        <td>{detail.noSurat ?? '-'}</td>
                        {idx === 0 && <td rowSpan={span}>{reg.tujuan}</td>}
                        {isVeryFirstRow && <td rowSpan={totalDetailRows} className="td-ttd"></td>}
                      </tr>
                    )
                  })
                })}
              </React.Fragment>
            )
          })}
        </tbody>
      </table>

      <div className="pf">
        <span>Total: {totalSurat} surat dalam {groups.length} grup</span>
        <span>Dicetak: {printedAt}</span>
      </div>
    </div>
  )
}