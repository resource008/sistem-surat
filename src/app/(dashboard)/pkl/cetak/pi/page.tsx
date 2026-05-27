"use client"

import { CetakPageContent } from "@/components/surat/cetak/cetak-page"
import { CetakPrintViewPI } from "@/components/surat/cetak/print-view-pi"

export default function CetakPiPage() {
  return (
    <CetakPageContent
      sessionType="pi"
      activeFilter="PI"
      PrintView={CetakPrintViewPI}
    />
  )
}