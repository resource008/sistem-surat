"use client"

import { CetakPageContent } from "@/components/surat/cetak/cetak-page"
import { CetakPrintView } from "@/components/surat/cetak/print-view"

export function RoleCetakAllPage() {
  return (
    <CetakPageContent
      activeFilter="ALL"
      PrintView={CetakPrintView}
    />
  )
}
