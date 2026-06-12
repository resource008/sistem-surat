import { FloatingActionBarShell } from "@/components/shared/floating-action-bar"
import { Button } from "@/components/ui/button"
import { Loader2, Save, X } from "lucide-react"

export function FloatingActionBar({ state, actions }: any) {
  return (
    <FloatingActionBarShell>
      <Button
        type="button"
        variant="ghost"
        onClick={actions.handleBack}
        className="h-10 gap-2 rounded-xl px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <X size={14} /> Batal
      </Button>
      <Button
        type="submit"
        variant="ghost"
        disabled={state.saving || !state.deptId}
        className="h-10 gap-2 rounded-xl px-4 text-[13px] font-medium text-blue-600 hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-blue-400 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
      >
        {state.saving ? (
          <>
            <Loader2 size={14} className="animate-spin" /> Menyimpan...
          </>
        ) : (
          <>
            <Save size={14} /> Simpan
            {state.itemCount > 1 ? ` ${state.itemCount} ${state.itemLabel}` : ""}
          </>
        )}
      </Button>
    </FloatingActionBarShell>
  )
}
