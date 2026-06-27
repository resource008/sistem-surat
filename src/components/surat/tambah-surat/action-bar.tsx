import { FloatingActionBarShell } from "@/components/shared/floating-action-bar"
import { Button } from "@/components/ui/button"
import { Loader2, Save, X } from "lucide-react"

export function FloatingActionBar({ state, actions, formId }: any) {
  return (
    <FloatingActionBarShell>
      <Button
        type="button"
        variant="action-neutral"
        size="fab-action"
        onClick={actions.handleBack}
      >
        <X size={14} /> Batal
      </Button>
      {(!state.deptId || state.hasFillableColumns) && (
        <Button
          type="submit"
          form={formId}
          variant="action-primary"
          size="fab-action"
          disabled={state.saving || !state.deptId}
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
      )}
    </FloatingActionBarShell>
  )
}
