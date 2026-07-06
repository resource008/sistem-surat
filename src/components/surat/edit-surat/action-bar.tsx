import { FloatingActionBarShell } from "@/components/shared/floating-action-bar"
import { Button } from "@/components/ui/button"
import { Loader2, Plus, Save, X } from "lucide-react"

export function FloatingActionBar({ state, actions }: any) {
  return (
    <FloatingActionBarShell contentClassName="border-slate-200 bg-white shadow-none backdrop-blur-none dark:border-neutral-700 dark:bg-neutral-950">
      <Button
        variant="action-neutral"
        size="fab-action"
        onClick={actions.handleBack}
      >
        <X size={14} /> Batal
      </Button>
      <Button
        variant="action-secondary"
        size="fab-action"
        onClick={actions.addSurat}
      >
        <Plus size={14} strokeWidth={2.5} /> Tambah
      </Button>
      <Button
        variant="action-primary"
        size="fab-action"
        disabled={state.saving}
        onClick={actions.handleSave}
        className="px-5 font-semibold"
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
