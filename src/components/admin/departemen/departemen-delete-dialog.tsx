"use client"

import { Loader2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Departemen } from "@/types"

interface Props {
  departemen: Departemen | null
  deletingAction: "permanent" | null
  onOpenChange: (open: boolean) => void
  onPermanentDelete: () => void
}

export function DepartemenDeleteDialog({
  departemen,
  deletingAction,
  onOpenChange,
  onPermanentDelete,
}: Props) {
  const isDeleting = deletingAction !== null

  return (
    <Dialog
      open={!!departemen}
      onOpenChange={(open) => {
        if (!open && isDeleting) return
        onOpenChange(open)
      }}
    >
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Hapus permanen departemen?</DialogTitle>
          <DialogDescription>
            Hapus permanen akan menghapus data departemen dari database.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Batal
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={onPermanentDelete}
            disabled={isDeleting}
          >
            {deletingAction === "permanent" && <Loader2 className="size-4 animate-spin" />}
            Hapus permanen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
