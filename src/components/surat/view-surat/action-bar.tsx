import { FloatingActionBarShell } from "@/components/shared/floating-action-bar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Edit3, Loader2, Trash2} from "lucide-react"

interface Props {
  deleting:         boolean
  canEdit:          boolean
  canDelete:        boolean
  onBack:           () => void
  onEdit:           () => void
  onDeleteRequest:  () => void
}

export function ViewActionBar({
  deleting, canEdit, canDelete, onBack, onEdit, onDeleteRequest,
}: Props) {
  return (
    <FloatingActionBarShell contentClassName="border-slate-200 bg-white shadow-none backdrop-blur-none dark:border-slate-700 dark:bg-slate-950">
      <Button
        variant="ghost"
        onClick={onBack}
        className="h-10 gap-2 rounded-xl px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <ArrowLeft size={14} /> Kembali
      </Button>

      {canEdit && (
        <Button
          variant="ghost"
          onClick={onEdit}
          className="h-10 gap-2 rounded-xl px-4 text-[13px] font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-blue-900/30 dark:hover:text-blue-300"
        >
          <Edit3 size={14} /> Edit
        </Button>
      )}

      {canDelete && (
        <Button
          variant="ghost"
          onClick={onDeleteRequest}
          disabled={deleting}
          className="h-10 gap-2 rounded-xl bg-red-600 px-5 text-[13px] font-semibold text-white hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-60 dark:bg-red-600 dark:text-white dark:hover:bg-red-700"
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          Hapus
        </Button>
      )}
    </FloatingActionBarShell>
  )
}
