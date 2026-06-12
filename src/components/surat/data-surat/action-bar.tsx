import { FloatingActionBarShell } from "@/components/shared/floating-action-bar"
import { BrushCleaning, Printer } from "lucide-react"

export function FloatingActionBar({ state, actions }: any) {
  return (
    <FloatingActionBarShell
      hidden={state.selectedIds.size === 0}
      variant="selection"
    >
      <span className="whitespace-nowrap text-xs font-semibold text-slate-700 dark:text-slate-200 sm:px-1 sm:text-[13px] md:text-sm">
        {state.selectedIds.size} item dipilih
      </span>

      <div className="grid w-full grid-cols-2 gap-2 sm:flex sm:w-auto sm:items-center sm:gap-3">
        <button
          onClick={actions.handlePrint}
          aria-label="Cetak"
          title="Cetak"
          className="
            flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-full
            bg-blue-600 px-3 text-xs font-semibold text-white
            transition-colors hover:bg-blue-700 active:bg-blue-800
            sm:min-w-28 sm:gap-2 sm:px-4 sm:text-[13px]
            md:h-10 md:min-w-32 md:text-sm
          "
        >
          <Printer size={16} className="shrink-0 md:size-[18px]" />
          <span className="truncate">Cetak</span>
        </button>

        <button
          onClick={actions.clearSelection}
          aria-label="Bersihkan"
          title="Bersihkan"
          className="
            flex h-9 min-w-0 items-center justify-center gap-1.5 rounded-full
            bg-slate-100 px-3 text-xs font-semibold text-slate-500
            transition-colors hover:bg-slate-200 hover:text-red-500
            active:bg-slate-300 sm:min-w-28 sm:px-4 sm:text-[13px]
            dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700
            dark:hover:text-red-400
          "
        >
          <BrushCleaning size={16} className="shrink-0" />
          <span className="truncate">Bersihkan</span>
        </button>
      </div>
    </FloatingActionBarShell>
  )
}
