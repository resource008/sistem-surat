// ============================================================
// src/components/admin/users/users-delete.tsx
// Dialog konfirmasi hapus user
// ============================================================

"use client"

import { useUserActions } from "@/hooks/use-users"
import type { User }      from "@/domain/user/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
}                         from "@/components/ui/alert-dialog"

interface Props {
  open:      boolean
  onClose:   () => void
  onSuccess: () => void
  user:      User | null
}

export function UsersDelete({ open, onClose, onSuccess, user }: Props) {
  const { deleteUser, loading } = useUserActions(onSuccess)

  async function handleDelete() {
    if (!user) return
    const result = await deleteUser(user.id)
    if (result.success) onClose()
  }

  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onClose() }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Hapus User</AlertDialogTitle>
          <AlertDialogDescription>
            Anda yakin ingin menghapus user{" "}
            <span className="font-semibold text-foreground">
              {user?.name}
            </span>{" "}
            ({user?.email})? Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading ? "Menghapus..." : "Ya, Hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}