import React          from 'react'
import { format }     from "date-fns"
import { id }         from "date-fns/locale"
import type { CetakGroup, RegisterSurat, DetailSurat } from "@/types/surat.types"

interface Props {
  groups     : CetakGroup[]
  totalSurat : number
  printedAt  : string
}

export function CetakPrintView({ groups = [], totalSurat = 0, printedAt = '' }: Props) {
  return (
    <div className="print-view">
      <table className="pt">

        {/* ✅ Tidak ada komentar di dalam <colgroup> */}
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
          {groups.map((group: CetakGroup) => (
            <React.Fragment key={group.key}>

              <tr className="gh">
                <td colSpan={9}>{group.label}</td>
              </tr>

              {group.registers.flatMap((reg: RegisterSurat) => {
                const details = reg.detailSurat ?? []
                const span    = details.length || 1

                const tglTerima = reg.tanggalTerima
                  ? format(new Date(reg.tanggalTerima), "dd MMMM yyyy", { locale: id }).toUpperCase()
                  : '-'

                return details.map((detail: DetailSurat, idx: number) => {
                  const tglSurat = detail.tanggalSurat
                    ? format(new Date(detail.tanggalSurat), "dd MMMM yyyy", { locale: id }).toUpperCase()
                    : '-'

                  return (
                    // ✅ Tidak ada komentar di dalam <tr>
                    <tr key={`${reg.id}-${idx}`}>
                      {idx === 0 && (
                        <>
                          <td rowSpan={span}><b>{reg.nomor}</b></td>
                          <td rowSpan={span}>{tglTerima}</td>
                          <td rowSpan={span}>{reg.asalSurat}</td>
                        </>
                      )}
                      <td>{detail.perihal}</td>
                      <td>{detail.lampiran ?? '-'}</td>
                      <td>{tglSurat}</td>
                      <td>{detail.noSurat ?? '-'}</td>
                      {idx === 0 && (
                        <>
                          <td rowSpan={span}>{reg.tujuan}</td>
                          <td rowSpan={span} className="td-ttd"></td>
                        </>
                      )}
                    </tr>
                  )
                })
              })}

            </React.Fragment>
          ))}
        </tbody>
      </table>

      <div className="pf">
        <span>Total: {totalSurat} surat dalam {groups.length} grup</span>
        <span>Dicetak: {printedAt}</span>
      </div>
    </div>
  )
}