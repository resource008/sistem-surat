"use client"

import { FileX2, PrinterIcon } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"
import type { ReactNode } from "react"

interface CetakEmptyProps {
  title?: string
  description?: ReactNode
}

export function CetakEmpty({
  title = "Tidak Ada Data untuk Dicetak",
  description,
}: CetakEmptyProps) {
  return (
    <EmptyState
      icon={FileX2}
      badgeIcon={PrinterIcon}
      title={title}
      description={description ?? (
        <>
          Pilih satu atau beberapa surat dari daftar, lalu klik&nbsp;
          <strong className="text-slate-500 dark:text-slate-400">Cetak</strong>
          &nbsp;untuk melanjutkan.
        </>
      )}
      className="min-h-105"
    />
  )
}
