// components/surat/cetak-empty.tsx
"use client"

import { FileX2, PrinterIcon } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"

export function CetakEmpty() {
  return (
    <EmptyState
      icon={FileX2}
      badgeIcon={PrinterIcon}
      title="Tidak Ada Data untuk Dicetak"
      description={
        <>
          Pilih satu atau beberapa surat dari daftar, lalu klik&nbsp;
          <strong className="text-slate-500 dark:text-slate-400">Cetak</strong>
          &nbsp;untuk melanjutkan.
        </>
      }
      className="min-h-105"
    />
  )
}