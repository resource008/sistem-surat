import { Button } from "@/components/ui/button"
import { Loader2, Save, X } from "lucide-react"

type UserAddActionBarProps = {
  loading: boolean
  onCancel: () => void
  onSave: () => void
}

export function UserAddActionBar({
  loading,
  onCancel,
  onSave,
}: UserAddActionBarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
      <div className="inline-flex items-center gap-1 rounded-2xl border border-slate-200/80 bg-white/90 p-1.5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl dark:border-slate-700/60 dark:bg-slate-950/90 dark:shadow-black/50">
        <Button
          variant="action-neutral"
          size="fab-action"
          onClick={onCancel}
        >
          <X size={14} /> Batal
        </Button>
        <Button
          variant="action-primary"
          size="fab-action"
          disabled={loading}
          onClick={onSave}
          className="px-5 font-semibold"
        >
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> Menyimpan...</>
            : <><Save size={14} /> Simpan</>}
        </Button>
      </div>
    </div>
  )
}
