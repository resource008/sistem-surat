// src/components/admin/users/users-delete.tsx
"use client"

import { useUserActions } from "@/hooks/use-users"
import type { User }      from "@/domain/user/types"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Props {
  open:         boolean
  onOpenChange: (open: boolean) => void
  user:         User | null
  onSuccess:    () => void
}

export default function UsersDelete({ open, onOpenChange, user, onSuccess }: Props) {
  const { deleteUser, loading } = useUserActions(() => {
    onSuccess()
    onOpenChange(false)
  })

  async function handleConfirm() {
    if (!user) return
    await deleteUser(user.id)
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus Pengguna?</AlertDialogTitle>
          <AlertDialogDescription>
            Akun <span className="font-semibold text-foreground">{user?.name}</span> akan
            dihapus permanen dan tidak dapat dikembalikan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            {loading ? "Menghapus..." : "Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}