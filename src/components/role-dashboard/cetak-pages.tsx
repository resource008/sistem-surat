"use client"

import { CetakPageContent } from "@/components/surat/cetak/cetak-page"
import { CetakPrintView } from "@/components/surat/cetak/print-view"

interface RoleCetakPageProps {
  printSheetName: string
}

export function RoleCetakPage({ printSheetName }: RoleCetakPageProps) {
  return (
    <CetakPageContent
      printSheetName={printSheetName}
      PrintView={CetakPrintView}
    />
  )
}
