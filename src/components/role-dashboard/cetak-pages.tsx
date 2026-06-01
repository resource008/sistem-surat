"use client"

import { CetakPageContent } from "@/components/surat/cetak/cetak-page"
import { CetakPrintView } from "@/components/surat/cetak/print-view"
import { CetakPrintViewPI } from "@/components/surat/cetak/print-view-pi"

export function RoleCetakAllPage() {
  return (
    <CetakPageContent
      sessionType="all"
      activeFilter="ALL"
      PrintView={CetakPrintView}
    />
  )
}

export function RoleCetakPiPage() {
  return (
    <CetakPageContent
      sessionType="pi"
      activeFilter="PI"
      PrintView={CetakPrintViewPI}
    />
  )
}
