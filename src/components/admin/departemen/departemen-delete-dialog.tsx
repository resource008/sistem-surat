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
  deletingAction: "soft" | "permanent" | null
  allowSoftDelete?: boolean
  onOpenChange: (open: boolean) => void
  onSoftDelete: () => void
  onPermanentDelete: () => void
}

export function DepartemenDeleteDialog({
  departemen,
  deletingAction,
  allowSoftDelete = true,
  onOpenChange,
  onSoftDelete,
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
          <DialogTitle>{allowSoftDelete ? "Hapus departemen?" : "Hapus permanen departemen?"}</DialogTitle>
          <DialogDescription>
            {allowSoftDelete
              ? "Pilih sembunyikan dari daftar jika data departemen tetap ingin disimpan. Pilih hapus permanen jika data departemen ingin dihapus dari database."
              : "Hapus permanen akan menghapus data departemen dari database."}
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
          {allowSoftDelete ? (
            <Button
              type="button"
              variant="secondary"
              onClick={onSoftDelete}
              disabled={isDeleting}
            >
              {deletingAction === "soft" && <Loader2 className="size-4 animate-spin" />}
              Sembunyikan dari daftar
            </Button>
          ) : null}
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
