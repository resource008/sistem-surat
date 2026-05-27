"use client"

import { CetakPageContent }  from "@/components/surat/cetak/cetak-page"
import { CetakPrintView }    from "@/components/surat/cetak/print-view"

export default function CetakAllPage() {
  return (
    <CetakPageContent
      sessionType="all"
      activeFilter="ALL"
      PrintView={CetakPrintView}
    />
  )
}