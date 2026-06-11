import { BrushCleaning, Printer } from "lucide-react"

export function FloatingActionBar({ state, actions }: any) {
  if (state.selectedIds.size === 0) return null

  return (
    <div
      className="
        fixed bottom-5 left-3 right-3 z-50
        flex flex-col items-center gap-2 rounded-2xl
        border border-slate-200/80 bg-white/95 px-3 py-2.5
        shadow-xl shadow-slate-900/10 backdrop-blur
        dark:border-slate-700/70 dark:bg-slate-900/95 dark:shadow-black/40
        sm:bottom-6 sm:left-1/2 sm:right-auto sm:w-fit sm:-translate-x-1/2
        sm:flex-row sm:gap-3 sm:px-4
      "
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
    </div>
  )
}
