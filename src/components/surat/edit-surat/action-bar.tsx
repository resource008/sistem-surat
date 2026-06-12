import { FloatingActionBarShell } from "@/components/shared/floating-action-bar"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Save, X } from "lucide-react"

export function FloatingActionBar({ state, actions }: any) {
  return (
    <FloatingActionBarShell>
      <Button
        variant="ghost"
        onClick={actions.handleBack}
        className="h-10 gap-2 rounded-xl px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <X size={14} /> Batal
      </Button>
      <Button
        variant="ghost"
        onClick={state.isPI ? actions.addPI : actions.addSurat}
        className="h-10 gap-2 rounded-xl px-4 text-[13px] font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <Plus size={14} strokeWidth={2.5} /> Tambah
      </Button>
      <Button
        disabled={state.saving}
        onClick={actions.handleSave}
        className="h-10 gap-2 rounded-xl bg-blue-600 px-5 text-[13px] font-semibold text-white hover:bg-blue-700"
      >
        {state.saving ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Menyimpan...
          </>
        ) : (
          <>
            <Save size={14} /> Simpan
          </>
        )}
      </Button>
    </FloatingActionBarShell>
  )
}
