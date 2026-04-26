// Cetak-specific empty state — compose dari generic EmptyState
"use client"

import { ArrowLeft, FileX2, PrinterIcon } from "lucide-react"
import { EmptyState } from "@/components/shared/empty-state"

interface CetakEmptyProps {
  onBack: () => void
}

export function CetakEmpty({ onBack }: CetakEmptyProps) {
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
      action={
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-lg
            border border-slate-200 dark:border-slate-700
            bg-white dark:bg-slate-900
            px-4 py-2 text-[13px] font-medium
            text-slate-600 dark:text-slate-300
            shadow-sm transition
            hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Daftar Surat
        </button>
      }
    />
  )
}