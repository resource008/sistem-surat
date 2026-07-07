export function CetakPrintStyles() {
  return (
    <style>{`
      .screen-view { display: block; }
      .print-view  { display: none;  }

      @media print {
        @page {
          size: A4 landscape;
          margin: 1cm 1.5cm;
        }

        :root, html { color-scheme: light !important; }

        .dark, [class*="dark"] {
          background: white !important;
          color: #000000 !important;
        }
        
        html.dark, .dark body, .dark #main-content,
        .dark #main-content > *, .dark .print-view {
          --background: 255 255 255 !important;
          --foreground: 0 0 0 !important;
          background-color: #ffffff !important;
          background: #ffffff !important;
          color: #000000 !important;
        }
          
        *, *::before, *::after {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-sizing: border-box !important;
          font-family: var(--font-figtree), "Figtree", Arial, sans-serif !important;
          font-size: 12pt !important;
        }

        html, body {
          background: white !important;
          color: #000 !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          height: auto !important;
        }

        #sidebar, #topbar {
          display: none !important;
          visibility: hidden !important;
          width: 0 !important;
          height: 0 !important;
          overflow: hidden !important;
          position: absolute !important;
        }

        script, noscript, template { display: none !important; }
        .fixed, [class*="fixed"]   { display: none !important; }

        #main-content {
          margin-left: 0 !important;
          padding-top: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          position: static !important;
          left: 0 !important;
          top: 0 !important;
        }

        #main-content > div {
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          background: white !important;
          box-shadow: none !important;
          border: none !important;
          overflow: visible !important;
        }

        .screen-view { display: none !important; }

        .print-view {
          display: block !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          text-transform: uppercase !important;
        }

        .print-view * {
          text-transform: uppercase !important;
        }

        /* ══ Print table ══════════════════════════════════════ */
        .pt {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
          margin-bottom: 12px;
        }

        .pt thead { display: table-header-group; }

        .pt thead th {
          border: 0.25pt solid #000;
          padding: 4px 5px;
          background-color: #FFD700 !important;
          color: #c00000 !important;
          font-weight: bold;
          text-transform: uppercase;
          text-align: left;
        }

        .pt tbody td {
          border: 0.25pt solid #000;
          padding: 3px 5px;
          vertical-align: middle;
          text-align: left;
          line-height: 1.4;
          word-break: break-word;
          color: #000 !important;
          background-color: #ffffff !important;
        }

        .pt tbody td[rowspan] {
          vertical-align: middle !important;
          text-align: left !important;
        }

        .pt tbody td.td-nomor {
          text-align: left !important;
          vertical-align: middle !important;
          padding-left: 6px !important;
        }

        .pt td.td-ttd {
          vertical-align: middle !important;
          text-align: center !important;
          min-height: 60px !important;
        }

        .pt .gh td {
          background-color: #FFD700 !important;
          color: #c00000 !important;
          font-weight: bold;
          padding: 4px 8px;
          border: 0.25pt solid #000;
          text-align: left !important;
          vertical-align: middle !important;
        }

        .pt tbody tr {
          page-break-inside: avoid;
          break-inside: avoid;
        }

        .pf {
          display: flex !important;
          justify-content: space-between;
          margin-top: 6px;
          padding-top: 4px;
          border-top: 0.25pt solid #aaa;
          color: #666;
        }

        .pf * { font-size: 10pt !important; }
      }
    `}</style>
  )
}
