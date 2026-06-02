import { ArrowLeft, Edit3, Loader2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

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
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
      <div className="inline-flex items-center gap-1 p-1.5 rounded-2xl
                      border border-slate-200/80 dark:border-slate-700/60
                      bg-white/90 dark:bg-slate-950/90
                      backdrop-blur-xl shadow-2xl
                      shadow-slate-900/10 dark:shadow-black/50">

        <Button variant="ghost" onClick={onBack}
          className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium
                     text-slate-600 dark:text-slate-300
                     hover:text-slate-900 dark:hover:text-white
                     hover:bg-slate-100 dark:hover:bg-slate-800">
          <ArrowLeft size={14} /> Kembali
        </Button>

        {canEdit && (
          <Button variant="ghost" onClick={onEdit}
            className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium
                       text-blue-600 dark:text-blue-400
                       hover:text-blue-700 dark:hover:text-blue-300
                       hover:bg-blue-50 dark:hover:bg-blue-900/30">
            <Edit3 size={14} /> Edit
          </Button>
        )}

        {canDelete && (
          <Button variant="ghost" onClick={onDeleteRequest}
            className="gap-2 h-10 px-4 rounded-xl text-[13px] font-medium
                       text-red-500 dark:text-red-400
                       hover:text-red-600 dark:hover:text-red-300
                       hover:bg-red-50 dark:hover:bg-red-900/30">
            {deleting
              ? <Loader2 size={14} className="animate-spin" />
              : <Trash2  size={14} />}
            Hapus
          </Button>
        )}

      </div>
    </div>
  )
}
