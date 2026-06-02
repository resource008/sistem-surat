import { BrushCleaning, Printer } from "lucide-react"

export function FloatingActionBar({ state, actions }: any) {
  if (state.selectedIds.size === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full shadow-lg shadow-slate-200/60 dark:shadow-slate-900/60 animate-in fade-in slide-in-from-bottom-2 duration-200">
      <span className="text-[13px] font-medium text-slate-600 dark:text-slate-300 px-3">
        {state.selectedIds.size} item dipilih
      </span>
      <div className="w-px h-4 bg-slate-200 dark:bg-slate-700" />
      <button
        onClick={actions.handlePrint}
        className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium transition-colors shrink-0"
      >
        <Printer size={14} /> Cetak
      </button>
      <button
        onClick={actions.clearSelection}
        className="flex items-center gap-1.5 h-8 px-3.5 rounded-full bg-slate-100 hover:bg-red-50 dark:bg-slate-800 dark:hover:bg-red-900/20 text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 text-[13px] font-medium border border-slate-200 dark:border-slate-700 hover:border-red-200 dark:hover:border-red-800 transition-colors shrink-0"
      >
        <BrushCleaning size={13} /> Bersihkan
      </button>
    </div>
  )
}