import type { CetakGroup } from "@/types/surat"
import { format } from "date-fns"
import { id } from "date-fns/locale"
import { getSuratTujuan } from "@/lib/surat-helpers"

function esc(str: string | null | undefined): string {
  if (!str) return ""
  return str
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#039;")
}

function fmtDate(dateStr: string | null | undefined, fallback = "-"): string {
  if (!dateStr) return fallback
  try {
    return format(new Date(dateStr), "dd MMM yyyy", { locale: id })
  } catch {
    return fallback
  }
}

function fmtDateLong(dateStr: string | null | undefined): string {
  if (!dateStr) return ""
  try {
    return format(new Date(dateStr), "dd MMMM yyyy", { locale: id })
  } catch {
    return ""
  }
}

function buildRows(groups: CetakGroup[]): string {
  let html = ""
  let rowIndex = 0

  for (const group of groups) {
    // ── Group header row ──────────────────────────────────────
    html += `
      <tr class="group-header">
        <td colspan="8">
          ${esc(fmtDateLong(group.date)).toUpperCase()}
          (${esc(group.dept)})
        </td>
      </tr>`

    // ── Data rows ─────────────────────────────────────────────
    for (const reg of group.registers) {
      for (let dIdx = 0; dIdx < reg.detailSurat.length; dIdx++) {
        const detail  = reg.detailSurat[dIdx]
        const isFirst = dIdx === 0
        const isEven  = rowIndex % 2 === 0

        html += `
          <tr class="${isEven ? "row-even" : "row-odd"}">
            <td class="cell-mono cell-bold cell-nowrap">
              ${isFirst ? esc(reg.nomor) : ""}
            </td>
            <td class="cell-nowrap">
              ${isFirst ? esc(fmtDate(reg.tanggalTerima)) : ""}
            </td>
            <td>
              ${isFirst ? esc(reg.asalSurat ?? "-") : ""}
            </td>
            <td>${esc(detail.perihal)}</td>
            <td class="cell-center">
              ${esc(detail.lampiran ?? "-")}
            </td>
            <td class="cell-nowrap">
              ${esc(fmtDate(detail.tanggalSurat))}
            </td>
            <td class="cell-mono">
              ${esc(detail.noSurat ?? "-")}
            </td>
            <td class="cell-center">
              ${isFirst ? esc(getSuratTujuan(reg, detail)) : ""}
            </td>
          </tr>`

        rowIndex++
      }
    }
  }

  return html
}

export function generateCetakHTML(
  groups:     CetakGroup[],
  totalSurat: number,
  printedAt:  string,
): string {
  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Cetak Surat</title>
  <style>
    /* ── Page ─────────────────────────────────────────────── */
    @page {
      size: A4 landscape;
      margin: 1cm 1.5cm;
    }

    *, *::before, *::after {
      box-sizing                 : border-box;
      -webkit-print-color-adjust : exact !important;
      print-color-adjust         : exact !important;
    }

    body {
      margin      : 0;
      padding     : 0;
      background  : white;
      color       : #000;
      font-family : Arial, Helvetica, sans-serif;
      font-size   : 9pt;
    }

    /* ── Table ─────────────────────────────────────────────── */
    table {
      width           : 100%;
      border-collapse : collapse;
      table-layout    : fixed;
      font-size       : 8.5pt;
    }

    /* Header diulang setiap halaman */
    thead {
      display: table-header-group;
    }

    /* ── Column header ─────────────────────────────────────── */
    thead th {
      border           : 2px solid #000;
      padding          : 5px 6px;
      background-color : #FFD700;
      color            : #c00000;
      font-weight      : bold;
      text-transform   : uppercase;
      font-size        : 8pt;
      letter-spacing   : 0.03em;
      text-align       : left;
    }

    /* ── Data cells ────────────────────────────────────────── */
    td {
      border         : 1px solid #000;
      padding        : 3px 6px;
      vertical-align : top;
      line-height    : 1.5;
      word-break     : break-word;
    }

    /* ── Group header row ──────────────────────────────────── */
    tr.group-header td {
      background-color : #FFD700;
      color            : #c00000;
      font-weight      : bold;
      font-size        : 9pt;
      padding          : 5px 8px;
      border           : 2px solid #000;
      text-align       : left;
    }

    /* ── Zebra rows ────────────────────────────────────────── */
    tr.row-even td { background-color: #ffffff; }
    tr.row-odd  td { background-color: #f0f0f0; }

    /* Jangan potong baris antar halaman */
    tbody tr {
      page-break-inside : avoid;
      break-inside      : avoid;
    }

    /* ── Utility ────────────────────────────────────────────── */
    .cell-mono   { font-family: "Courier New", Courier, monospace; }
    .cell-bold   { font-weight: 700; }
    .cell-nowrap { white-space: nowrap; }
    .cell-center { text-align: center; }

    /* ── Footer ─────────────────────────────────────────────── */
    .footer {
      display         : flex;
      justify-content : space-between;
      margin-top      : 8px;
      padding-top     : 5px;
      border-top      : 1px solid #aaa;
      font-size       : 7.5pt;
      color           : #666;
    }
  </style>
</head>
<body>
  <table>
    <thead>
      <tr>
        <th style="width:9%">No. Surat</th>
        <th style="width:10%">Tgl. Terima</th>
        <th style="width:14%">Asal Surat</th>
        <th>Perihal</th>
        <th style="width:6%">Lamp.</th>
        <th style="width:9%">Tgl. Surat</th>
        <th style="width:14%">No. Surat</th>
        <th style="width:8%">Tujuan</th>
      </tr>
    </thead>
    <tbody>
      ${buildRows(groups)}
    </tbody>
  </table>

  <div class="footer">
    <span>Total: ${totalSurat} surat dalam ${groups.length} grup</span>
    <span>Dicetak: ${esc(printedAt)}</span>
  </div>
</body>
</html>`
}
