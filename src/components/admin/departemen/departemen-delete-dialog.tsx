"use client"

import { Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Departemen } from "@/types"

interface Props {
  departemen: Departemen | null
  deletingId: string | null
  onOpenChange: (open: boolean) => void
  onDelete: () => void
}

export function DepartemenDeleteDialog({
  departemen,
  deletingId,
  onOpenChange,
  onDelete,
}: Props) {
  return (
    <AlertDialog open={!!departemen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus departemen?</AlertDialogTitle>
          <AlertDialogDescription>
            Departemen {departemen?.shortName} akan disembunyikan dari daftar pilihan.
            Data surat lama tetap aman.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={!!deletingId}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            disabled={!!deletingId}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {deletingId && <Loader2 className="size-4 animate-spin" />}
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
