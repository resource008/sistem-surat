import { FloatingActionBarShell } from "@/components/shared/floating-action-bar"
import { Button } from "@/components/ui/button"
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
        <Button
          type="button"
          onClick={actions.handlePrint}
          aria-label="Cetak"
          title="Cetak"
          variant="action-primary"
          size="action-selection"
        >
          <Printer size={16} className="shrink-0 md:size-[18px]" />
          <span className="truncate">Cetak</span>
        </Button>

        <Button
          type="button"
          onClick={actions.clearSelection}
          aria-label="Bersihkan"
          title="Bersihkan"
          variant="action-clear"
          size="action-selection"
        >
          <BrushCleaning size={16} className="shrink-0" />
          <span className="truncate">Bersihkan</span>
        </Button>
      </div>
    </FloatingActionBarShell>
  )
}
