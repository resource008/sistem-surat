import { BrushCleaning, Printer } from "lucide-react"

export function FloatingActionBar({ state, actions }: any) {
  if (state.selectedIds.size === 0) return null

  return (
    <div className="
      fixed bottom-6 left-1/2 -translate-x-1/2 z-50
      flex items-center gap-2
      px-3 py-2
      bg-white dark:bg-slate-900
      border border-slate-200 dark:border-slate-700
      rounded-2xl
      shadow-md
    ">
      {/* Label teks — hanya muncul di sm ke atas */}
      <span className="
        hidden sm:block
        px-2 text-xs font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap
      ">
        {state.selectedIds.size} item dipilih
      </span>

      {/* Badge angka — hanya muncul di mobile */}
      <span className="
        sm:hidden
        flex items-center justify-center
        w-7 h-7 rounded-full
        bg-slate-100 dark:bg-slate-800
        text-xs font-medium text-slate-500 dark:text-slate-400
      ">
        {state.selectedIds.size}
      </span>

      <button
        onClick={actions.handlePrint}
        aria-label="Cetak"
        className="
          flex items-center justify-center gap-1
          h-7
          w-9 sm:w-auto sm:px-3
          rounded-full
          bg-blue-600 hover:bg-blue-700
          text-white text-xs font-medium
          transition-colors
        "
      >
        <Printer size={14} />
        <span className="hidden sm:inline">Cetak</span>
      </button>

      <button
        onClick={actions.clearSelection}
        aria-label="Bersihkan"
        className="
          flex items-center justify-center gap-1
          h-7
          w-9 sm:w-auto sm:px-3
          rounded-full
          bg-slate-100 hover:bg-slate-200
          text-slate-500 hover:text-red-500
          text-xs font-medium
          transition-colors
        "
      >
        <BrushCleaning size={14} />
        <span className="hidden sm:inline">Bersihkan</span>
      </button>
    </div>
  )
}