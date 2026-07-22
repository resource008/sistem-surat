import { FloatingActionBarShell } from "@/components/shared/floating-action-bar"
import { Button } from "@/components/ui/button"
import { ADD_RIGHT_SURAT_GROUP_EVENT, getCustomSuratColumns } from "../custom-fields"
import { Loader2, Plus, Save, X } from "lucide-react"

export function FloatingActionBar({ state, actions }: any) {
  const rightColumns = getCustomSuratColumns(state.selectedCustomColumns, true)
    .filter((_: unknown, index: number) => index % 2 === 1)
  const canAddRightData = rightColumns.length > 0

  const handleAddData = () => {
    if (!canAddRightData) return
    window.dispatchEvent(new Event(ADD_RIGHT_SURAT_GROUP_EVENT))
  }

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
        disabled={!canAddRightData}
        onClick={handleAddData}
        title={canAddRightData ? "Tambah data tambahan" : "Tidak ada kolom tambahan di sisi kanan"}
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
