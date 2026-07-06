import { FloatingActionBarShell } from "@/components/shared/floating-action-bar"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, Pencil, Trash2} from "lucide-react"

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
    <FloatingActionBarShell contentClassName="border-slate-200 bg-white shadow-none backdrop-blur-none dark:border-neutral-700 dark:bg-neutral-950">
      <Button
        variant="action-neutral"
        size="fab-action"
        onClick={onBack}
      >
        <ArrowLeft size={14} /> Kembali
      </Button>

      {canEdit && (
        <Button
          variant="action-edit"
          size="fab-action"
          onClick={onEdit}
        >
          <Pencil size={14} /> Edit
        </Button>
      )}

      {canDelete && (
        <Button
          variant="action-danger"
          size="fab-action"
          onClick={onDeleteRequest}
          disabled={deleting}
          className="px-5 font-semibold"
        >
          {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          Hapus
        </Button>
      )}
    </FloatingActionBarShell>
  )
}
