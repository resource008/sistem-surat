import { formatTanggalCetak } from "@/lib/surat-helpers";
import type { DetailPI, RegisterPI } from "@/types/surat-types";
import React from 'react';

export interface CetakGroupPI {
  key: string; label: string; date: string; dept: string; registers: RegisterPI[]
}

interface Props {
  groups: CetakGroupPI[]
  totalSurat: number
  printedAt: string
}

export function CetakPrintViewPI({ groups = [], totalSurat = 0, printedAt = '' }: Props) {
  return (
    <div className="print-view">
      <table className="pt">
        <thead>
          <tr>
            <th>NO. SURAT</th>
            <th>TGL. TERIMA</th>
            <th>NAMA SUPPLIER</th>
            <th>NO. INVOICE</th>
            <th>NO. SURAT</th>
            <th>TGL. SURAT</th>
            <th>TUJUAN</th>
            <th>TANDA TERIMA</th>
          </tr>
        </thead>

        <tbody>
          {groups.map((group: CetakGroupPI) => (
            <React.Fragment key={group.key}>
              <tr className="gh"><td colSpan={8}>{group.label}</td></tr>

              {group.registers.flatMap((reg: RegisterPI) => {
                const details = reg.detailPI?.length ? reg.detailPI : [{}] as DetailPI[]
                const span = details.length
                const tglTerima = formatTanggalCetak(reg.tanggalTerima)

                return details.map((detail: DetailPI, idx: number) => {
                  const tglSurat = formatTanggalCetak(detail.tanggalSurat)

                  return (
                    <tr key={`${reg.id}-${idx}`}>
                      {idx === 0 && (
                        <>
                          <td rowSpan={span} className="td-nomor"><b>{reg.nomor}</b></td>
                          <td rowSpan={span}>{tglTerima}</td>
                        </>
                      )}
                      <td>{detail.namaSupplier ?? '-'}</td>
                      <td>{detail.noInvoice    ?? '-'}</td>
                      <td>{detail.nomorSurat   ?? '-'}</td>
                      <td>{tglSurat}</td>
                      <td>{detail.tujuan       ?? '-'}</td>
                      {idx === 0 && <td rowSpan={span} className="td-ttd"></td>}
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