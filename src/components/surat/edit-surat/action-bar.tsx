import { X, Plus, Loader2, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FloatingActionBar({ state, actions }: any) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl shadow-2xl shadow-slate-900/10 dark:shadow-black/50">
        <Button variant="ghost" onClick={actions.handleBack} className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800">
          <X size={14} /> Batal
        </Button>
        <Button variant="ghost" onClick={state.isPI ? actions.addPI : actions.addSurat} className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Plus size={14} strokeWidth={2.5} /> Tambah
        </Button>
        <Button disabled={state.saving} onClick={actions.handleSave} className="gap-2 h-10 px-5 rounded-xl text-[13px] font-semibold bg-blue-600 hover:bg-blue-700 text-white">
          {state.saving ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</> : <><Save size={14} /> Simpan</>}
        </Button>
      </div>
    </div>
  )
}