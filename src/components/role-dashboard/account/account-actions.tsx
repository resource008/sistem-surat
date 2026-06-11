"use client"

import { Loader2, Pencil, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"

type AccountActionsProps = {
  editing: boolean
  saving: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
}

export function AccountActions({
  editing,
  saving,
  onEdit,
  onCancel,
  onSave,
}: AccountActionsProps) {
  if (editing) {
    return (
      <div className="fixed bottom-7 right-7 z-50 flex items-center gap-4 max-sm:bottom-5 max-sm:right-5 max-sm:gap-3">
        <Button
          type="button"
          size="icon"
          variant="secondary"
          onClick={onCancel}
          disabled={saving}
          className="size-14 rounded-xl bg-neutral-200 text-neutral-600 shadow-none hover:bg-neutral-300 max-sm:size-12"
          title="Batal"
        >
          <X size={20} />
          <span className="sr-only">Batal</span>
        </Button>
        <Button
          type="button"
          size="icon"
          onClick={onSave}
          disabled={saving}
          className="size-14 rounded-xl bg-blue-600 text-white shadow-none hover:bg-blue-700 max-sm:size-12"
          title="Simpan"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          <span className="sr-only">Simpan</span>
        </Button>
      </div>
    )
  }

  return (
    <Button
      type="button"
      size="icon"
      onClick={onEdit}
      className="fixed bottom-7 right-7 z-50 size-14 rounded-xl bg-blue-600 text-white shadow-none hover:bg-blue-700 max-sm:bottom-5 max-sm:right-5 max-sm:size-12"
      title="Edit Akun"
    >
      <Pencil size={20} />
      <span className="sr-only">Edit Akun</span>
    </Button>
  )
}
