"use client"

import { Loader2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Props {
  saving: boolean
  onCancel: () => void
}

export function DepartemenFormActionBar({ saving, onCancel }: Props) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/90 dark:shadow-black/50">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="h-10 gap-2 rounded-xl px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
        >
          <X size={14} /> Batal
        </Button>
        <Button
          type="submit"
          disabled={saving}
          className="h-10 gap-2 rounded-xl bg-blue-600 px-5 text-[13px] font-semibold text-white hover:bg-blue-700"
        >
          {saving
            ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</>
            : <><Save size={14} /> Simpan</>}
        </Button>
      </div>
    </div>
  )
}
